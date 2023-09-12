import type { SortOrder } from '../../../../common'

import React from 'react'
import styled from 'styled-components'
import { SortDirection } from '../../../../common'

import { Button } from '../../../ui/button'
import { SearchPropsContext } from '../../../../context/props'
import { SearchStateContext } from '../../../../context/state'
import { FacetController } from '../../../../facets'

interface OOProps { active: boolean }
const Wrapper = styled.div`
	align-items: center;
	border-bottom: 1px solid #eee;
	color: ${(props: OOProps) => props.active ? '#222 !important' : 'inherit' };
	display: grid;
	grid-template-columns: 4fr 1fr;
	grid-gap: 1em;
	height: 2rem;
	text-transform: capitalize;
	white-space: nowrap;

	&:last-of-type {
		border: 0;
	}

	& > .title {
		cursor: pointer;
		font-weight: ${(props: OOProps) => props.active ? 'bold' : 'normal' };
	}

	& > button.toggle-direction {
		border: 1px solid #AAA;
		justify-self: end;
		display: grid;
		align-content: center;

		width: 1.2rem;
		height: 1.2rem;
		padding: .2rem;
	}
`

function updateSortOrder(sortOrder: SortOrder, field: string, direction: SortDirection = SortDirection.Desc) {
	if (sortOrder.has(field) && sortOrder.get(field) === direction) sortOrder.delete(field)
	else sortOrder.set(field, direction)

	return new Map(sortOrder)
}

interface Props {
	facet: FacetController<any, any>
	sortOrder: SortOrder
}
function OrderOption(props: Props) {
	const { style } = React.useContext(SearchPropsContext)
	const { dispatch } = React.useContext(SearchStateContext)

	const setDirection = React.useCallback((ev: React.MouseEvent) => {
		ev.stopPropagation()

		const nextDirection = props.sortOrder.get(props.facet.config.field) === SortDirection.Desc ?
			SortDirection.Asc :
			SortDirection.Desc

		const sortOrder = updateSortOrder(props.sortOrder, props.facet.config.field, nextDirection)
		dispatch({ type: 'SET_SORT_ORDER', sortOrder })
	}, [props.sortOrder])

	const setFacetId = React.useCallback((ev: React.MouseEvent) => {
		ev.stopPropagation()
		const direction = props.sortOrder.get(props.facet.config.field)
		const sortOrder = updateSortOrder(props.sortOrder, props.facet.config.field, direction)

		dispatch({ type: 'SET_SORT_ORDER', sortOrder })
	}, [props.sortOrder])

	const direction = props.sortOrder.get(props.facet.config.field)

	return (
		<Wrapper
			active={direction != null}
			key={props.facet.ID}
			onClick={setFacetId}
		>
			<div className="title">
				{props.facet.config.title}
			</div>
			{
				direction != null &&
				<Button
					className="toggle-direction"
					onClick={setDirection}
					spotColor={style.spotColor}
					title={direction === SortDirection.Desc ? 'Descending' : 'Ascending'}
				>
					{
						direction === SortDirection.Desc
							? <Desc />
							: <Asc />
					}
				</Button>
			}
		</Wrapper>		
	)
}

export default React.memo(OrderOption)

export function Asc({ title = "Ascending", color = '#444' }: { title?: string, color?: string }) {
	return (
		<svg
			viewBox="0 0 400 400"
		>
			<title>{title}</title>
			<line x1="260" y1="30" x2="370" y2="30" stroke={color} strokeLinecap="round" strokeWidth="60" />
			<line x1="110" y1="256" x2="370" y2="256" stroke={color} strokeLinecap="round" strokeWidth="60" />
			<line x1="180" y1="143" x2="370" y2="143" stroke={color} strokeLinecap="round" strokeWidth="60" />
			<line x1="30" y1="370" x2="370" y2="370" stroke={color} strokeLinecap="round" strokeWidth="60" />
		</svg>
	)
}

export function Desc({ title = "Descending", color = '#444' }: { title?: string, color?: string }) {
	return (
		<svg
			viewBox="0 0 400 400"
		>
			<title>{title}</title>
			<line x1="30" y1="30" x2="370" y2="30" stroke={color} strokeLinecap="round" strokeWidth="60" />
			<line x1="110" y1="143" x2="370" y2="143" stroke={color} strokeLinecap="round" strokeWidth="60" />
			<line x1="180" y1="256" x2="370" y2="256" stroke={color} strokeLinecap="round" strokeWidth="60" />
			<line x1="260" y1="370" x2="370" y2="370" stroke={color} strokeLinecap="round" strokeWidth="60" />
		</svg>
	)
}