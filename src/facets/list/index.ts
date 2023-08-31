import type { Bucket } from "../../context/state/use-search/response-with-facets-parser"
import type { ListFacetState, ListFacetConfig, ListFacetValues } from "./state"

import { addFilter } from "../../context/state/use-search/request-with-facets-creator"
import { ListFacetView } from "./view"
import { Facet } from ".."
import { EventName } from "../../constants"
import { ElasticSearchResponse, FacetType, SortBy, SortDirection } from "../../common"

function capitalize(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1)
}

interface ListAggregationTerms {
	field: string
	include?: string
	order?: { [sb in SortBy]?: SortDirection }
	size: number
}

export class ListFacet extends Facet<ListFacetConfig, ListFacetState> {
	type = FacetType.List
	View = ListFacetView

	actions = {
		showAll: (total: number) => {
			this.state.page = 0
			this.state.size = total
			this.dispatchChange()
		},
		setPage: (page: number) => {
			this.state.size = page * this.config.size!
			this.state.page = page
			this.dispatchChange()
		},
		toggleFilter: (key: string) => {
			this.state.page = 1
			this.state.size = this.config.size!

			if (this.state.filter?.has(key)) {
				this.actions.removeFilter(key)
			} else {
				const filter = new Set(this.state.filter)
				filter.add(key)
				this.state.filter = filter
				this.dispatchChange()	
			} 
		},
		toggleCollapse: () => {
			this.state.collapse = !this.state.collapse
			this.dispatchChange()
		},
		removeFilter: (value: string) => {
			const filter = new Set(this.state.filter)
			filter.delete(value)
			this.state.filter = filter.size ? filter : undefined
			this.dispatchChange()
		}
	}

	private dispatchChange() {
		const detail = { ID: this.ID, state: { ...this.state } }

		this.dispatchEvent(
			new CustomEvent(EventName.FacetStateChange, { detail })
		)
	}

	// Config
	protected initConfig(config: ListFacetConfig): ListFacetConfig {
		if (config.sort == null) delete config.sort

		return {
			title: capitalize(config.field),
			sort: {
				by: SortBy.Count,
				direction: SortDirection.Desc
			},
			...config,
			size: config.size || 10, /* if size is null, default to 10 */
		}
	}

	// State
	protected initState(): ListFacetState {
		return {
			collapse: this.config.collapse || false,
			filter: undefined,
			query: '',
			size: this.config.size!,
			page: 1,
			sort: this.config.sort!,
		}
	}

	activeFilter() {
		return {
			id: this.ID,
			title: this.config.title!,
			values: Array.from(this.state.filter || [])
		}
	}

	// Search request
	createPostFilter() {
		if (this.state.filter == null) return 

		const allFacetFilters = [...this.state.filter].map(key => ({ term: { [this.config.field]: key } }))
		if (allFacetFilters.length === 1) return allFacetFilters[0]
		else if (allFacetFilters.length > 1) return { bool: { must: allFacetFilters } }

		return
	}

	createAggregation(postFilters: any) {
		const terms: ListAggregationTerms = {
			field: this.config.field,
			size: this.state.size,
		}

		// TODO is always filled? or only add when not the default (sort by frequency descending)?
		if (this.state.sort != null) {
			terms.order = {
				[this.state.sort.by]: this.state.sort.direction
			}
		}

		if (this.state.query.length) {
			terms.include = `.*${this.state.query}.*`
		}
		
		const agg = {
			...addFilter(this.ID, { terms }, postFilters),
			...addFilter(
				`${this.ID}-count`,
				{
					cardinality: {
						field: this.config.field
					}
				},
				postFilters
			)
		}

		return agg
	}

	// Search response
	responseParser(buckets: Bucket[], response: ElasticSearchResponse): ListFacetValues {
		if (response.aggregations == null) return { total: 0, values: [] }

		const total = response.aggregations[`${this.ID}-count`][`${this.ID}-count`].value

		return {
			total,
			values: buckets.map((b: Bucket) => ({ key: b.key.toString(), count: b.doc_count }))
		}
	}

	reset() {
		this.state = { ...this.initialState }
	}
}
