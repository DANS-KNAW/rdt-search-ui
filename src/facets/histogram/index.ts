import { getBuckets, type Bucket } from "../../context/state/use-search/response-with-facets-parser"
import type { HistogramFacetState, HistogramFacetConfig, HistogramFacetValue } from "./state"

import { addFilter } from "../../context/state/use-search/request-with-facets-creator"
import { HistogramFacetView } from "./view"
import { Facet } from ".."
import { EventName } from "../../constants"
import { ElasticSearchResponse } from "../../common"

function capitalize(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1)
}

export class HistogramFacet extends Facet<HistogramFacetConfig, HistogramFacetState> {
	View = HistogramFacetView

	actions = {
		setFilter: (filter: HistogramFacetValue) => {
			if (
				this.state.filter?.from === filter.from &&
				this.state.filter.to === filter.to
			) return
			this.state.filter = filter
			this.dispatchChange()
		},
		toggleCollapse: () => {
			this.state.collapse = !this.state.collapse
			this.dispatchChange()
		},
		removeFilter: () => {
			this.state.filter = undefined
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
	protected initConfig(config: HistogramFacetConfig): HistogramFacetConfig {
		return {
            title: capitalize(config.field),
            ...config
		}
	}

	// State
	protected initState(): HistogramFacetState {
		return {
			collapse: this.config.collapse || false,
            filter: undefined,
            interval: this.config.interval || 1,
            value: undefined,
			initialValues: undefined,
		}
	}

	activeFilter() {
		return {
			id: this.ID,
			title: this.config.title!,
			values: 
				this.state.filter == null
					? []
					: this.state.filter.from === this.state.filter.to
						? [this.state.filter.fromLabel]
						: [`${this.state.filter.fromLabel} - ${this.state.filter.toLabel}`]

		}
	}

	// Search request
	createPostFilter() {
		if (this.state.filter == null) return 

        // const lastFilter = this.state.filter[this.state.filter.length - 1]
        return {
            range: {
                [this.config.field]: {
                    gte: this.state.filter.from,
                    lte: this.state.filter.to // + this.state.interval, //lastFilter.to != null ? lastFilter.to : null
                }
            }
        }
	}

	createAggregation(postFilters: any) {
		let values: any = {
			histogram: {
				field: this.config.field,
				interval: this.state.interval,
			}
		}

		// Change aggregation to nested if the field is nested
		if (this.config.field.indexOf('.') > -1) {
			const lastIndex = this.config.field.lastIndexOf('.')

			const aggs = addFilter(this.ID, values, postFilters)

			return  {
				[this.ID]: {
					nested: {
						path: this.config.field.slice(0, lastIndex)
					},
					aggs,
				}
			}
		}

		return addFilter(this.ID, values, postFilters)
	}

	// Search response
	responseParser(buckets: Bucket[], response: ElasticSearchResponse): HistogramFacetValue[] {
		// If the field is nested, the buckets are nested one level deeper
		if (this.config.field.indexOf('.') > -1) {
			if (!response.aggregations?.hasOwnProperty(this.ID)) return []
			buckets = response.aggregations[this.ID][this.ID][this.ID].buckets
		}
		
		const values = buckets.map(hv => {
			let to = hv.key as number + this.state.interval - 1
			return rangeToFacetValue(hv.key as number, to, hv.doc_count)
		})

		// Set the base of the range facet when
		// 1) it's the first time the facet is loaded (facet.value == null)
		// 2) the facet is updated, but not from it's own filter  (!facet.filters.length)
		if (
			this.state.value == null &&
			this.state.initialValues == null &&
			buckets.length > 0
		) {
			const min = buckets[0].key as number
			const max = buckets[buckets.length - 1].key as number

			this.state.value = rangeToFacetValue(min, max)
			this.state.initialValues = values

			this.dispatchChange()
		}

		return values
	}

	reset() {
		this.state = { ...this.initialState }
	}
}

export function rangeToFacetValue(from: number, to: number, count = 0): HistogramFacetValue {
	return {
		from,
		to,
		fromLabel: Math.floor(from).toString(),
		toLabel: Math.ceil(to).toString(),
		count,
	}
}