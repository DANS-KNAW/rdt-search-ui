import type { Bucket } from "../../context/state/use-search/response-with-facets-parser"
import type { ListFacetState, ListFacetConfig, ListFacetValues, ListFacetSort } from "./state"

import { addFilter } from "../../context/state/use-search/request-with-facets-creator"
import { FacetController } from ".."
import { EventName } from "../../constants"
import { ElasticSearchResponse, FacetType, SortBy, SortDirection } from "../../common"
import { LIST_FACET_SCROLL_CUT_OFF } from "./view/list-view"
import { listFacetViewStates, ListFacetViewState, getViewState } from "./view/state"

function capitalize(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1)
}

interface ListAggregationTerms {
	field: string
	include?: string
	order?: { [sb in SortBy]?: SortDirection }
	size: number
}

export class ListFacetController extends FacetController<ListFacetConfig, ListFacetState> {
	type = FacetType.List

	viewState: ListFacetViewState = listFacetViewStates[0]

	actions = {
		showAll: (total: number) => {
			this.state.page = 1
			this.state.size = this.state.query?.length
				? LIST_FACET_SCROLL_CUT_OFF
				: total
			this.state.scroll = true
			this.dispatchChange()
		},
		setPage: (page: number) => {
			this.state.size = page * this.config.size!
			this.state.page = page
			this.state.scroll = false
			this.dispatchChange()
		},
		setQuery: (query: string) => {
			this.state.page = 1
			this.state.query = query.length ? query : undefined
			this.state.scroll = false
			this.state.size = this.config.size!

			this.dispatchChange()
		},
		setSort: (sort: ListFacetSort) => {
			this.state.page = 1
			this.state.query = this.state.query?.length ? this.state.query : undefined
			this.state.sort = sort
			this.state.size = this.config.size!

			this.dispatchChange()
		},
		toggleFilter: (key: string) => {
			this.state.page = 1
			this.state.size = this.config.size!
			this.state.query = undefined

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
			query: undefined,
			size: this.config.size!,
			page: 1,
			scroll: false,
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

		if (this.state.query?.length) {
			// Turn query into hacky case insensitive regex,
			// because ES doesn't support case insensitive include in terms aggregation
			// For example: "test" -> "(t|T)(e|E)(s|S)(t|T)"
			const query = [...this.state.query].map(c => {
				const C = c.toUpperCase() === c ? c.toLowerCase() : c.toUpperCase()
				return `(${c}|${C})`
			}).join('')

			terms.include = `.*${query}.*`
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

		const total = this.state.query == null
			? response.aggregations[`${this.ID}-count`][`${this.ID}-count`].value
			: buckets.length


		this.viewState = getViewState(total, this.config.size!, this.state.size, this.state.query)

		return {
			total,
			values: buckets.map((b: Bucket) => ({ key: b.key.toString(), count: b.doc_count }))
		}
	}

	reset() {
		this.viewState = listFacetViewStates[0]
		this.state = { ...this.initialState }
	}
}

export default ListFacetController