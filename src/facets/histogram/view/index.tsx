import type { HistogramFacetConfig, HistogramFacetState, HistogramFacetValue } from '../state'
import type { Facet } from '../..'

import React from 'react'
import styled from 'styled-components'

import FacetWrapper from '../../../facets/wrapper'
import { Histogram } from './histogram'
import { RangeSlider } from './slider'
import { rangeToFacetValue } from '..'

const BodyWrapper = styled.div`
	.slider {
		margin-top: 1rem;
	}

	.limits {
		display: grid;
		grid-template-columns: 1fr 1fr;
		color: #888;
		font-size: .8em;

		& > div:last-child {
			justify-self: end;
		}
	}



`

export interface HistogramFacetProps {
	facet: Facet<HistogramFacetConfig, HistogramFacetState>
	facetState: HistogramFacetState
	values: HistogramFacetValue[]
}
export function HistogramFacetView(props: HistogramFacetProps) {
	if (props.values == null) return null

	// let steps: number | undefined
	// if (props.facetState.value?.from != null && props.facetState.value?.to != null) { 
	// 	steps = props.facetState.value.to - props.facetState.value.from + 1
	// }

	// if (steps == null) return null
	if (props.facetState.initialValues == null) return null

	return (
		<FacetWrapper
			{...props}
			// @ts-ignore
			// Options={RangeOptions}
		>
			{
				Array.isArray(props.values) &&
				<BodyWrapper>
					<Histogram
						{...props}
					/>
					<RangeSlider
						className="slider"
						onChange={(state) => {
							const values = props.facetState.initialValues!

							const lowerIndex = (values.length - 1) * state.limits.lower
							const upperIndex = (values.length - 1) * state.limits.upper

							const lowerValue = values[lowerIndex]
							const upperValue = values[upperIndex]

							console.log(lowerIndex, upperIndex)
							console.log(lowerValue, upperValue)

							props.facet.actions.setFilter({
								from: lowerValue.from,
								to: upperValue.to,
								fromLabel: lowerValue.fromLabel,
								toLabel: upperValue.toLabel,
								count: 0
							})
						}}
						spotColor="#0088cc"
						steps={props.facetState.initialValues!.length}
					/>
					<div className="limits">
						<div>{props.facetState.value?.fromLabel}</div>
						<div>{props.facetState.value?.toLabel}</div>
					</div>
				</BodyWrapper>
			}
		</FacetWrapper>
	)
}
