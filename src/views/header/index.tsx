import React from 'react'
import styled, { css } from 'styled-components'

import { Pagination } from './pagination'
import ResultCount from './result-count'

import { FSResponse } from '../../common'
import { SearchState, SearchStateDispatchContext } from '../../context/state'

export const headerStyle = css`
	background-color: white;
	border-bottom: 1px solid #CCC;
	box-sizing: border-box;
	box-shadow: 0 1.5rem 1.5rem white;
	color: #888;
	font-size: .85em;
`

const Wrapper = styled.header`
	${headerStyle}
	color: #888;
	display: grid;
	font-size: .85em;
	grid-template-columns: 3fr 2fr;
`

interface Props {
	currentPage: SearchState['currentPage']
	searchResult: FSResponse | undefined
	sortOrder: SearchState['sortOrder']
}
export const ResultHeader = function Header(props: Props) {
	const dispatch = React.useContext(SearchStateDispatchContext)
	if (props.searchResult == null) return null

	return (
		<Wrapper id="rdt-search__result-header">
			<ResultCount
				currentPage={props.currentPage}
				searchResult={props.searchResult}
				sortOrder={props.sortOrder}
			/>
			<Pagination
				currentPage={props.currentPage}
				dispatch={dispatch}
				total={props.searchResult.total}
			/>
		</Wrapper>
	)
}
