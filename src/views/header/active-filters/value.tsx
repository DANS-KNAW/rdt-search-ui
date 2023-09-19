import React from 'react'
import styled from 'styled-components'
import { Label } from '../../ui/label'

export const Ul = styled.ul`
`

// interface Props {
// 	dispatch: React.Dispatch<FacetsDataReducerAction>
// 	filters: SearchState['facetFilters']
// 	facets: Facet<any, any>[]
// }
// export function ActiveFiltersDetails(props: Props) {
// 	const { style, uiTexts } = React.useContext(SearchPropsContext)

// 	const reset = React.useCallback(() => {
// 		facets.forEach(facet => facet.reset())
// 		dispatch({ type: 'RESET' })
// 	}, [facets])

// 	return (
// 	)
// }

const Li = styled(Label)`
	cursor: pointer;
	display: grid;
	grid-template-columns: 1fr 16px;
	max-width: 100%;
	margin-right: .5rem;

	&:last-of-type {
		margin-right: 0;
	}

	&:hover {
		border-color: #BBB;

		.active-filters__close {
			color: #444;
			font-weight: bold;
		}
	}


	.active-filters__value {
		overflow: hidden;
		line-height: 1rem;
		max-width: 100%;
		text-overflow: ellipsis;
	}

	.active-filters__close {
		color: #888;
		font-size: 0.7rem;
		line-height: 1rem;
		text-align: right;
	}
`

export function ActiveFilterValue(props: {
	removeFilter: () => void,
	title: string
	value: string
}) {
	return (
		<Li
			as="li"
			onClick={props.removeFilter}
			title={props.title}
		>
			<div className="active-filters__value">{props.value}</div>
			<div className="active-filters__close">✕</div>
		</Li>		
	)

}