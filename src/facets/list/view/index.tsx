import type { ListFacetState, ListFacetValues } from '../state'

import React from 'react'

import { ListView } from './list-view'
import Options from './options'
import FacetWrapper from '../../wrapper'
import { ListFacet } from '..'

export interface ListFacetProps {
	facet: ListFacet
	facetState: ListFacetState
	values: ListFacetValues
}
export function ListFacetView(props: ListFacetProps) {
	return (
		<FacetWrapper
			{...props}
			className="list-facet"
			// @ts-ignore
			Options={Options}
		>

			{
				props.values != null &&
				(
					props.facet.viewState.pagination ||
					props.facet.viewState.query
				) &&
				<Options {...props}></Options>
			}
			<ListView
				{...props}
			/>
		</FacetWrapper>
	)
}
