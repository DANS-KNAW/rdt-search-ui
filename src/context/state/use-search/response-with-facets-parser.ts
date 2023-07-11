import type { ElasticSearchResponse, FSResponse } from '../../../common'
import type { SearchProps } from '../../../context/props'

import { ESResponseParser } from './response-parser'

export interface Bucket {
	key: string | number
	doc_count: number
	[key: string]: any
}
export function getBuckets(response: any, facetID: string): Bucket[] {
	if (!response.aggregations?.hasOwnProperty(facetID)) return []

	const buckets = response.aggregations[facetID][facetID]['buckets']
	return buckets == null ? [] : buckets
}

export function ESResponseWithFacetsParser(
	response: ElasticSearchResponse,
	facets: SearchProps['facets']
): [FSResponse, Record<string, any>] {
	const facetValues: Record<string, any> = {}

	for (const facet of facets) {
		let buckets = getBuckets(response, facet.ID)
		facetValues[facet.ID] = facet.responseParser(buckets, response)
	}

	const results = ESResponseParser(response)
	return [results, facetValues]
}
