import React from 'react'
import { ChartFacet } from '.'
import { PieChartController } from '../pie-chart-controller'
import { ChartFacetConfig, ChartFacetProps, PieChartFacetState } from '../state'
import { isConfig } from '../../common'

export function PieChartFacet(props: { config: ChartFacetConfig } | ChartFacetProps<ChartFacetConfig, PieChartFacetState>) {
	if (isConfig(props)) return null
	return <ChartFacet<ChartFacetConfig, PieChartFacetState> {...props} />
}
PieChartFacet.controller = PieChartController