import React from 'react'
import styled from 'styled-components'

import { Ul, ActiveFilterValue } from './details'
import { Button } from '../../ui/button'
import { SearchPropsContext } from '../../../context/props'
import { SearchStateContext, SearchStateDispatchContext } from '../../../context/state'
import { FacetControllersContext } from '../../../context/controllers'

// Background color and box shadow are only visible when the active filters
// are sticky at the top of the page and the search result is scrolled.
const Wrapper = styled.div`
	background: white;
	font-size: .8rem;
	line-height: .8rem;
	box-shadow: white 0px 1.5rem 1.5rem;

	.active-filters__clear {
		border: none;
		box-shadow: none;
	}
`

export function ActiveFilters() {
	const controllers = React.useContext(FacetControllersContext)
	const { style, uiTexts } = React.useContext(SearchPropsContext)
	const state = React.useContext(SearchStateContext) 
	const dispatch = React.useContext(SearchStateDispatchContext) 

	const reset = React.useCallback(() => {
		dispatch({ type: 'RESET' })
	}, [controllers])

	const removeFilter = React.useCallback((ev: React.MouseEvent) => {
		dispatch({
			type: 'REMOVE_FILTER',
			facetID: ev.currentTarget.getAttribute('data-facet-id')!,
		})
	}, [])

	// If there are no active filters, just render an empty div
	// in order not to mess up the grid layout
	if (!state.query.length && !state.facetFilters.size) {
		return <div id="active-filters" />
	}

	return (
		<Wrapper
			id="active-filters"
		>
			<Ul>
				{
					Array.from(state.facetFilters.entries())
					.map(([facetID, filter]) => {
						return (
							<li
								className="active-filters__facet"
								key={facetID}
							>
								<div
									className="active-filters__facet__title"
									title={`Facet title: ${filter.title}`}
								>
									{filter.title}
								</div>
								<ul className="active-filters__facet__values">
									{
										filter.formatted.map(value =>
											<ActiveFilterValue
												facetID={facetID}
												key={facetID + value}
												removeFilter={removeFilter}
												value={value}
											/>
										)
									}
								</ul>
							</li>
						)
					})
				}

				<li className="active-filters__clear">
					<Button
						onClick={reset}
						spotColor={style.spotColor}
					>
						{uiTexts.clear}
					</Button>
				</li>
			</Ul>
		</Wrapper>
	)
}
