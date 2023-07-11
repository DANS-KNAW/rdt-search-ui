import { FacetConfig } from '../../../common'
import { HistogramFacetUtils } from '../../../views/facets/histogram/utils'
import { ListFacetUtils } from '../../../views/facets/list/utils'
// import { MapFacetUtils } from '../../../views/facets/map/utils'

export function extendFacetConfig(facetsConfig: FacetConfig[]) {
	const extended = facetsConfig.map(config => {
		if (ListFacetUtils.is(config))	  	return ListFacetUtils.initConfig(config)
		if (HistogramFacetUtils.is(config)) return HistogramFacetUtils.initConfig(config)
		if (MapFacetUtils.is(config))		return MapFacetUtils.initConfig(config)

		throw new Error(`Facet config with type: '${JSON.stringify(config)}' not found!`)
	})

	return new Map(extended.map((config, index) => [config.field + '_' + index, config]))
}

// TODO move
export function capitalize(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1)
}