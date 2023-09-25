import React from 'react'
import styled from 'styled-components'

import { SearchProps } from './context/props'
import type { DashboardProps  } from './context/props'
import { SearchState } from './context/state'
import clsx from 'clsx'
import { ActiveFilters } from './views/active-filters'
import { Facets } from './facets'
import { FacetControllers } from './context/controllers'
// import { FACETS_WIDTH } from './constants'

const Wrapper = styled.div`
	background: ${props => props.background}};
	display: grid;
	grid-gap: 32px;
	grid-template-rows: fit-content(0) 1fr;
	max-width: 100vw;
	min-width: 100%;

	#facets {
		min-height: 100%;
		display: grid;
		grid-auto-rows: 420px;
		${(props: { dashboard: DashboardProps, background: string }) => {
			if (props.dashboard.columns) {
				return `grid-template-columns: repeat(${props.dashboard.columns}, 1fr)`
			}
			if (props.dashboard.areas) {
				return `
					grid-template-columns: repeat(${props.dashboard.areas[0].split(' ').length}, 1fr);
					grid-template-areas: ${props.dashboard.areas.map(a => `"${a}"`).join(' ')}
				`
			}
			return ''
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
	controllers: FacetControllers
	searchProps: SearchProps
	searchState: SearchState
}

export function Dashboard({ children, controllers, searchProps, searchState }: Props) {
	if (searchState.facetStates.size === 0) return null

	return (
		<Wrapper
			background={searchProps.style.background}
			className={clsx('dashboard', searchProps.className)}
			dashboard={searchProps.dashboard!}
			id="rdt-search"
		>
			<ActiveFilters />
			<Facets
				controllers={controllers}
				facetClassname="facet-container--card"
				searchProps={searchProps}
				searchState={searchState}
			>
				{children}
			</Facets>
		</Wrapper>
	)
}
