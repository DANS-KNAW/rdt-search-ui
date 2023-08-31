import type { Facet } from '../..'
import type { KeyCount } from '../../list/state'
import type { ChartFacetConfig, ChartFacetState } from '../state'

import React from 'react'
import styled from 'styled-components'
import * as echarts from 'echarts'

import FacetWrapper from '../../wrapper'
import debounce from 'lodash.debounce'
import { ChartFacetType, FacetType } from '../../../common/enum'

const barSetOptions: echarts.EChartsOption = {
	tooltip: {},
	xAxis: {
		data: []
	},
	yAxis: {},
	series: [{
		type: 'bar',
		data: [],
	}],
	dataZoom: [
		{
			type: 'slider',
			height: 18,
			top: 248,

			// Do not change the y-axis when zooming
			filterMode: 'empty',
		},
	],
	grid: {
		top: 24,
		// bottom: 36,
	}
}

const initialSetOptions: Record<ChartFacetType, echarts.EChartsOption> = {
	[FacetType.Date]: barSetOptions,
	[FacetType.Bar]: barSetOptions,
	[FacetType.Pie]: {
		tooltip: {},
		series: [{
			type: 'pie',
			data: [],
			radius: '60%'
		}]
	}
}

const updateValues: Record<ChartFacetType, (values: any[]) => echarts.EChartsOption> = {
	[FacetType.Bar]: (values: KeyCount[]) => ({
		xAxis: {
			data: values.map(value => value.key)
		},
		series: [
			{
				data: values.map((value) => value.count)
			}
		]
	}),
	[FacetType.Date]: (values: KeyCount[]) => ({
		xAxis: {
			data: values.map(value => value.key)
		},
		series: [
			{
				data: values.map((value) => value.count)
			}
		]
	}),
	[FacetType.Pie]: (values: KeyCount[]) => ({
		series: [
			{
				data: values.map((value) => ({
					value: value.count,
					name: value.key
				}))
			}
		]
	})
}

const ChartFacetWrapper = styled(FacetWrapper)`
	.container {
		width: 100%;
	}

	&.facet__pie-chart .container {
		height: 160px;
	}

	&.facet__bar-chart .container,
	&.facet__date-chart .container {
		height: 280px;
	}
`

export interface ChartFacetProps {
	facet: Facet<ChartFacetConfig, ChartFacetState>
	facetState: ChartFacetState
	values: KeyCount[]
}
export function ChartFacetView(props: ChartFacetProps) {
	// Ref to the chart instance
	const chart = React.useRef<echarts.ECharts | null>(null)

	// Ref to the container element
	const containerRef = React.useRef<HTMLDivElement>(null)

	// Initialize the chart
	React.useEffect(() => {
		if (containerRef.current == null) return

		// Initialize the chart and set the container element
		chart.current = echarts.init(containerRef.current)

		// Set the options
		chart.current.setOption(initialSetOptions[props.facet.type as ChartFacetType])

		// Add click event listener
		chart.current.on('click', (params) => {
			props.facet.actions.setFilter(params.name)
		})

		chart.current.on('datazoom', debounce((params: any) => {
			props.facet.actions.setFilter([params.start, params.end])
		}, 1000))

		return () => chart.current?.dispose()
	}, [])

	// Update the chart when the values change
	React.useEffect(() => {
		if (
			props.values == null ||
			chart.current == null
		) return

		chart.current.setOption(updateValues[props.facet.type as ChartFacetType](props.values))
	}, [props.values])

	return (
		<ChartFacetWrapper
			className={`facet__${props.facet.type}-chart`}
			{...props}
		>
			<div
				className="container"
				ref={containerRef}
			>
			</div>
		</ChartFacetWrapper>

	)
}
