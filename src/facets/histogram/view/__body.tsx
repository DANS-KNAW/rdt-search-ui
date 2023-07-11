import type { HistogramFacetProps } from '.'

import React from 'react'

import { Histogram } from './histogram'
import { RangeSlider } from './slider'
// import Bars from './bars'

// import * as echarts from 'echarts'
// import { echarts } from '../../../echarts'

// const SliderWrapper = styled.div`
// 	position: relative;
// 	input:first-child {
// 		direction: rtl;
// 	}

// 	input {
// 		position: absolute;
// 		opacity: .5;
// 	}

// 	input:nth-child(2) {
// 		appearance: none;
// 	}
// `

export function HistogramFacetBody(props: HistogramFacetProps) {
	return (
		<>
			{/* <Bars
				{...props}
			/> */}
		</>
	)
}

// function RangeFacetBody(props: RangeFacetProps) {
// 	console.log(props)
// 	const ref = React.useRef<HTMLDivElement>(null)

// 	React.useEffect(() => {
// 		// import('echarts').then(({ default: echarts }) => {
// 			console.log('range facet body mounted', ref.current)
// 			console.log(props.values)
// 			console.log(echarts)
// 			echarts.init(ref.current as HTMLDivElement).setOption({
// 				tooltip: {},
// 				xAxis: {
// 					// data: ['shirt', 'cardigan', 'chiffon', 'pants', 'heels', 'socks']
// 					data: props.values.map(x => `${x.fromLabel} - ${x.toLabel}`),
// 				},
// 				yAxis: {
// 				},
// 				series: [
// 					{
// 						name: 'sales',
// 						type: 'bar',
// 						data: props.values.map(x => x.count)
// 					}
// 				]
// 			})
// 		// })


// 	}, [])


// 	return (
// 		<div ref={ref} style={{ width: '300px', height: '300px' }}><h1>range</h1></div>
// 	)
// }
















			{/* <Slider
				lowerLimit={lowerLimit}
				onChange={(data: any) => {
					// const rangeMin = ratioToTimestamp(data.lowerLimit, props.values)
					// const rangeMax = ratioToTimestamp(data.upperLimit, props.values)
					// setRange([ rangeMin, ran)geMax ])
					console.log(data)
				}}
				style={{
					marginTop: '-6px',
					position: 'absolute',
				}}
				upperLimit={upperLimit}
			/> */}
