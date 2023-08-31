import type { BaseFacetConfig, BaseFacetState } from "../../common/types/search/facets"
import type { KeyCount } from "../list/state"

export interface ChartFacetConfig extends BaseFacetConfig {
}

export interface DateChartFacetConfig extends ChartFacetConfig {
	interval: 'year' | 'quarter' | 'month' | 'day' | 'hour' | 'minute'
}

export interface ChartFacetState extends BaseFacetState {
	filter: string | undefined
	initialValues: KeyCount[] | undefined
} 

export interface DateChartFacetState extends BaseFacetState {
	// Filter is a date string (e.g. '2020' or '2020-01-01')
	// or a range of percentages (e.g. [25, 100])
	filter: string | [number, number] | undefined
	initialValues: KeyCount[] | undefined
}
