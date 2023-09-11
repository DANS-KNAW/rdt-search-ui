import React from 'react'
import styled from 'styled-components'

import { SearchProps } from './context/props'
import type { DashboardProps  } from './context/props'
import { SearchState } from './context/state'
import clsx from 'clsx'
import { ActiveFilters } from './views/header/active-filters'
// import { FACETS_WIDTH } from './constants'

const Wrapper = styled.div`
	background: #fbfbfb;
	display: grid;
	grid-gap: 32px;
	grid-template-rows: fit-content(0) 1fr;
	max-width: 100vw;
	min-width: 100%;

	#facets {
		min-height: 100%;
		display: grid;
		grid-auto-rows: 420px;
		grid-template-columns: ${(props: { dashboard: DashboardProps }) => {
			return `repeat(${props.dashboard.columns}, 1fr)`
		}};
		grid-gap: 32px;
	}

	.facet-container--card {
		background: white;
		padding: 1rem;
		border-radius: .5rem;
		box-shadow: 0 0 20px #DDD;
	}
`

export function Dashboard(props: {
	searchProps: SearchProps,
	searchState: SearchState
}) {
	return (
		<Wrapper
			className={clsx('dashboard', props.searchProps.className)}
			dashboard={props.searchProps.dashboard!}
			id="rdt-search"
		>
			<ActiveFilters />
			<div id="facets">
				{
					props.searchState.facetStates.size > 0 &&
					props.searchProps.facets
						.map(facet =>
							<div
								className="facet-container facet-container--card"
								key={facet.ID}
							>
								<facet.View
									facet={facet}
									facetState={props.searchState.facetStates.get(facet.ID)!}
									values={props.searchState.facetValues[facet.ID]}
								/>
							</div>
						)
				}
			</div>
		</Wrapper>
	)
}
