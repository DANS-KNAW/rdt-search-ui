import React from 'react'

import styled from 'styled-components'

import { PageNumber, PaginationButton } from './page-number'
import { usePages } from './use-pages'

import { SearchPropsContext } from '../../context/props'
import { FacetsDataReducerAction } from '../../context/state/actions'

const Wrapper = styled.div`
	align-items: center;
	color: #AAA;
	display: grid;
	grid-template-columns: 16px auto 16px;
	height: 48px;
`

const Prev = styled(PaginationButton)`
	font-size: 20px;
	margin-top: -4px;
	justify-self: start;
`

const Next = styled(Prev)`
	justify-self: end;
`

const PageNumbers = styled.div`
	align-items: center;
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(16px, 1fr));
	justify-items: center;
`

export interface PaginationProps {
	currentPage: number
	dispatch: React.Dispatch<FacetsDataReducerAction>
	resultsPerPage?: number
	total: number
	setCurrentPage?: (page: number) => void
}

export function Pagination(props: PaginationProps) {
	const context = React.useContext(SearchPropsContext)

	let setCurrentPage = React.useCallback((page: number) => {
		props.dispatch({ type: 'SET_PAGE', page })
	}, [])

	// Override the setCurrentPage function if it was passed in as a prop
	// For example, the list facet overrides this function
	setCurrentPage = props.setCurrentPage || setCurrentPage

	const pageCount = Math.ceil(props.total / (props.resultsPerPage || context.resultsPerPage))

	const { first, current, last } = usePages(props.currentPage, pageCount)

	const toPrev = React.useCallback(() => {
		setCurrentPage(props.currentPage - 1)
	}, [props.currentPage])

	const toNext = React.useCallback(() => {
		setCurrentPage(props.currentPage + 1)
	}, [props.currentPage])

	const toBetweenFirstAndCurrent = React.useCallback(() => {
		const page = Math.round((first[first.length - 1] + current.concat(last)[0]) / 2)
		setCurrentPage(page)
	}, [first, current, last])
	const toBetweenCurrentAndLast = React.useCallback(() => {
		const lowerPageNumbers = first.concat(current) // first can be filled, while current is empty
		const page = Math.round((lowerPageNumbers[lowerPageNumbers.length - 1] + last[0]) / 2)
		setCurrentPage(page)
	}, [first, current, last])

	const toPageNumber = React.useCallback(
		(page: number) => (
			<PageNumber
				currentPage={props.currentPage}
				key={page}
				pageNumber={page}
				setCurrentPage={setCurrentPage}
			/>
		),
		[props.currentPage]
	)

	if (isNaN(pageCount) || pageCount === 1) return null

	return (
		<Wrapper className="rdt-search__pagination">
			{props.currentPage !== 1
				? <Prev onClick={toPrev} color={context.style.spotColor}>◂</Prev>
				: <Prev color="#DDD" disabled>◂</Prev>
			}
			<PageNumbers className="pagenumbers">
				{first.length > 0 && first.map(toPageNumber)}
				{first.length > 0 && current.length > 0 && <PaginationButton onClick={toBetweenFirstAndCurrent} color={context.style.spotColor}>…</PaginationButton>}
				{current.map(toPageNumber)}
				{last.length > 0 && <PaginationButton onClick={toBetweenCurrentAndLast} color={context.style.spotColor}>…</PaginationButton>}
				{last.length > 0 && last.map(toPageNumber)}
			</PageNumbers>
			{props.currentPage !== pageCount
				? <Next onClick={toNext} color={context.style.spotColor}>▸</Next>
				: <Next color="#DDD" disabled>▸</Next>
			}
		</Wrapper>
	)
}
