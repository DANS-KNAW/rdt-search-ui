import type { MapFacetFilter } from '../../facets/map/state'
import type { SearchState } from '.'
import type { BaseFacetState } from '../../common/types/search/facets'

interface SetFacetStates {
	type: 'SET_FACET_STATES'
	facetStates: SearchState['facetStates']
}

interface UpdateFacetState {
	type: 'UPDATE_FACET_STATE'
	facetID: string
	facetState: BaseFacetState
}

interface UpdateFacetValues {
	type: 'UPDATE_FACET_VALUES'
	ID: string
	values: SearchState['facetValues']
}

interface SetSearchFilter {
	type: 'SET_FILTER'
	facetId: string
	value: string | string[] | MapFacetFilter // | HistogramFacetValue
}
interface SetSearchResult {
	type: 'SET_SEARCH_RESULT',
	searchResult?: SearchState['searchResult']
	facetValues?: SearchState['facetValues']
}
interface SetQuery {
	type: 'SET_QUERY',
	value: string
}

interface Reset {
	type: 'RESET'
}

interface SetSortOrder {
	type: 'SET_SORT_ORDER'
	sortOrder: SearchState['sortOrder']
}

interface SetPage {
	type: 'SET_PAGE'
	page: number
}

export type FacetsDataReducerAction =
	Reset |
	SetFacetStates |
	SetPage |
	SetQuery |
	SetSearchFilter |
	SetSearchResult |
	SetSortOrder |
	UpdateFacetState |
	UpdateFacetValues

	// FacetsDataReducerActionAddFilter |
	// FacetsDataReducerActionRemoveFilter |
	// SetActiveSearch |
	// FacetsDataReducerActionSetSort |
	// FacetsDataReducerActionSetQuery |
	// FacetsDataReducerActionViewLess |
	// FacetsDataReducerActionViewMore |


// interface FacetsDataReducerActionAddFilter {
// 	type: 'ADD_FILTER'
// 	facetId: string
// 	value: string | string[]// | HistogramFacetValue
// }

// interface FacetsDataReducerActionRemoveFilter {
// 	type: 'REMOVE_FILTER'
// 	facetId: string
// 	value?: string
// }


// interface SetZoom {
// 	type: 'SET_ZOOM',
// 	facetId: string,
// 	zoom: number
// 	bounds: [number, number, number, number]
// }

// interface SetActiveSearch {
// 	type: 'SET_ACTIVE_SEARCH',
// 	isActive: boolean
// }

// // TODO change to SET_LIST_FACET_SORT
// interface FacetsDataReducerActionSetSort {
// 	type: 'set_sort'
// 	facetId: string
// 	by: SortBy
// 	direction: SortDirection
// }

// // TODO change to SET_LIST_FACET_QUERY
// interface FacetsDataReducerActionSetQuery {
// 	type: 'set_query'
// 	facetId: string
// 	value: string
// }

// interface FacetsDataReducerActionViewLess {
// 	type: 'view_less'
// 	facetId: string
// }

// interface FacetsDataReducerActionViewMore {
// 	type: 'view_more'
// 	facetId: string
// 	total: number
// }

// type SetRange = {
// 	facetId: string
// 	type: 'SET_RANGE'
// 	value: RangeFacetValue
// }

// type ResetRange = {
// 	facetId: string
// 	type: 'RESET_RANGE'
// }

// TODO change to SET_FULL_TEXT_QUERY