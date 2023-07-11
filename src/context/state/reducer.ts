import type { SearchProps } from '../props'
import type { SearchState } from '.'

import React from 'react'

import { intialSearchState } from '.'

import { EventName } from '../../constants'

import { useSearch } from './use-search'
import { FacetsDataReducerAction } from './actions'
import { BaseFacetState } from '../../common/types/search/facets'

export function useSearchStateReducer(props: SearchProps): { state: SearchState, dispatch: React.Dispatch<FacetsDataReducerAction> } {
	const [state, dispatch] = React.useReducer(searchStateReducer, intialSearchState)

	React.useEffect(() => {
		if (!props.facets.length) return

		// Set the initial state of the facets
		const facetStates = new Map(props.facets.map(facet => [facet.ID, facet.initialState]))
		dispatch({
			type: 'SET_FACET_STATES',
			facetStates,
		})

		// Seperately define the handleChange function so that we can remove it 
		// properly in the cleanup function
		const handleChange = (ev: CustomEvent<{ ID: string, state: BaseFacetState }>) => {
			dispatch({
				type: 'UPDATE_FACET_STATE',
				facetID: ev.detail.ID,
				facetState: ev.detail.state
			})
		}

		// For each facet, listen to facet state changes and
		// update the facet states
		props.facets.forEach(facet => {
			facet.addEventListener(EventName.FacetStateChange, handleChange as EventListener)
		})

		// Cleanup the event listeners from the facets
		return () => {
			props.facets.forEach(facet => {
				facet.removeEventListener(EventName.FacetStateChange, handleChange as EventListener)
			})
		}
	}, [props.facets])

	useSearch(props, state, dispatch)

	return { state, dispatch }
}

function searchStateReducer(state: SearchState, action: FacetsDataReducerAction): SearchState {
	console.log('[SearchState reducer]', action)

	if (action.type === 'SET_FACET_STATES') {
		return {
			...state,
			initialFacetStates: action.facetStates,
			facetStates: action.facetStates,
			// isInitialSearch: true,
		}
	}

	if (action.type === 'UPDATE_FACET_STATE') {
		// If the filter has changed, we need to update the facet filters map
		const updatedFilter = action.facetState.filter !== state.facetStates.get(action.facetID)?.filter

		// Update the facet states
		// state.facetStates.set(action.facetID, action.facetState)
		const facetStates = new Map(state.facetStates)
		facetStates.set(action.facetID, action.facetState)

		// Update the facet filters if the filter has changed
		// and after the facet states have been updated
		const facetFilters = updatedFilter
			? createFacetFiltersMap(facetStates)
			: state.facetFilters

		return {
			...state,

			// if facetFilters is defined a new search will be triggered,
			// so we should reset the current page
			currentPage: updatedFilter
				? 1
				: state.currentPage,

			facetStates,
			facetFilters,
		}
	}

	if (action.type === 'UPDATE_FACET_VALUES') {
		const facetValues = {...state.facetValues}
		facetValues[action.ID] = action.values
		// facetValues.set(action.ID, action.values)

		return {
			...state,
			facetValues,
		}

	}

	if (action.type === 'RESET') {
		return {
			...state,
			...intialSearchState,
			facetStates: state.initialFacetStates!,
			searchResult: state.initialSearchResult,
			facetValues: state.initialFacetValues!,
		}
	}

	if (action.type === 'SET_QUERY') {
		return {
			...state,
			query: action.value,
			currentPage: 1
		}
	}

	if (action.type === 'SET_PAGE') {
		return {
			...state,
			currentPage: action.page
		}
	}

	if (action.type === 'SET_SEARCH_RESULT') {
		const initialSearchResult = action.searchResult != null && state.initialSearchResult == null
			? action.searchResult
			: state.initialSearchResult

		const initialFacetValues = action.facetValues != null && state.initialFacetValues == null
			? action.facetValues
			: state.initialFacetValues

		return {
			...state,
			initialSearchResult,
			initialFacetValues,
			searchResult: action.searchResult != null
				? action.searchResult
				: state.searchResult,
			facetValues: action.facetValues != null
				? action.facetValues
				: state.facetValues,
		}
	}

	if (action.type === 'SET_SORT_ORDER') {
		return {
			...state,
			sortOrder: action.sortOrder,
		}
	}


	return state
}


// Create a new map of facet filters from the facet states
function createFacetFiltersMap(facetStates: SearchState['facetStates']) {
	const m = new Map()

	for (const [id, facetState] of facetStates.entries()) {
		if (facetState.filter != null) {
			m.set(id, facetState.filter)
		}
	}

	return m
}