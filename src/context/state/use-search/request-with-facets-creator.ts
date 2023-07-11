import type { SearchProps } from '../../../context/props'
import type { SearchState } from '../../../context/state'

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
	constructor(state: SearchState, props: SearchProps) {
		super(state, props)

		if (state.facetStates == null) return

		this.setAggregations(props.facets)
		this.setQuery(state)
	}

	private setAggregations(facets: SearchProps['facets']) {
		for (const facet of facets) {
			// const field = facet.config.field

			// let facetAggs	
			// TODO remove type casting
			const facetAggs = facet.createAggregation(this.payload.post_filter)
			// if (ListFacetUtils.is(facetState)) {
			// } else if (HistogramFacetUtils.is(facetState)) {
			// 	facetAggs = HistogramFacetUtils.createAggregation({ field, facetID, facetState, postFilters: this.payload.post_filter })
			// } else if (MapFacetUtils.is(facetState)) {
			// 	facetAggs = MapFacetUtils.createAggregation({ field, facetID, facetState, postFilters: this.payload.post_filter })
			// }

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