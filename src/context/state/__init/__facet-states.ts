import type { FacetStates } from '../../../common'
import type { SearchProps } from '../../props'

import { HistogramFacetUtils } from '../../../views/facets/histogram/utils'
import { ListFacetUtils } from '../../../views/facets/list/utils'
// import { MapFacetUtils } from '../../../views/facets/map/utils'

export function initFacetStates(facetsConfig: SearchProps['facets']) {
	const facetStates: FacetStates = new Map()

	for (const [id, config] of facetsConfig) {
		if (ListFacetUtils.is(config)) {
			facetStates.set(id, ListFacetUtils.initState(config))
		}	
		else if (HistogramFacetUtils.is(config)) {
			facetStates.set(id, HistogramFacetUtils.initState(config))
		}
		else if (MapFacetUtils.is(config)) {
			facetStates.set(id, MapFacetUtils.initState(config))
		}
	}

	return facetStates
}
