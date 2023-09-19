import type { EChartsOption } from 'echarts'
import { FacetController } from '../controller'
import type { ChartFacetConfig, ChartFacetProps, ChartFacetState } from './state'
import { FacetFilter } from '../../common/types/search/facets'

export abstract class ChartFacetController<
    FacetConfig extends ChartFacetConfig,
    FacetState extends ChartFacetState,
    Filter extends FacetFilter
> extends FacetController<FacetConfig, FacetState, Filter> {
    abstract setOptions(): EChartsOption
    abstract updateOptions(values: ChartFacetProps<FacetConfig, FacetState, Filter>['values']): EChartsOption
}