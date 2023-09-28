import { SortDirection } from '../../../enum'

import type { FacetFilter, FacetFilterObject } from '../facets'

export * from '../facets'

export type Filters = Record<string, FacetFilterObject<FacetFilter>>

export type SortOrder = Map<string, SortDirection>
export type SetSortOrder = (sortOrder: SortOrder) => void

export interface ElasticSearchFacsimile {
	id: string,
	path: string
}

export interface FSResponse {
	results: any[]
	total: number
}

interface Hit {
	_id: string
	_index: string
	_score: number
	_source: any
	_type: string
}

export interface ElasticSearchResponse {
	aggregations?: { [id: string]: any}
	hits: {
		hits: Hit[]
		max_score: number | null
		total?: {
			relation: string
			value: number
		}
	},
}

export interface FormattedFilter {
	id: string
	title: string
	values: string[]
}

export interface ResultBodyProps {
	result: ElasticSearchResponse['hits']['hits'][0]['_source']
}