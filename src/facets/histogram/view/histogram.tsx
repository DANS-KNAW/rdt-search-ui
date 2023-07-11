import React from 'react'
import styled from 'styled-components'
import { Colors } from '../../../common'

import type { HistogramFacetProps } from '.'
import { SearchStateContext } from '../../../context/state'
import { HistogramFacetValue } from '../state'
import { FACETS_WIDTH } from '../../../constants'

interface WrapperProps { barCount: number }
const Wrapper = styled.div`
	display: grid;
	grid-template-columns: repeat(${(props: WrapperProps) => props.barCount}, 1fr);
	grid-column-gap: 1px;
	position: relative;
`

interface BarProps { active: boolean }
const Bar = styled.div`
	align-items: end;
	border: 1px solid white;
	box-sizing: border-box;
	cursor: ${(props: BarProps) => props.active ? 'pointer' : 'default'};
	display: grid;
	height: 100%;
	position: relative;

	&:hover {
		background: #EEE;

		.fill {
			background: ${Colors.BlueBright};
		}

		.popover {
			opacity: 1;
		}
	}
`

interface BarFillProps { height: number }
const BarFill = styled.div`
	background: #CCC;
	height: ${(props: BarFillProps) => {
		let height = props.height
		if (height > 0 && height < .03) height = .03 /* Set minimum height to 3px */
		return `${height * 60}px`
	}};
`

const BarData = styled.div`
	color: ${Colors.Orange};
	font-size: .8rem;
	position: absolute;
`
const ActiveCount = styled(BarData)`
	width: 80px;
	left: -86px;
	text-align: right;
`

const ActiveRange = styled(BarData)`
	bottom: -20px;
	width: 100%;
	text-align: center;
`

function isActiveBar(value: HistogramFacetValue | null, props: HistogramFacetProps) {
	const hasCount = value != null && value.count > 0

	// const spec = isRangeFacetData(props.facetState) ?
	// 	// If the bar is from a range facet, the user can drill down further
	// 	// if the interval is bigger than 1 or there are more props.values.
	// 	// The range facet's values are integers, so lower than 1 is impossible,
	// 	// but if there are still more values, it should be possible to drill down
	// 	// to that value. If that integer is the only value, drilling down should 
	// 	// be no longer possible
	// 	(props.facetState.interval > 1 || props.values.length > 1) :

	// 	// If the bar is a date facet, it needs more than 1 props.values to be able
	// 	// to drill down. 
	// 	props.values.length > 1
	const spec = (props.facetState.interval > 1 || (props.values != null && props.values.length > 1))

	return hasCount && spec
}

// TODO remove isRangeFacet
function formatRange(value: HistogramFacetValue, isRangeFacet: boolean = true) {
	if (isRangeFacet && value.from === value.to - 1) return value.fromLabel
	return `${value.fromLabel} - ${value.toLabel}`
}

// type Props = Pick<RangeFacetProps, 'facetState' | 'values'>
export function Histogram(props: HistogramFacetProps) {
	const counts = props.values?.map(v => v.count) || []
	const maxCount = counts.length ? Math.max(...counts) : 0

	const activeValue = React.useRef<HistogramFacetValue | undefined>()

	const handleBarClick = React.useCallback(() => {
		if (activeValue.current == null || activeValue.current.count === 0) return
		props.facet.actions.setFilter(activeValue.current)
	}, [])

	if (props.values == null) return null

	return (
		<Wrapper
			barCount={props.values.length}
			onMouseOut={() => activeValue.current = undefined}
		>
			{/* {
				activeValue != null &&
				<>
					{
						activeValue.count > 0 &&
						<ActiveCount>{activeValue.count}</ActiveCount>
					}
					<ActiveRange>{formatRange(activeValue)}</ActiveRange>
				</>
			} */}
			{
				props.values.map((value, index) =>
					<Bar
						active={isActiveBar(value, props)}
						key={index}
						onClick={handleBarClick}
						onMouseOver={(e) => {
							activeValue.current = value
							// setActiveValue(value)
						}}
						onMouseMove={(e) => {
							followMouse(e)
						}}
					>
						<BarFill
							className="fill"
							height={value.count/maxCount}
						/>
						<BarPopover className="popover">
							<div className="label">{value.fromLabel}</div>
							<div className="count">{value.count}</div>
						</BarPopover>
					</Bar>
				)
			}
		</Wrapper>
	)
}

		// const nextValue = props.values.values[index + 1]
		// if (value.count === 0) return
		// const from = value.count
		// const to = nextValue != null ? nextValue.count : null
		// console.log(from, to)

const BarPopover = styled.div`
	position: absolute;
	background: white;
	box-shadow: 2px 2px 6px #DDD;
	white-space: nowrap;
	padding: .25rem .5rem;
	opacity: 0;
	transition: opacity 300ms ease-in-out;
	z-index: 1;
	display: grid;
	grid-template-columns: minmax(80px, 1fr) fit-content(0);
	max-width: ${FACETS_WIDTH}px;

	& > div {
		line-height: 1.5rem;
	}

	& > .label {
		font-size: .9rem;
	}

	& > .count {
		color: #888;
		font-size: .8rem;
		padding-left: .4rem;
	}
`

function followMouse(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
	const bar = e.currentTarget as HTMLElement
	const popover = bar.querySelector('.popover') as HTMLElement
	const rect = bar.getBoundingClientRect()
	const x = e.clientX - rect.left
	const y = e.clientY - rect.top
	if (x > 0 && y > 0) {
		popover.style.left = `${x}px`
		popover.style.top = `${y + 10}px`
	}
}

	// let values = [
	// 	{ from: 0, to: 10, count: 10, fromLabel: '0', toLabel: '10' },
	// 	{ from: 10, to: 20, count: 20, fromLabel: '10', toLabel: '20' },
	// 	{ from: 20, to: 30, count: 130, fromLabel: '20', toLabel: '30' },
	// 	// { from: 30, to: 40, count: 40, fromLabel: '30', toLabel: '40' },
	// 	// { from: 40, to: 50, count: 50, fromLabel: '40', toLabel: '50' },
	// 	// { from: 50, to: 60, count: 60, fromLabel: '50', toLabel: '60' },
	// 	// { from: 60, to: 70, count: 7, fromLabel: '60', toLabel: '70' },
	// 	// { from: 70, to: 80, count: 80, fromLabel: '70', toLabel: '180' },
	// 	// { from: 80, to: 90, count: 90, fromLabel: '80', toLabel: '90' },
	// 	// { from: 90, to: 100, count: 10, fromLabel: '90', toLabel: '100' },
	// 	// { from: 100, to: 110, count: 110, fromLabel: '100', toLabel: '10' },
	// 	{ from: 110, to: 120, count: 12, fromLabel: '110', toLabel: '120' },
	// 	{ from: 120, to: 130, count: 130, fromLabel: '120', toLabel: '130' },
	// 	{ from: 130, to: 140, count: 40, fromLabel: '130', toLabel: '40' },
	// 	{ from: 140, to: 150, count: 10, fromLabel: '140', toLabel: '150' },
	// 	{ from: 150, to: 160, count: 60, fromLabel: '150', toLabel: '60' },
	// 	{ from: 160, to: 170, count: 170, fromLabel: '160', toLabel: '170' },
	// 	{ from: 0, to: 10, count: 10, fromLabel: '0', toLabel: '10' },
	// 	{ from: 10, to: 20, count: 20, fromLabel: '10', toLabel: '20' },
	// 	{ from: 20, to: 30, count: 130, fromLabel: '20', toLabel: '30' },
	// 	{ from: 30, to: 40, count: 40, fromLabel: '30', toLabel: '40' },
	// 	// { from: 40, to: 50, count: 50, fromLabel: '40', toLabel: '50' },
	// 	// { from: 50, to: 60, count: 60, fromLabel: '50', toLabel: '60' },
	// 	// { from: 60, to: 70, count: 7, fromLabel: '60', toLabel: '70' },
	// 	// { from: 70, to: 80, count: 80, fromLabel: '70', toLabel: '180' },
	// 	// { from: 80, to: 90, count: 90, fromLabel: '80', toLabel: '90' },
	// 	// { from: 90, to: 100, count: 10, fromLabel: '90', toLabel: '100' },
	// 	// { from: 100, to: 110, count: 110, fromLabel: '100', toLabel: '10' },
	// 	// { from: 110, to: 120, count: 12, fromLabel: '110', toLabel: '120' },
	// 	// { from: 120, to: 130, count: 130, fromLabel: '120', toLabel: '130' },
	// 	// { from: 130, to: 140, count: 40, fromLabel: '130', toLabel: '40' },
	// 	// { from: 140, to: 150, count: 10, fromLabel: '140', toLabel: '150' },
	// 	// { from: 150, to: 160, count: 60, fromLabel: '150', toLabel: '60' },
	// 	// { from: 160, to: 170, count: 170, fromLabel: '160', toLabel: '170' },
	// 	// { from: 0, to: 10, count: 10, fromLabel: '0', toLabel: '10' },
	// 	// { from: 10, to: 20, count: 20, fromLabel: '10', toLabel: '20' },
	// 	// { from: 20, to: 30, count: 130, fromLabel: '20', toLabel: '30' },
	// 	// { from: 30, to: 40, count: 40, fromLabel: '30', toLabel: '40' },
	// 	{ from: 40, to: 50, count: 50, fromLabel: '40', toLabel: '50' },
	// 	{ from: 50, to: 60, count: 60, fromLabel: '50', toLabel: '60' },
	// 	{ from: 60, to: 70, count: 7, fromLabel: '60', toLabel: '70' },
	// 	{ from: 70, to: 80, count: 80, fromLabel: '70', toLabel: '180' },
	// 	{ from: 80, to: 90, count: 90, fromLabel: '80', toLabel: '90' },
	// 	{ from: 90, to: 100, count: 10, fromLabel: '90', toLabel: '100' },
	// 	{ from: 100, to: 110, count: 110, fromLabel: '100', toLabel: '10' },
	// 	{ from: 110, to: 120, count: 12, fromLabel: '110', toLabel: '120' },
	// 	{ from: 120, to: 130, count: 130, fromLabel: '120', toLabel: '130' },
	// 	{ from: 130, to: 140, count: 40, fromLabel: '130', toLabel: '40' },
	// 	{ from: 140, to: 150, count: 10, fromLabel: '140', toLabel: '150' },
	// 	{ from: 150, to: 160, count: 60, fromLabel: '150', toLabel: '60' },
	// 	{ from: 160, to: 170, count: 170, fromLabel: '160', toLabel: '170' },
	// ]

	// values = props.values || []