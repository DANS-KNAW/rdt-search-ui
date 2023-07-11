import type { SearchProps } from '../../props'
import type { SearchState } from '..'
// import { HistogramFacetUtils } from '../views/facets/histogram/utils'
// import { ListFacetUtils } from '../views/facets/list/utils'
// import { MapFacetUtils } from '../views/facets/map/utils'

interface AggregationRequest {
	aggs: any
	filter?: any
}

type Aggregations = { [id: string]: AggregationRequest }

type Highlight = { fields: { text: {} }, require_field_match: boolean }

export interface Payload {
	// Create aggregations to fill the facets with bucket data
	aggs?: Aggregations

	highlight?: Highlight

	// Adjust the facets to other facet values and filter the results
	post_filter?: Record<string, any>

	query?: Record<string, any>

	_source?: {
		includes?: SearchProps['resultFields'],
		excludes?: SearchProps['excludeResultFields']
	}

	from?: number

	size?: number

	sort?: any

	track_total_hits?: SearchProps['track_total_hits']
}


export class ESRequest {
	// TODO remove
	private postFilters = new Map<string, any>()

	payload: Payload = {}

	constructor(state: SearchState, props: SearchProps) {
		this.setSource(props)
		this.payload.size = props.resultsPerPage

		if (state.currentPage > 1) {
			this.payload.from = this.payload.size * (state.currentPage - 1) 
		}

		if (state.sortOrder.size) {
			this.payload.sort = []
			state.sortOrder.forEach((sortDirection, facetId) => {
				// const facet = context.facets.get(facetId)!
				this.payload.sort.push({[facetId]: sortDirection})
			})
			this.payload.sort.push('_score')
		}
		if (props.track_total_hits != null) {
			this.payload.track_total_hits = props.track_total_hits
		}

		this.setPostFilter(props.facets)
	}

	private setSource(context: SearchProps) {
		if (!context.resultFields.length && !context.excludeResultFields.length) return

		this.payload._source = {
			includes: context.resultFields,
			excludes: context.excludeResultFields
		}
	}

	private setPostFilter(facets: SearchProps['facets']) {
		// Create post filters per facet, they are set on the payload, see below,
		// and used when creating the aggregations
		for (const facet of facets) {
        	// const field = facets.get(facetID)!.field
			// const { field } = facet.config
			const postFilter = facet.createPostFilter()
			if (postFilter != null) {
				this.postFilters.set(facet.ID, postFilter)
			}

			// if (ListFacetUtils.is(facetState) && facetState.filters.size > 0) {
			// 	this.postFilters.set(facetID, ListFacetUtils.createPostFilter(field, facetID, facetState))
			// } else if (HistogramFacetUtils.is(facetState) && facetState.filters.length > 0) {
			// 	this.postFilters.set(facetID, HistogramFacetUtils.createPostFilter(field, facetID, facetState))
			// } else if (MapFacetUtils.is(facetState) && Array.isArray(facetState.filters)) {
			// 	this.postFilters.set(facetID, MapFacetUtils.createPostFilter(field, facetID, facetState))
			// }
		}

		// Transfer post filters to payload
		const post_filters = Array.from(this.postFilters.values())

		if (post_filters.length === 1) {
			this.payload.post_filter = post_filters[0]
		} else if (post_filters.length > 1) {
			this.payload.post_filter = {
				bool: {
					must: post_filters
				}
			}
		}
	}
}
