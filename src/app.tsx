import React from 'react'
import styled from 'styled-components'

import { ResultHeader } from './views/header'
import { SearchResult } from './views/search-result'
import { FullTextSearch } from './views/full-text-search'
import { ToggleView } from './views/toggle-view'
import { ActiveFilters } from './views/header/active-filters'


import { SearchProps } from './context/props'
import { SearchState } from './context/state'
import { FACETS_WIDTH } from './constants'

const Wrapper = styled.div`
	display: grid;
	grid-template-columns: ${FACETS_WIDTH}px 1fr;
	grid-template-rows: fit-content(0) fit-content(0) 1fr;
	grid-row-gap: 32px;
	grid-column-gap: 64px;
	max-width: 100vw;
	min-width: 100%;

	& > * {
		padding: 0 16px;
		/* margin: 0 16px; */
	}

	#rdt-search__facets {
		grid-column: 1;
		min-width: ${FACETS_WIDTH}px;
		grid-row: 2 / -1;
	}

	#rdt-search__active-filters,
	#rdt-search__search-result {
		grid-column: 2;
		/* grid-row: 2 / -1; */
		min-width: 400px;
	}	

	#rdt-search__toggle-view {
		display: none;
	}

	@media (max-width: 892px) {
		grid-template-columns: 1fr;
		#rdt-search__toggle-view {
			display: grid;
		}

		#rdt-search__search-result,
		#rdt-search__result-header {
			display: ${(props: WProps) => props.showResults ? 'grid' : 'none'};
		}

		#rdt-search__facets,
		#rdt-search__active-filters,
		#rdt-search__full-text {
			display: ${(props: WProps) => props.showResults ? 'none' : 'grid'};
		}
	}
`

interface WProps { showResults: boolean }

export default function FacetedSearch(props: { searchProps: SearchProps, searchState: SearchState }) {
	const [showResults, setShowResults] = React.useState(true)

	return (
		<Wrapper
			className={props.searchProps.className}
			showResults={showResults}
		>
			<FullTextSearch />
			<ResultHeader
				currentPage={props.searchState.currentPage}
				searchResult={props.searchState.searchResult}
				sortOrder={props.searchState.sortOrder}
			/>
			<ActiveFilters />
			<div id="rdt-search__facets">
				{
					props.searchState.facetStates.size > 0 &&
					props.searchProps.facets
						.map(facet =>
							<facet.View
								key={facet.ID}
								facet={facet}
								facetState={props.searchState.facetStates.get(facet.ID)!}
								values={props.searchState.facetValues[facet.ID]}
							/>
						)
				}
			</div>
			<SearchResult
				currentPage={props.searchState.currentPage}
				ResultBodyComponent={props.searchProps.ResultBodyComponent}
				onClickResult={props.searchProps.onClickResult}
				resultBodyProps={props.searchProps.resultBodyProps}
				searchResult={props.searchState.searchResult}
			/>
			<ToggleView
				showResults={showResults}
				setShowResults={setShowResults}
			/>
		</Wrapper>
	)
}
