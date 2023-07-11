import type { BaseFacetConfig, BaseFacetState } from "../../common/types/search/facets"

export interface HistogramFacetConfig extends BaseFacetConfig {
	readonly range?: number,
	readonly interval?: number,
}

export interface HistogramFacetState extends BaseFacetState {
	interval: number
	filter: HistogramFacetValue | undefined
	value: HistogramFacetValue | undefined
	initialValues: HistogramFacetValue[] | undefined
} 

export interface HistogramFacetValue {
	from: number
	to: number
	fromLabel: string
	toLabel: string
	count: number
}