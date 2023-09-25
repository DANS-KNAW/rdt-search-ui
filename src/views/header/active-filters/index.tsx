import React from 'react'
import styled from 'styled-components'

import { ActiveFilterValue } from './value'
import { Button } from '../../ui/button'
import { SearchPropsContext } from '../../../context/props'

import { SearchStateContext, SearchStateDispatchContext } from '../../../context/state'
import { FacetControllersContext } from '../../../context/controllers'
import { SaveSearch } from './save-search/save-search'
import { LoadSearch } from './save-search/load-search'

// Background color and box shadow are only visible when the active filters
// are sticky at the top of the page and the search result is scrolled.
const Wrapper = styled.ul`
	background: ${({ background }: { background: string}) => background};
	box-shadow: ${({ background }) => background} 0px 1.5rem 1.5rem;
	display: flex;
	flex-wrap: wrap;
	font-size: .8rem;
	list-style: none;
	margin: 0;
	padding: 0;

	li.active-filters__item {
		display: flex;
		height: 36px;
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

	li.active-filters__buttons {
		margin-left: .5rem;
		margin-right: .5rem;
		white-space: nowrap;

		& > button:first-of-type {
			margin-right: 1rem;
		}
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
			value: ev.currentTarget.getAttribute('data-value')!,
		})
	}, [])

	// If there are no active filters, just render an empty div
	// in order not to mess up the grid layout
	if (!state.query.length && !state.facetFilters.size) {
		return (
			<Wrapper
				background={style.background}
				id="active-filters"
			>
				<li>
					<LoadSearch url={url} />
				</li>
			</Wrapper>
		)
	}

	return (
		<Wrapper
			background={style.background}
			id="active-filters"
		>
			{
				state.query?.length > 0 &&
				<ActiveFilterItem title="Full text query">
					<ActiveFilterValue
						key="full-text-query"
						removeFilter={() => dispatch({ type: 'SET_QUERY', value: "" })}
						title="Full text query"
						value={state.query}
					/>
				</ActiveFilterItem>
			}
			{
				Array.from(state.facetFilters.entries())
					.map(([facetID, filter]) =>
						<ActiveFilterItem
							key={facetID}
							title={filter.title}
						>
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
						</ActiveFilterItem>
					)
			}
			<li className="active-filters__item active-filters__buttons">
				<Button
					onClick={reset}
					spotColor={style.spotColor}
				>
					{uiTexts.clearSearch}
				</Button>
				<SaveSearch
					url={url}
					activeFilters={{
						query: state.query,
						filters: state.facetFilters
					}}
				/>
			</li>
		</Wrapper>
	)
}

			{/* TODO make query undefined */}

interface ItemProps {
	children: React.ReactNode
	title: string
}
function ActiveFilterItem({ children, title }: ItemProps) {
	return (
		<li className="active-filters__item active-filters__facet">
			<div
				className="active-filters__title"
				title={`Facet title: ${title}`}
			>
				{title}
			</div>
			<ul className="active-filters__values">
				{children}
			</ul>
		</li>
	)
}
