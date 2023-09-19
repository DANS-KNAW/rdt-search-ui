import type { SearchProps } from '../../../context/props'
import type { SearchState } from '../../../context/state'
import { FacetControllers } from '../../controllers'

import { ESRequest } from './request-creator'

// import { HistogramFacetUtils } from '../views/facets/histogram/utils'
// import { ListFacetUtils } from '../views/facets/list/utils'
// import { MapFacetUtils } from '../views/facets/map/utils'

// export interface CreateAggregationProps<FS> {
// 	facetID: string
// 	field: string
// 	facetState: FS
// 	postFilters: any
// }

export class ESRequestWithFacets extends ESRequest {
	constructor(state: SearchState, props: SearchProps, controllers: FacetControllers) {
		super(state, props, controllers)

		if (state.facetStates == null) return

		this.setAggregations()
		this.setQuery(state)
	}

	private setAggregations() {
		for (const facet of this.controllers.values()) {
			const facetState = this.state.facetStates.get(facet.ID)
			if (facetState == null) continue

			const facetFilter = this.state.facetFilters.get(facet.ID)

			const facetAggs = facet.createAggregation(
				this.payload.post_filter,
				facetFilter?.value,
				facetState,
			)

			if (facetAggs != null) {
				this.payload.aggs = {
					...this.payload.aggs,
					...facetAggs
				}
			}
		}
	}

	private setQuery(searchState: SearchState) {
		if (!searchState.query.length) return
		this.payload.query = { query_string: { query: searchState.query } }
		this.payload.highlight = { fields: { text: {} }, require_field_match: false }
	}
}


export function addFilter(facetID: string, values: any, postFilter: any): any {
	const agg = {
		[facetID]: {
			aggs: { [facetID]: values },
			filter: { match_all: {} }
		}
	}

	if (postFilter != null) {
		// @ts-ignore
		agg[facetID].filter = postFilter
	}

	return agg
}