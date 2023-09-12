import React from 'react'
import styled from 'styled-components'

import { SearchProps } from './context/props'
import type { DashboardProps  } from './context/props'
import { SearchState } from './context/state'
import clsx from 'clsx'
import { ActiveFilters } from './views/header/active-filters'
import { Facets } from './facets'
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

interface Props {
	children: React.ReactNode
	searchProps: SearchProps
	searchState: SearchState
}

export function Dashboard({ children, searchProps, searchState }: Props) {
	if (searchState.facetStates.size === 0) return null

	return (
		<Wrapper
			className={clsx('dashboard', searchProps.className)}
			dashboard={searchProps.dashboard!}
			id="rdt-search"
		>
			<ActiveFilters />
			<Facets
				facetClassname="facet-container--card"
				searchProps={searchProps}
				searchState={searchState}
			>
				{children}
			</Facets>
		</Wrapper>
	)
}
