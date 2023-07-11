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

export interface ChartFacetProps {
	facet: Facet<ChartFacetConfig, ChartFacetState>
	facetState: ChartFacetState
	values: KeyCount[]
}
export function ChartFacetView(props: ChartFacetProps) {
	const myChart = React.useRef<echarts.ECharts | null>(null)
	const chartRef = React.useRef<HTMLDivElement>(null)

	React.useEffect(() => {
		myChart.current = echarts.init(chartRef.current!)
		myChart.current.setOption({
			tooltip: {},
			series: [
				{
					name: props.facet.config.title,
					type: 'pie',
					data: [],
					radius: '60%'
				}
			]
		})

		myChart.current.on('click', (params) => {
			props.facet.actions.setFilter(params.name)
		})

		return () => myChart.current?.dispose()
	}, [])

	React.useEffect(() => {
		if (props.values == null) return
		myChart.current?.setOption({
			series: [
				{
					name: props.facet.config.title,
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
			<BodyWrapper ref={chartRef}>
			</BodyWrapper>
		</FacetWrapper>
	)
}
