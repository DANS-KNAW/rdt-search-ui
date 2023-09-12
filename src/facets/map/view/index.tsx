import type { MapFacetState, MapFacetValue } from '../state'

import React from 'react'

import FacetWrapper from '../../wrapper'
import { MapFacetController } from '../controller'
import { MapView } from './map'

export interface MapFacetProps {
	facet: MapFacetController
	facetState: MapFacetState
	values: MapFacetValue[]
}
export function MapFacet(props: MapFacetProps) {
	if (props.facetState == null) return

	return (
		<FacetWrapper {...props} >
			<MapView {...props} />
			<input
				id="search-on-zoom-checkbox"
				type="checkbox"
				checked={props.facetState.searchOnZoom}
				onChange={() => props.facet.actions.toggleSearchOnZoom()}
			/>
			<label htmlFor="search-on-zoom-checkbox">Search on zoom</label>
		</FacetWrapper>
	)
}

MapFacet.mapFacetController = MapFacetController
