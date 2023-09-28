import React from 'react'

import { ActiveFilterValue } from './value'
// import { Button } from '../ui/button'
import { SearchPropsContext } from '../../context/props'

import { SearchStateContext, SearchStateDispatchContext } from '../../context/state'
import { FacetControllersContext } from '../../context/controllers'
import { SaveSearch } from './save-search/save-search'
import buttonStyle from '../ui/button.module.css'
import styles from './index.module.css'

export function ActiveFilters() {
	const controllers = React.useContext(FacetControllersContext)
	const { dashboard, url, uiTexts } = React.useContext(SearchPropsContext)
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

	if (!state.query.length && !state.facetFilters.size) {
		// In dashboard mode return <ul> to keep the layout from collapsing
		// TODO fix in CSS?
		return dashboard != null ? <ul></ul> : null
	}

	return (
		<ul className={styles.ul}>
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
			<li className={styles.buttons}>
				<button
					className={buttonStyle.button}
					onClick={reset}
				>
					{uiTexts.clearSearch}
				</button>
				<SaveSearch
					url={url}
					activeFilters={{
						query: state.query,
						filters: state.facetFilters
					}}
				/>
			</li>
		</ul>
	)
}

interface ItemProps {
	children: React.ReactNode
	title: string
}
function ActiveFilterItem({ children, title }: ItemProps) {
	return (
		<li className={styles.facet}>
			<div
				className={styles.title}
				title={`Facet title: ${title}`}
			>
				{title}
			</div>
			<ul className={styles.values}>
				{children}
			</ul>
		</li>
	)
}
