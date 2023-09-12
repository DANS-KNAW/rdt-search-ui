import React from 'react'
import { ChartFacet } from '.'
import { DateChartController } from '../date-chart-controller'
import type { ChartFacetProps, DateChartFacetConfig, DateChartFacetState } from '../state'
import { isConfig } from '../../common'

export function DateChartFacet(props: { config: DateChartFacetConfig } | ChartFacetProps<DateChartFacetConfig, DateChartFacetState>) {
	if (isConfig(props)) return null
	return <ChartFacet<DateChartFacetConfig, DateChartFacetState> {...props} />
}
DateChartFacet.controller = DateChartController
