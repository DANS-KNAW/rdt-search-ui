import React from 'react'
import styled from 'styled-components'

import { BACKGROUND_GRAY } from '../../../constants'
import { SearchPropsContext } from '../../../context/props'
import { PaginationProps } from '.'

export const PaginationButton = styled.button`
	background: none;
	border: none;
	color: ${(props: { color: string, disabled?: boolean }) => props.color};
	cursor: ${props => props.disabled ? 'default' : 'pointer'};
	outline: none;
	padding: 0;
`

interface PnProps { active: boolean }
const PageNumberWrapper = styled(PaginationButton)`
	background-color: ${(props: PnProps) => props.active ? BACKGROUND_GRAY : 'white'};
	border-radius: .25em;
	color: ${(props: PnProps) => props.active ? '#888' : 'inherit'};
	font-weight: ${(props: PnProps) => props.active ? 'bold' : 'normal'};
	padding: .35em;
	text-align: center;
`

interface Props extends Pick<PaginationProps, 'currentPage'> {
	pageNumber: number
	setCurrentPage: (page: number) => void
}
export function PageNumber(props: Props) {
	const { style } = React.useContext(SearchPropsContext)
	const active = props.pageNumber === props.currentPage

	return (
		<PageNumberWrapper
			active={active}
			className={active ? 'active' : undefined}
			key={props.pageNumber}
			onClick={() => props.setCurrentPage(props.pageNumber)}
			color={style.spotColor}
		>
			{props.pageNumber}
		</PageNumberWrapper>
	)
}

