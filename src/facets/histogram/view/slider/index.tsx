import React from 'react'
import { Handle } from './handle'
import styled from 'styled-components'

export const VIEW_BOX_WIDTH = 400

const SVG = styled.svg`
	box-sizing: border-box;
	padding: ${(props: { lineWidth: number }) => (props.lineWidth/2)}px;
	width: 100%;
`

interface IOnChangeData {
	refresh: boolean
	limits: Limits
}

// The element that is currently being dragged
export enum DragElement {
	Bar = 'bar',
	LowerLimit = 'lower',
	UpperLimit = 'upper'
}

interface Props {
	barWidth?: number
	className?: string
	handleRadius?: number
	lineWidth?: number
	lowerLimit?: number
	onChange: (data: IOnChangeData) => void
	spotColor?: string
	steps?: number
	upperLimit?: number
}

interface Limits {
	lower: number
	upper: number
}

export function RangeSlider({
	barWidth = 8,
	handleRadius = 8,
	lineWidth = 4,
	lowerLimit = 0,
	className,
	onChange,
	spotColor = 'blue',
	steps = 0,
	upperLimit = 1,
}: Props) {
	const isMouseDown = React.useRef(false)
	const activeElement = React.useRef<DragElement>()
	const svgRef = React.useRef<SVGSVGElement>(null)
	const [limits, setLimits] = React.useState<Limits>({ lower: lowerLimit, upper: upperLimit })

	const handleOrder: [DragElement, DragElement] = activeElement.current === DragElement.LowerLimit ?
		[DragElement.UpperLimit, DragElement.LowerLimit] :
		[DragElement.LowerLimit, DragElement.UpperLimit]

	// Add the lineWidth to the view box, because of the handle's stroke
	const viewBoxHeight = handleRadius * 2 + lineWidth
	const viewBoxWidth = VIEW_BOX_WIDTH + handleRadius * 2 + lineWidth

	const mouseMove = React.useCallback((ev: MouseEvent) => {
		if (isMouseDown.current) {
			const newLimits = getPositionForLimit(
				ev.pageX,
				limits,
				activeElement.current!,
				svgRef.current?.getBoundingClientRect()!
			)

			if (newLimits) {
				setLimits({ ...limits, ...newLimits })
			}

			return ev.preventDefault()
		}
	}, [limits])


	const mouseUp = React.useCallback(() => {
		window.removeEventListener('mousemove', mouseMove)

		let _limits = limits

		if (isMouseDown.current) {
			if (steps > 0) {
				// Normalise the steps to a range between 0 and 1
				const normalisedSteps = Array.from(Array(steps).keys()).map(x => x / (steps - 1))

				// Find the closest step to the current limits
				const closestUpper = getClosestNumber(normalisedSteps, limits.upper)
				const closestLower = getClosestNumber(normalisedSteps, limits.lower)

				// Set the limits to the closest step
				_limits = { lower: closestLower, upper: closestUpper }
				setLimits(_limits)
			}

			onChange({
				limits: _limits,
				refresh: true
			})

			activeElement.current = undefined
		}

		isMouseDown.current = false
	}, [limits, mouseMove])

	const mouseDown = React.useCallback((ev: any) => {
		window.addEventListener('mousemove', mouseMove)

		const { handle } = ev.currentTarget.dataset
		activeElement.current = handle

		isMouseDown.current = true
		return ev.preventDefault()
	}, [mouseMove])

	React.useEffect(() => {
		window.addEventListener('mouseup', mouseUp)

		return () => {
			window.removeEventListener('mouseup', mouseUp)
		}
	}, [mouseUp])

	return (
		<SVG
			className={className}
			lineWidth={lineWidth}
			ref={svgRef}
			viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
		>
			<path
				d={getRangeLine(handleRadius, lineWidth)}
				fill="transparent"
				stroke="lightgray"
				strokeWidth={lineWidth}
			/>
			<g
				className="current-range-line"
			>
				<path
					stroke={spotColor}
					strokeWidth={barWidth}
					d={getCurrentRangeLine(handleRadius, lineWidth, limits)}
					onMouseDown={mouseDown}
					data-handle={DragElement.Bar}
				/>
				{
					handleOrder.map(handle => 
						<Handle
							dragElement={handle}
							key={handle}
							strokeWidth={lineWidth}
							onMouseDown={mouseDown}
							percentage={handle === DragElement.LowerLimit
								? limits.lower
								: limits.upper
							}
							radius={handleRadius}
						/>
					)
				}
			</g>
		</SVG>
	)
}

function getPositionForLimit(
	pageX: number,
	limits: Limits,
	activeElement: DragElement,
	rect: DOMRect,
): Partial<Limits> | undefined {
	if (rect == null) return undefined

	if (rect.width > 0) {
		let percentage = (pageX - rect.left) / rect.width;
		if (percentage > 1) {
			percentage = 1
		} else if (percentage < 0) {
			percentage = 0
		}
		const center = (limits.upper + limits.lower) / 2

		if (activeElement === DragElement.Bar) {
			let lowerLimit = percentage + limits.lower - center
			let upperLimit = percentage - (center - limits.upper)
			if (upperLimit >= 1) upperLimit = 1
			if (lowerLimit <= 0) lowerLimit = 0
			return { lower: lowerLimit, upper: upperLimit }
		} else if (activeElement === DragElement.LowerLimit) {
			if (percentage >= limits.upper) percentage = limits.upper
			return { lower: percentage }
		} else if (activeElement === DragElement.UpperLimit) {
			if (percentage <= limits.lower) percentage = limits.lower
			return { upper: percentage }
		}
	}

	return undefined
}

function getRangeLine(radius: number, lineWidth: number) {
	const strokeWidth = lineWidth / 2
	const startX = radius + strokeWidth
	const endX = VIEW_BOX_WIDTH + radius + strokeWidth
	const y = radius + strokeWidth
	return `M${startX} ${y} L ${endX} ${y} Z`
}

function getCurrentRangeLine(radius: number, lineWidth: number, limits: Limits) {
	const strokeWidth = lineWidth / 2
	const startX = radius + strokeWidth + Math.floor(limits.lower * VIEW_BOX_WIDTH)
	const endX = radius + strokeWidth + Math.ceil(limits.upper * VIEW_BOX_WIDTH)
	const y = radius + strokeWidth
	return `M${startX} ${y} L ${endX} ${y} Z`
}

function getClosestNumber(list: number[], value: number) {
	return list.reduce((prev, curr) => {
		return Math.abs(curr - value) < Math.abs(prev - value)
			? curr
			: prev
	}
	)
}
