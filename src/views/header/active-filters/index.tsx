import React from 'react'
import styled from 'styled-components'

import { ActiveFilterValue } from './value'
import { Button } from '../../ui/button'
import { SearchPropsContext } from '../../../context/props'

import { SearchStateContext, SearchStateDispatchContext } from '../../../context/state'
import { FacetControllersContext } from '../../../context/controllers'
import { SaveSearch } from './save-search'

// Background color and box shadow are only visible when the active filters
// are sticky at the top of the page and the search result is scrolled.
const Wrapper = styled.ul`
	background: white;
	box-shadow: white 0px 1.5rem 1.5rem;
	display: flex;
	flex-wrap: wrap;
	font-size: .8rem;
	list-style: none;
	margin: 0;
	padding: 0;

	li.active-filters__item {
		display: flex;
		margin-bottom: .5rem;
	}

	li.active-filters__facet {
		align-items: center;
		border-radius: 2px;
		border: 1px solid #DDD;
		box-shadow: 0 0 10px #EEE;
		padding: .25rem .5rem;
 		margin-right: 1rem;
	}
		
	.active-filters__title {
		line-height: 1rem;
		margin-right: .5rem;
		white-space: nowrap;
	}

	ul.active-filters__values {
		display: flex;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	li.active-filters__button {
		margin-left: .5rem;
		margin-right: .5rem;
	}
`

export function ActiveFilters() {
	const controllers = React.useContext(FacetControllersContext)
	const { url, style, uiTexts } = React.useContext(SearchPropsContext)
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
			{
				state.query?.length > 0 &&
				<li
					className="active-filters__item active-filters__facet"
					key="full-text-query"
				>
					<div className="active-filters__title">
						Full text query
					</div>
					<ul className="active-filters__values">
						<ActiveFilterValue
							key="full-text-query"
							removeFilter={() => dispatch({ type: 'SET_QUERY', value: "" })}
							title="Full text query"
							value={state.query}
						/>
					</ul>
				</li>

			}
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
												title={`Facet filter value: ${value}`}
												value={value}
											/>
										)
									}
								</ul>
							</li>
						)
					})
			}
			<li className="active-filters__item active-filters__button">
				<Button
					onClick={reset}
					spotColor={style.spotColor}
				>
					{uiTexts.clear}
				</Button>
			</li>
			<li className="active-filters__item active-filters__button">
				<SaveSearch
					url={url}
					activeFilters={{
						query: state.query,
						filters: state.facetFilters
					}}
					loadSearchState={() => {}}
				/>
			</li>
		</Wrapper>
	)
}

			{/* TODO make query undefined */}