import React from 'react'
import styled from 'styled-components'
import { KeyCount, ListFacetConfig, ListFacetState } from '../state'
import { Facet } from '../..'

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
	grid-template-columns: 1fr fit-content(0) 4px;

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
	facet: Facet<ListFacetConfig, ListFacetState>
	keyFormatter: (key: string | number, query?: string) => string
	query: ListFacetState['query']
	value: KeyCount
}

function ListFacetValueView(props: Props) {
	// const searchContext = React.useContext(SearchStateContext)
	const handleChange = React.useCallback(() => {
		// TODO remove/add filter
		// const type = props.active ? 'REMOVE_FILTER' : 'ADD_FILTER'
		// searchContext.dispatch({ type, facetId: props.facetId, value: props.value.key })
		props.facet.actions.toggleFilter(props.value.key)

	}, [props.active, props.facet.ID, props.value.key])

	return (
		<Wrapper
			active={props.active}
			onClick={handleChange}
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
