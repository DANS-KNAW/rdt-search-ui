import { ChartFacetController } from "./controller"
import type { BaseFacetConfig, BaseFacetState } from "../../common/types/search/facets"
import type { KeyCount } from "../list/state"

export interface ChartFacetConfig extends BaseFacetConfig {
}

export interface DateChartFacetConfig extends ChartFacetConfig {
	interval: 'year' | 'quarter' | 'month' | 'day' | 'hour' | 'minute'
}

export interface ChartFacetState extends BaseFacetState {
	filter: string | [number, number] | undefined
	initialValues: KeyCount[] | KeyCountMap | undefined
} 

export interface PieChartFacetState extends ChartFacetState {
	filter: string | undefined
	initialValues: KeyCount[] | undefined
} 

export interface DateChartFacetState extends ChartFacetState {
	// Filter is a:
	// 		- date string (e.g. '2020' or '2020-01-01')
	//		or
	// 		- range of percentages (e.g. [25, 100])
	filter: string | [number, number] | undefined
	initialValues: KeyCountMap | undefined
}

export type KeyCountMap = Map<string, number>

export interface ChartFacetProps<Config extends ChartFacetConfig, State extends ChartFacetState> {
	facet: ChartFacetController<Config, State>
	facetState: State
	values: NonNullable<State['initialValues']>
}
