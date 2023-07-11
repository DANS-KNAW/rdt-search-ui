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
			// @ts-ignore
			Options={Options}
		>
			<ListView
				{...props}
			/>
		</FacetWrapper>
	)
}
