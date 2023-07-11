import type { BaseFacetState, FacetFilter, FSResponse, SortOrder } from "../../common"
import type { SearchProps } from "../props"

import React from "react"
import { FacetsDataReducerAction } from "./actions"


	// const [currentPage, setCurrentPage] = React.useState(1)
	// const [sortOrder, setSortOrder] = React.useState<SortOrder>(searchProps.sortOrder)
	// const [searchResult, facetValues] = useSearch({
	// 	currentPage,
	// 	sortOrder,
	// 	searchState
	// })

/**
 * SearchState
 * 
 * Context to keep the state of the full text input and the facets. This
 * context is also used in other parts of the Docere UI to adjust the
 * search state.
 */


type FacetStates = Map<string, BaseFacetState>


export interface SearchState {
	currentPage: number
	sortOrder: SortOrder
	searchResult: FSResponse | undefined

	facetValues: Record<string, any>
	facetStates: FacetStates
	facetFilters: Map<string, FacetFilter>

	query: string

	initialSearchResult?: FSResponse
	initialFacetStates?: FacetStates
	initialFacetValues?: Record<string, any>
}

export const intialSearchState = {
	currentPage: 1,
	facetFilters: new Map(),
	facetStates: new Map(),
	facetValues: {},
	query: '',
	searchResult: undefined,
	sortOrder: new Map(),
}

interface SearchStateContext {
	state: SearchState
	dispatch: React.Dispatch<FacetsDataReducerAction>
}
export const SearchStateContext = React.createContext<SearchStateContext>({
	state: intialSearchState,
	dispatch: () => {}
})
