import type { EChartsOption } from 'echarts';
import { FacetController } from '..';
import type { ChartFacetConfig, ChartFacetProps, ChartFacetState } from './state'

export abstract class ChartFacetController<FacetConfig extends ChartFacetConfig, FacetState extends ChartFacetState> extends FacetController<FacetConfig, FacetState> {
    abstract setOptions(): EChartsOption
    abstract updateOptions(values: ChartFacetProps<FacetConfig, FacetState>['values']): EChartsOption
}