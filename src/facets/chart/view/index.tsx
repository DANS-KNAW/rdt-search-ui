import type { Facet } from '../..'
import type { KeyCount } from '../../list/state'
import type { ChartFacetConfig, ChartFacetState, KeyCountMap } from '../state'

import React from 'react'
import styled from 'styled-components'
import * as echarts from 'echarts'

import FacetWrapper from '../../wrapper'
import debounce from 'lodash.debounce'
import { ChartFacetType, FacetType } from '../../../common/enum'
import { DateChartFacet } from '../date'

const barSetOptions: echarts.EChartsOption = {
	tooltip: {},
	xAxis: {
		data: []
	},
	yAxis: {
		minInterval: 1,
	},
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

const updateValues: Record<ChartFacetType, (values: any /* KeyCount[] | Map<string, number> */) => echarts.EChartsOption> = {
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
	[FacetType.Date]: (values: KeyCountMap) => ({
		xAxis: {
			data: Array.from(values.keys())
		},
		series: [
			{
				data: Array.from(values.values())
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

		// console.log(props.facet.ID, props.values, props.facet.valueRange, zoomValue.current)

		let option = updateValues[props.facet.type as ChartFacetType](props.values)

		// Define range upfront for type checking
		const { range } = (props.facet as DateChartFacet)

		if (typeof props.facetState.filter === 'string') {
			option.dataZoom = [
				{
					startValue: props.facetState.filter,
					endValue: props.facetState.filter,
				}
			]
		} else if (Array.isArray(props.facetState.filter)) {
			option.dataZoom = [
				{
					start: props.facetState.filter[0],
					end: props.facetState.filter[1],
				}
			]
		} else if (range) {
			const { min, max, currentMin, currentMax } = range
			option.dataZoom = [
				{
					start: (currentMin - min) / (max - min) * 100,
					end: (currentMax - min) / (max - min) * 100,
				}
			]
		}

		chart.current.setOption(option)
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
