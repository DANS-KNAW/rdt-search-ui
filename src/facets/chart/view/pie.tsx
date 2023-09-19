import React from 'react'
import { ChartFacet } from '.'
import { PieChartController } from '../pie-chart-controller'
import { ChartFacetConfig, ChartFacetProps, PieChartFacetFilter, PieChartFacetState } from '../state'
import { isConfig } from '../../common'

export function PieChartFacet(props: { config: ChartFacetConfig } | ChartFacetProps<ChartFacetConfig, PieChartFacetState, PieChartFacetFilter>) {
	if (isConfig(props)) return null
	return <ChartFacet<ChartFacetConfig, PieChartFacetState, PieChartFacetFilter> {...props} />
}
PieChartFacet.controller = PieChartController