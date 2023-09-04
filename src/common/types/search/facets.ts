// import type { HistogramFacetConfig, HistogramFacetState, HistogramFacetValue } from "../../../views/facets/histogram/state"
// import type { ListFacetConfig, ListFacetFilter, ListFacetState, ListFacetValues } from "../../../views/facets/list/state"
import type { MapFacetConfig, MapFacetFilter } from "../../../facets/map/state"

// import { FacetType } from "../../enum"

// TODO remove
// export type FacetValues = MapFacetValue[] // | ListFacetValues | HistogramFacetValue[]

// TODO remove
// export type FacetState = MapFacetState // | ListFacetState | HistogramFacetState

/*
 * BaseConfig is defined in @docere/common because it is also the
 * base for metadata and entities config
*/
export interface BaseFacetConfig {
	readonly field: string
	// readonly type: FacetType
	readonly title?: string
	readonly description?: string
	readonly collapse?: boolean
}

// TODO remove
export type FacetConfig = MapFacetConfig // | ListFacetConfig | HistogramFacetConfig

// TODO remove
export type FacetFilter = MapFacetFilter // | ListFacetFilter | HistogramFacetValue[]

export interface BaseFacetState {
	// type: FacetType
	collapse: boolean
	filter: any
}