import React from 'react'
import { SortDirection, SearchTab } from '../../enum'

import type { FacetFilter } from './facets'

export * from './facets'

// TODO remove
// interface FacetedSearchProps {
// 	ResultBodyComponent: React.FC<ResultBodyProps>
// 	url: string

// 	autoSuggest?: (query: string) => Promise<string[]>
// 	className?: string /* className prop is used by StyledComponents */
// 	excludeResultFields?: string[]
// 	onClickResult?: (result: any, ev: React.MouseEvent<HTMLLIElement>) => void
// 	resultFields?: string[]
// 	resultBodyProps?: Record<string, any>
// 	resultsPerPage?: number
// 	SearchHomeComponent?: React.FC<any>
// 	track_total_hits?: number
// 	sortOrder?: SortOrder
// 	style?: {
// 		spotColor: string
// 	}
// }

// export type FacetedSearchContext = Omit<FacetedSearchProps, 'facetsConfig'> & { facetsConfig: Record<string, FacetConfig> }

// type Filters = Map<string, Set<string>>
export type Filters = Record<string, FacetFilter>
// export type FacetsConfig = Record<string, BaseMetadataConfig>

export type SortOrder = Map<string, SortDirection>
export type SetSortOrder = (sortOrder: SortOrder) => void

// export interface ElasticSearchRequestOptions {
// 	currentPage: number
// 	sortOrder: SortOrder
// 	searchState: SearchState
// }

export interface ElasticSearchFacsimile {
	id: string,
	path: string
}

/**
 * JSON object which represents a ElasticSearch document
 */
// export interface ElasticSearchDocument {
// 	facsimiles: ElasticSearchFacsimile[]
// 	id: string
// 	text: string
// 	text_suggest: { input: string[] }
// 	[key: string]: any
// }

// export interface Hit {
// 	facsimiles?: ElasticSearchDocument['facsimiles']
// 	id: string
// 	snippets: string[]
// 	[key: string]: any
// }

interface Hit {
	_id: string
	_index: string
	_score: number
	_source: any
	_type: string
}

export interface FSResponse {
	results: any[]
	total: number
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

// interface SearchResults {
// 	hits: Hit[]
// 	id?: string
// 	query?: Object
// 	total: number
// }

export interface ActiveFilter {
	id: string
	title: string
	values: string[]
}

export interface ResultBodyProps {
	result: ElasticSearchResponse['hits']['hits'][0]['_source']
}

export interface DocereResultBodyProps extends ResultBodyProps {
	activeId: string
	children?: React.ReactNode
	// facsimile: ActiveFacsimile
	searchTab: SearchTab
}

