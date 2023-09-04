import type { BaseFacetConfig, BaseFacetState } from "../../common/types/search/facets"

import { SortBy, SortDirection } from "../../common/enum"

export interface ListFacetConfig extends BaseFacetConfig {
	size?: number
	sort?: ListFacetSort
}

export interface ListFacetState extends BaseFacetState {
	filter: ListFacetFilter | undefined
	query: string | undefined
	size: number
	page: number
	scroll: boolean
	sort: ListFacetSort
} 

export interface KeyCount {
	key: string,
	count: number
}

export interface ListFacetValues {
	total: number
	values: KeyCount[]
}

export type ListFacetFilter = Set<string>

export interface ListFacetSort {
	by: SortBy
	direction: SortDirection
} 