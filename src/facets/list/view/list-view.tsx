import type { ListFacetProps } from '.'

import React from 'react'
import styled from 'styled-components'

import ListFacetValue from './value'

import { Pagination } from '../../../views/pagination'
import { Button } from '../../../views/ui/button'
import { SearchPropsContext } from '../../../context/props'
import { FacetsDataReducerAction } from '../../../context/state/actions'

export const LIST_FACET_SCROLL_CUT_OFF = 50

export const Wrapper = styled('div')`
	ul.values {
		list-style: none;
		margin: 0 0 0 -1rem;
		padding: 0;
		overflow-y: auto;
	}
`

export function ListView(props: ListFacetProps) {
	const ulRef = React.useRef<HTMLUListElement>(null)
	const { style } = React.useContext(SearchPropsContext)
	const [page, setPage] = usePage(props, props.dispatch)
	const values = useValues(props, page)

	React.useEffect(() => {
		if (ulRef.current == null) return

		ulRef.current.style.height =  props.facetState.scroll
			? `${ulRef.current.getBoundingClientRect().height}px`
			: 'auto'
	}, [props.facetState.scroll])

	const toggleFilter = React.useCallback((ev: React.MouseEvent) => {
		const value = ev.currentTarget.getAttribute('title')!

		props.dispatch({
			type: "UPDATE_FACET_FILTER",
			subType: "LIST_FACET_TOGGLE_FILTER",
			facetID: props.facet.ID,
			value
		})
	}, [])

	const showAll = React.useCallback(() => {
		props.dispatch({
			type: "UPDATE_FACET_STATE",
			subType: "LIST_FACET_SHOW_ALL",
			facetID: props.facet.ID,
			total: props.values.total
		})
	}, [props.values?.total])

	if (!values.length) return null

	return (
		<Wrapper>
			<ul
				className="values"
 				ref={ulRef}
			>
				{
					values
						.map(value =>
							<ListFacetValue
								active={props.filter != null && props.filter.has(value.key.toString())}
								key={value.key}
								query={props.facetState.query}
								toggleFilter={toggleFilter}
								value={value}
							/>
						)
				}
			</ul>
			{
				props.viewState.pagination ?
					<Pagination
						currentPage={page}
						dispatch={props.dispatch}
						total={props.values.total}
						resultsPerPage={props.facet.config.size}
						setCurrentPage={setPage}
					/> :
					props.viewState.scrollButton &&
					<Button
						onClick={showAll}
						spotColor={style.spotColor}
					>
						{
							props.viewState.query
								? <>Show more</>
								: <>Show all ({props.values.total})</>
						}
					</Button>
			}
		</Wrapper>
	)
}

function useValues(props: ListFacetProps, page: number) {
	const [values, setValues] = React.useState<ListFacetProps['values']['values']>([])

	// An effect is needed to update the values when the page changes,
	// because a page change triggers a render before the values have been updated.
	// When the values are not updated, page is at for example 2, but the values
	// are still from page 1 (for example Array(10)), slicing an empty array, 
	// causing a flicker in the rendering.
	React.useEffect(() => {
		if (props.values == null) return

		// Don't set the values if the pagination is enabled and the values
		// have not been fetched yet
		if (props.viewState.pagination) {
			// Calculate the number of pages (total: 28 / size: 10 = 2.8 => 3 pages)
			const pageCount = Math.ceil(props.values.total / props.facet.config.size!)

			// Check if the values have the required length (ie the values have been fetched and updated)
			if (
				// The last page can be smaller than the configured size, so the length of the values
				// is checked against the total values number retuned by the search API
				// For example, when page = 3, values.length = 20, values.total = 28,
				// 				wait until values are fetched and values.length becomes 28
				(
					page === pageCount &&
					props.values.values.length !== props.values.total
				) || 
				// The other pages should have the configured size
				// For example, when page = 2, values.length = 10, config.size = 10,
				// 				wait until values are fetched and values.length becomes 20
				(
					page !== pageCount &&
					props.values.values.length !== page * props.facet.config.size!
				)
			) {
				return
			}
		}

		const from = props.facet.config.size! * (page - 1)
		const _values = props.values.values.slice(from, props.facetState.size)

		setValues(_values)
	}, [props.values, page])

	return values
}

function usePage(props: ListFacetProps, dispatch: React.Dispatch<FacetsDataReducerAction>) {
	const [page, setPage] = React.useState(props.facetState.page)

	// Update the page in the facetState when the page changes,
	// but check if the page is not the same, this happens after
	// the facetState and page are just synced (see next useEffect)
	React.useEffect(() => {
		if (props.facetState.page === page) return

		dispatch({
			type: "UPDATE_FACET_STATE",
			subType: "LIST_FACET_SET_PAGE",
			facetID: props.facet.ID,
			page
		})
	}, [page])

	// Update the page from the facetState. For example when the user selects a value,
	// the page is reset to 1
	React.useEffect(() => {
		if (props.facetState.page !== page) {
			setPage(props.facetState.page)
		}
	}, [props.facetState.page])

	return [page, setPage] as const
}