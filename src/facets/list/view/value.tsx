import React from 'react'
import styled from 'styled-components'
import { KeyCount, ListFacetState } from '../state'

interface WProps { active: boolean }
const Wrapper = styled('li')`
	cursor: pointer;
	font-size: .9rem;
	font-weight: ${(p: WProps) => p.active ? 'bold' : 'normal' };
	margin-bottom: .4rem;
	padding-left: 1rem;
	position: relative;
	overflow: hidden;
	display: grid;
	grid-template-columns: 1fr fit-content(0);

	${p => p.active
		? `&:before {
				content: '•';
				font-size: 1.2rem;
				margin-top: -.175rem;
				position: absolute;
			}`
		: `&:hover:before {
				content: '◦';
				font-size: 1.2rem;
				margin-top: -.175rem;
				position: absolute;
			}`
	}

	& > .value {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	 
	& > .count {
		color: #888;
		font-size: .8rem;
		padding-left: .4rem;
	}
`

interface Props {
	active: boolean
	keyFormatter: (key: string | number, query?: string) => string
	query: ListFacetState['query']
	toggleFilter: (ev: React.MouseEvent) => void
	value: KeyCount
}

function ListFacetValueView(props: Props) {
	return (
		<Wrapper
			active={props.active}
			onClick={props.toggleFilter}
			title={props.value.key}
		>
			<span
				className="value"
				dangerouslySetInnerHTML={{ __html: props.keyFormatter(props.value.key, props.query) }}
			/>
			<span className="count">{props.value.count}</span>
		</Wrapper>

	)
}

ListFacetValueView.defaultProps = {
	// TODO use keyFormatter higher up the tree? now everytime the facet value is rendered,
	// the keyFormatter function is run
	keyFormatter: (value: string, query?: ListFacetState['query']) => {
		value = value.trim().length > 0 ? value : '<i>&lt;empty&gt;</i>'

		if (query?.length) {
			value = value.replace(new RegExp(`(${query})`, 'gi'), '<b>$1</b>')
		}

		return value
	}
}

export default ListFacetValueView
