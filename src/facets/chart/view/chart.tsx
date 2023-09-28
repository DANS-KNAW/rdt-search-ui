import type { ChartFacetConfig, ChartFacetProps, ChartFacetState } from '../state'

import React from 'react'
import styled from 'styled-components'
import * as echarts from 'echarts'

import FacetWrapper from '../../wrapper'
import debounce from 'lodash.debounce'
import { FacetFilter } from '../../../common/types/search/facets'

const ChartFacetWrapper = styled(FacetWrapper)`
	height: 100%;

	.container {
		width: 100%;
	}

	&.pie-chart-facet .inner-container {
		height: 100%;
		min-height: 160px;
	}

	&.bar-chart-facet .inner-container,
	&.date-chart-facet .inner-container {
		height: 100%;
		min-height: 280px;
	}
`

export function ChartFacet<
	Config extends ChartFacetConfig,
	State extends ChartFacetState,
	Filter extends FacetFilter
> (
	props: ChartFacetProps<Config, State, Filter>
) {
	// Ref to the chart instance
	const chart = React.useRef<echarts.ECharts | null>(null)

	// Ref to the container element
	const containerRef = React.useRef<HTMLDivElement>(null)

	// Initialize the chart
	React.useEffect(() => {
		if (containerRef.current == null) return

		// Initialize the chart and set the container element
		chart.current = echarts.init(containerRef.current)

		const options = props.facet.setOptions()
		// Set the options
		chart.current.setOption(options)

		// Add click event listener
		chart.current.on('click', (params) => {
			props.dispatch({
				type: "UPDATE_FACET_FILTER",
				subType: "CHART_FACET_SET_FILTER",
				facetID: props.facet.ID,
				value: params.name
			})
		})

		chart.current.on('datazoom', debounce((params: any) => {
			props.dispatch({
				type: "UPDATE_FACET_FILTER",
				subType: "CHART_FACET_SET_RANGE",
				facetID: props.facet.ID,
				value: [params.start, params.end]
			})
		}, 1000))

		return () => chart.current?.dispose()
	}, [])

	// Update the chart when the values change
	React.useEffect(() => {
		if (
			props.values == null ||
			chart.current == null
		) return

		const options = props.facet.updateOptions(props.values)

		chart.current.setOption(options)
	}, [props.values])

	return (
		<ChartFacetWrapper
			className={`${props.facet.type}-chart-facet`}
			{...props}
		>
			<div
				className="inner-container"
				ref={containerRef}
			>
			</div>
		</ChartFacetWrapper>
	)
}
