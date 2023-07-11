import type { ListFacetProps } from '.'

import React from 'react'
import styled from 'styled-components'

import ListFacetValue from './value'

import { Pagination } from '../../../views/header/pagination'
import { Button } from '../../../views/ui/button'
import { SearchPropsContext } from '../../../context/props'

const LIST_FACET_CUT_OFF = 50

export const Wrapper = styled('div')`
	.list-facet__values {
		list-style: none;
		margin: 0 0 0 -1rem;
		padding: 0;
		overflow-y: auto;
	}
`

export function ListView(props: ListFacetProps) {
	const ulRef = React.useRef<HTMLUListElement>(null)
	const { style } = React.useContext(SearchPropsContext)
	const [page, setPage] = React.useState(props.facetState.page)
	const [values, setValues] = React.useState<ListFacetProps['values']['values']>([])

	// Update the page in the facetState when the page changes,
	// but check if the page is not the same, this happens after
	// the facetState and page are just synced (see next useEffect)
	React.useEffect(() => {
		if (props.facetState.page !== page) {
			props.facet.actions.setPage(page)
		}
	}, [page])

	// Update the page from the facetState. For example when the user selects a value,
	// the page is reset to 1
	React.useEffect(() => {
		if (props.facetState.page !== page) {
			setPage(props.facetState.page)
		}
	}, [props.facetState.page])

	// An effect is needed to update the values when the page changes,
	// because a page change triggers a render before the values have been updated.
	// When the values are not updated, page is at for example 2, but the values
	// are still from page 1 (for example Array(10)), slicing an empty array, 
	// causing a flicker in the rendering.
	React.useEffect(() => {
		if (props.values == null) return

		const pageCount = Math.ceil(props.values.total / props.facet.config.size!)

		// If there is 0 or 1 page, there is no pagination, but the values have to be set
		if (page === 0 || pageCount <= 1) {
			if (ulRef.current != null) {
				ulRef.current.style.height = props.values.values.length > props.facet.config.size!
					? `${ulRef.current.getBoundingClientRect().height}px`
					: 'auto'
			}
			setValues(props.values.values)
			return
		}

		// Check if the values have the required length (ie the values have been fetched and updated)
		if (
			// The last page can be smaller than the configured size, so the length of the values
			// is checked against the total values number retuned by the search API
			(
				page === pageCount &&
				props.values.values.length !== props.values.total
			) || 
			// The other pages should have the configured size
			(
				page !== pageCount &&
				props.values.values.length !== page * props.facet.config.size!
			)
		) {
			return
		}

		const from = props.facet.config.size! * (page - 1)
		const _values = props.values.values.slice(from, props.facetState.size)

		setValues(_values)
	}, [props.values, page])

	if (!values.length) return null

	return (
		<Wrapper>
			<ul
				className="list-facet__values"
 				ref={ulRef}
			>
				{
					values
						.map(value =>
							<ListFacetValue
								active={props.facetState.filter != null && props.facetState.filter.has(value.key.toString())}
								facet={props.facet}
								key={value.key}
								value={value}
							/>
						)
				}
			</ul>
			{
				props.values.total > LIST_FACET_CUT_OFF ?
					<Pagination
						currentPage={page}
						total={props.values.total}
						resultsPerPage={props.facet.config.size}
						setCurrentPage={setPage}
					/> :
					props.values.total > props.facet.config.size! &&
					props.values.total !== values.length &&
					<Button
						onClick={() => props.facet.actions.showAll(props.values.total)}
						spotColor={style.spotColor}
					>
						Show all ({props.values.total})
					</Button>
			}
		</Wrapper>
	)
}
