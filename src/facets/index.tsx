import type { SearchProps } from '../context/props'
import { SearchStateDispatchContext, type SearchState } from '../context/state'
import type { FacetControllers } from '../context/controllers'

import React, { Children, isValidElement } from 'react'
import clsx from 'clsx'

interface Props {
	facetClassname?: string
	children: React.ReactNode
	controllers: FacetControllers
	searchProps: SearchProps
	searchState: SearchState
}

export const Facets = ({ children, controllers, facetClassname, searchProps, searchState }: Props) => {
	const dispatch = React.useContext(SearchStateDispatchContext)
	if (searchState.facetStates.size === 0) return null

	return (
		<div id="facets">
			{
				Children
					.map(children, (child, index) => {
						if (!isValidElement(child)) return
						const facet = Array.from(controllers.values())[index]

						return (
							<div
								className={clsx('facet-container', facetClassname )}
								key={facet.ID}
								style={{
									gridArea: searchProps.dashboard?.areas != null
										? facet.ID
										: undefined
								}}
							>
								<child.type
									dispatch={dispatch}
									facet={facet}
									facetState={searchState.facetStates.get(facet.ID)!}
									filter={searchState.facetFilters.get(facet.ID)?.value}
									values={searchState.facetValues[facet.ID]}
								/>
							</div>
						)
					})
			}
		</div>
	)
}