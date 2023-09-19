import React from 'react'
import { ChartFacet } from '.'
import { DateChartController } from '../date-chart-controller'
import type { ChartFacetProps, DateChartFacetConfig, DateChartFacetFilter, DateChartFacetState } from '../state'
import { isConfig } from '../../common'

export function DateChartFacet(props: { config: DateChartFacetConfig } | ChartFacetProps<DateChartFacetConfig, DateChartFacetState, DateChartFacetFilter>) {
	if (isConfig(props)) return null
	return <ChartFacet<DateChartFacetConfig, DateChartFacetState, DateChartFacetFilter> {...props} />
}
DateChartFacet.controller = DateChartController
