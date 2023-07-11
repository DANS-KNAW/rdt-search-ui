import React from 'react'
import styled from 'styled-components'

import { Ul, ActiveFilterValue } from './details'
import { Button } from '../../ui/button'
import { SearchPropsContext } from '../../../context/props'
import { SearchStateContext } from '../../../context/state'

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
	const { style, uiTexts, facets } = React.useContext(SearchPropsContext)
	const { state, dispatch } = React.useContext(SearchStateContext) 

	const reset = React.useCallback(() => {
		facets.forEach(facet => facet.reset())
		dispatch({ type: 'RESET' })
	}, [facets])

	if (!state.query.length && !state.facetFilters.size) return null

	return (
		<Wrapper
			id="rdt-search__active-filters"
			className="active-filters"
		>
			<Ul>
				{
					Array.from(state.facetFilters.keys()).map(facetID => {
						const facet = facets.find(facet => facet.ID === facetID)
						if (facet == null) return null
						return (
							<li
								className="active-filters__facet"
								key={facetID}
							>
								<div
									className="active-filters__facet__title"
									title={`Facet title: ${facet.config.title}`}
								>
									{facet.config.title}
								</div>
								<ul className="active-filters__facet__values">
									{
										facet.activeFilter()?.values.map(value =>
											<ActiveFilterValue
												facet={facet}
												key={facetID + value}
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
