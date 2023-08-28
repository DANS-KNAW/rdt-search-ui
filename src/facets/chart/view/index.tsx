import type { Facet } from '../..'
import type { KeyCount } from '../../list/state'
import type { ChartFacetConfig, ChartFacetState } from '../state'

import React from 'react'
import styled from 'styled-components'
import * as echarts from 'echarts'

import FacetWrapper from '../../../facets/wrapper'

const BodyWrapper = styled.div`
	width: 100%;
	height: 160px;
`

const defaultSeriesOptions = {
	type: 'pie',
	data: [],
	radius: '60%'
}

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
		chart.current.setOption({
			tooltip: {},
			series: [{
				...defaultSeriesOptions,
				name: props.facet.config.title,
			}]
		})

		// Add click event listener
		chart.current.on('click', (params) => {
			props.facet.actions.setFilter(params.name)
		})

		return () => chart.current?.dispose()
	}, [])

	// Update the chart when the values change
	React.useEffect(() => {
		if (
			props.values == null ||
			chart.current == null
		) return

		chart.current.setOption({
			series: [
				{
					data: props.values.map((value) => ({
						value: value.count,
						name: value.key
					}))
				}
			]
		})
	}, [props.values])

	return (
		<FacetWrapper
			{...props}
		>
			<BodyWrapper ref={containerRef}>
			</BodyWrapper>
		</FacetWrapper>
	)
}
