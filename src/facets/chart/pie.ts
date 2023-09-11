import type { Bucket } from "../../context/state/use-search/response-with-facets-parser"
import type { ChartFacetState, ChartFacetConfig  } from "./state"

import { addFilter } from "../../context/state/use-search/request-with-facets-creator"
import { ChartFacetView } from "./view"
import { Facet } from ".."
import { EventName } from "../../constants"
import { ElasticSearchResponse, FacetType } from "../../common"
import { KeyCount } from "../list/state"

function capitalize(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1)
}

export class PieChartFacet extends Facet<ChartFacetConfig, ChartFacetState> {
	type = FacetType.Pie
	View = ChartFacetView

	actions = {
		setFilter: (filter: string) => {
			if (
				this.state.filter === filter
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
	protected initConfig(config: ChartFacetConfig): ChartFacetConfig {
		return {
            title: capitalize(config.field),
            ...config
		}
	}

	// State
	protected initState(): ChartFacetState {
		return {
			collapse: this.config.collapse || false,
            filter: undefined,
			initialValues: undefined,
		}
	}

	activeFilter() {
		return {
			id: this.ID,
			title: this.config.title!,
			values: this.state.filter ? [this.state.filter] : []
		}
	}

	// Search request
	createPostFilter() {
		if (this.state.filter == null) return 

        return {
            term: {
                [this.config.field]: this.state.filter
            }
        }
	}

	createAggregation(postFilters: any) {
		const values = {
			terms: {
				field: this.config.field,
			}
		}

		return addFilter(this.ID, values, postFilters)
	}

	// Search response
	responseParser(buckets: Bucket[], _response: ElasticSearchResponse): KeyCount[] {
		return buckets.map((b: Bucket) => ({ key: b.key.toString(), count: b.doc_count }))
	}

	reset() {
		this.state = { ...this.initialState }
	}
}

export default PieChartFacet

// export function rangeToFacetValue(from: number, to: number, count = 0): HistogramFacetValue {
// 	return {
// 		from,
// 		to,
// 		fromLabel: Math.floor(from).toString(),
// 		toLabel: Math.ceil(to).toString(),
// 		count,
// 	}
// }