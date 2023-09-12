import type { ListFacetConfig, ListFacetState, ListFacetValues } from '../state'

import React from 'react'

import { ListView } from './list-view'
import Options from './options'
import FacetWrapper from '../../wrapper'
import { ListFacetController } from '../controller'
import { isConfig } from '../../common'

export interface ListFacetProps {
	facet: ListFacetController
	facetState: ListFacetState
	values: ListFacetValues
}

export function ListFacet(props: { config: ListFacetConfig } | ListFacetProps) {
	if (isConfig(props)) return null
	return <_ListFacet {...props} />
}
ListFacet.controller = ListFacetController

export function _ListFacet(props: ListFacetProps) {
	if (props.facet == null) return null

	return (
		<FacetWrapper
			{...props}
			className="list-facet"
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
