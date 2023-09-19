import type { Bucket } from "../../context/state/use-search/response-with-facets-parser"
import type { ChartFacetConfig, PieChartFacetFilter, PieChartFacetState  } from "./state"

import { addFilter } from "../../context/state/use-search/request-with-facets-creator"
import { FacetController } from "../controller"
import { ElasticSearchResponse, FacetType } from "../../common"
import { KeyCount } from "../list/state"
import { SearchState } from "../../context/state"
import { ChartFacetAction } from "./actions"

function capitalize(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1)
}

export class PieChartController extends FacetController<ChartFacetConfig, PieChartFacetState, PieChartFacetFilter> {
	setOptions() {
		return {
			tooltip: {},
			series: [{
				type: 'pie',
				data: [],
				radius: '60%'
			}]
		}
	}

	updateOptions(values: KeyCount[]) {
		return {
			series: [
				{
					data: values.map((value) => ({
						value: value.count,
						name: value.key
					}))
				}
			]
		}
	}

	type = FacetType.Pie

	reducer(state: SearchState, action: ChartFacetAction): SearchState {
		const facetState = state.facetStates.get(this.ID) as PieChartFacetState
		const nextState = { ...facetState }

		// <STATE>
		if (action.subType === 'CHART_FACET_TOGGLE_COLLAPSE') {
			nextState.collapse = !nextState.collapse
			return this.updateFacetState(nextState, state)
		}
		// <\STATE>

		const facetFilter = state.facetFilters.get(this.ID)

		// <FILTER>
		if (action.subType === 'REMOVE_FILTER') {
			return this.updateFacetFilter(undefined, state)
		}

		if (action.subType === 'CHART_FACET_SET_FILTER') {
			if (facetFilter?.value === action.value) return state

			return this.updateFacetFilter(action.value, state)
		}
		// <\FILTER>

		return state
	}

	// Config
	protected initConfig(config: ChartFacetConfig): ChartFacetConfig {
		return {
            title: capitalize(config.field),
            ...config
		}
	}

	// State
	initState(): PieChartFacetState {
		return {
			collapse: this.config.collapse || false,
			initialValues: undefined,
		}
	}

	formatFilter(filter: PieChartFacetFilter) {
		return filter ? [filter] : []
	}

	// Search request
	createPostFilter(filter: PieChartFacetFilter) {
		if (filter == null) return 

        return {
            term: {
                [this.config.field]: filter
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
}
