import type { FSResponse } from '../../common'
import type { SearchProps } from '../../context/props'

import React from 'react'
import styled from 'styled-components'

import { ResultList, Result } from './components'
import { Pagination } from '../header/pagination'
import { SearchState, SearchStateContext } from '../../context/state'

const Section = styled.section`
	.rdt-search__pagination {
		margin-top: 64px;
	}
`

interface Props {
	currentPage: SearchState['currentPage']
	ResultBodyComponent: SearchProps['ResultBodyComponent']
	onClickResult: SearchProps['onClickResult']
	resultBodyProps: SearchProps['resultBodyProps']
	searchResult: FSResponse | undefined
}
export function SearchResult(props: Props) {
	if (props.searchResult == null) return null

	return (
		<Section id="rdt-search__search-result">
			<ResultList>
				{
					props.searchResult.results.map((hit, i) =>
						<Result
							key={i}
							onClick={(ev) => props.onClickResult(hit, ev)}
						>
							<props.ResultBodyComponent
								{...props.resultBodyProps}
								result={hit}
							/>
						</Result>
					)
				}
			</ResultList>
			<Pagination
				currentPage={props.currentPage}
				total={props.searchResult.total}
			/>
		</Section>
	)
}
