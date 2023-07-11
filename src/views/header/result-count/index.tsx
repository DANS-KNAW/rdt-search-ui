import React from 'react'
import styled from 'styled-components'

import { SortBy } from './order-by'

import { FSResponse, SetSortOrder, SortOrder } from '../../../common'
import { SearchPropsContext } from '../../../context/props'
import { SearchState } from '../../../context/state'

const Wrapper = styled.div`
	grid-column: 1;
	grid-row: 2;
	height: 48px;
	line-height: 46px;
`

interface Props {
	currentPage: SearchState['currentPage']
	searchResult: FSResponse
	sortOrder: SearchState['sortOrder']
}
export default function ResultCount(props: Props) {
	const { resultsPerPage, uiTexts } = React.useContext(SearchPropsContext)
	const [fromTo, setFromTo] = React.useState<[number, number]>()

	React.useEffect(() => {
		let nextFrom = (props.currentPage - 1) * resultsPerPage + 1
		if (nextFrom > props.searchResult.total) nextFrom = props.searchResult.total

		let nextTo = nextFrom + resultsPerPage - 1
		if (nextTo > props.searchResult.total) nextTo = props.searchResult.total

		setFromTo([nextFrom, nextTo])
	}, [props.currentPage, resultsPerPage, props.searchResult.total])

	if (fromTo == null) return null

	return (
		<Wrapper>
			{fromTo[0]}-{fromTo[1]} {uiTexts.of} {props.searchResult.total} {props.searchResult.total === 1 ? uiTexts.result : uiTexts.results}
			<SortBy
				// setSortOrder={props.setSortOrder}
				sortOrder={props.sortOrder}
			/>
		</Wrapper>
	)
}
