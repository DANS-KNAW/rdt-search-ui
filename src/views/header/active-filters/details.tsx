import React from 'react'
import styled from 'styled-components'
import { Label } from '../../ui/label'

import { FacetController } from '../../../facets'

export const Ul = styled.ul`
	margin: 0;
	padding: 0;
	list-style: none;
	display: flex;
	flex-wrap: wrap;

	& > li {
		align-items: center;
		border-radius: 2px;
		border: 1px solid #DDD;
		box-shadow: 0 0 10px #EEE;
		display: flex;
		margin-bottom: .5rem;
		padding: .25rem .5rem;
 		margin-right: 1rem;
		
 		& > .active-filters__facet__title {
 			margin-right: .5rem;
 			white-space: nowrap;
		}

		& > ul.active-filters__facet__values {
			display: flex;
			list-style: none;
			margin: 0;
			padding: 0;

			& > li {
				margin-right: .5rem;

				&:last-of-type {
					margin-right: 0;
				}
			}
		}
	}
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

	&:hover {
		border-color: #BBB;

		& > div.close {
			color: #444;
			font-weight: bold;
		}
	}

	& > div.value {
		overflow: hidden;
		max-width: 100%;
		text-overflow: ellipsis;
	}

	& > div.close {
		color: #888;
		font-size: 0.7rem;
		text-align: right;
	}
`

export function ActiveFilterValue(props: {
	facet: FacetController<any, any>,
	value: string
}) {
	return (
		<Li
			as="li"
			onClick={() => props.facet.actions.removeFilter(props.value)}
			title={`Facet filter value: ${props.value}`}
		>
			<div className="value">{props.value}</div>
			<div className="close">✕</div>
		</Li>		
	)

}