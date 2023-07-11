import type { BaseFacetConfig, BaseFacetState } from "../../common/types/search/facets"
import type { KeyCount } from "../list/state"

export interface ChartFacetConfig extends BaseFacetConfig {
}

export interface ChartFacetState extends BaseFacetState {
	filter: string | undefined
	initialValues: KeyCount[] | undefined
} 
