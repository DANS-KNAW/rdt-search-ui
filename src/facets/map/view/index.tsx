import type { MapFacetConfig, MapFacetState, MapFacetValue } from '../state'

import React from 'react'

import FacetWrapper from '../../wrapper'
import { MapFacetController } from '../controller'
import { MapView } from './map'
import { isConfig } from '../../common'
import styled from 'styled-components'
import { FACETS_WIDTH } from '../../../constants'

const MapFacetWrapper = styled(FacetWrapper)`
	.inner-container {
		display: grid;
		grid-template-rows: 1fr fit-content(0);
		height: 100%;
		min-height: ${FACETS_WIDTH * .75}px;
	}
`

export interface MapFacetProps {
	facet: MapFacetController
	facetState: MapFacetState
	values: MapFacetValue[]
}

export function MapFacet(props: { config: MapFacetConfig } | MapFacetProps) {
	if (isConfig(props)) return null
	return <_MapFacet {...props} />
}
MapFacet.controller = MapFacetController

function _MapFacet(props: MapFacetProps) {
	if (props.facetState == null) return

	return (
		<MapFacetWrapper {...props} className="map-facet">
			<div className="inner-container">
				<MapView {...props} />
				<div className="controls">
					<input
						id="search-on-zoom-checkbox"
						type="checkbox"
						checked={props.facetState.searchOnZoom}
						onChange={() => props.facet.actions.toggleSearchOnZoom()}
					/>
					<label htmlFor="search-on-zoom-checkbox">Search on zoom</label>
				</div>
			</div>	
		</MapFacetWrapper>
	)
}
