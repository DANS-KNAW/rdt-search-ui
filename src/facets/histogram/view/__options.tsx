import React from 'react'
import styled from 'styled-components'
import { OptionsWrapper } from '../../list/view/options'
import { HistogramFacetState } from '../state'
import { SearchPropsContext } from '../../../context/props'
import { SearchStateContext } from '../../../context/state'
import { rangeToFacetValue } from '../response'

// Convert a timestamp to a <input type="date" /> value: yyyy-mm-dd
// function timestampToDateInputValue(timestamp: number) {
// 	const isoDate = new Date(timestamp).toISOString()
// 	return isoDate.slice(0, isoDate.indexOf('T'))
// }

const Fieldset = styled.fieldset`
	background: white;
	padding: 1rem;

	legend {
		color: #222;
		padding: 0 .33rem;
	}

	label {
		font-size: .8rem;
	}

	& > div {
		display: grid;
		grid-template-columns: 60px auto;
		grid-template-rows: 1fr 1fr;
		grid-row-gap: 1rem;
	}
`
interface Props {
	facetID: string
	facetState: HistogramFacetState
}
export default function RangeOptions(props: Props) {
	const { dispatch } = React.useContext(SearchStateContext)
	const { style, uiTexts } = React.useContext(SearchPropsContext)

	// There can be multpiple range facets. To get a unique ID, prefix it with the facet ID
	const idPrefix = `${props.facetID}_range_`

	const from = props.facetState.filter?.length ?
		props.facetState.filter[props.facetState.filter.length - 1].from :
		props.facetState.value?.from

	const to = props.facetState.filter?.length ?
		props.facetState.filter[props.facetState.filter.length - 1].to :
		props.facetState.value?.to

	const [minValueState, setMinValueState] = React.useState(from)
	const [maxValueState, setMaxValueState] = React.useState(to)

	// const isDateFacet = isDateFacetData(props.facetData)
	// const minInputValue = isDateFacet ? timestampToDateInputValue(from) : from
	// const maxInputValue = isDateFacet ? timestampToDateInputValue(to) : to
	// const fromInputValue = isDateFacet ? timestampToDateInputValue(minValueState) : minValueState
	// const toInputValue = isDateFacet ? timestampToDateInputValue(maxValueState) : maxValueState
	const minInputValue =  from
	const maxInputValue = to
	const fromInputValue = minValueState
	const toInputValue = maxValueState

	React.useEffect(() => {
		setMinValueState(from)
		setMaxValueState(to)
	}, [from, to])

	const handleInputBlur = React.useCallback(() => {
		console.log('TODO set range')
		// dispatch({
		// 	type: 'SET_FILTER',
		// 	facetId: props.facetID,
		// 	// value: isDateFacet ?
		// 	// 	dateRangeToFacetValue(minValueState, maxValueState) :
		// 	value: rangeToFacetValue(minValueState, maxValueState),
		//  })
	}, [minValueState, maxValueState])

	/**
	 * I don't know why the deps of handleInputBlur are needed here, but they are :).
	 * It has to do with an old ref to handleInputBlur, but this is confusing,
	 * because those deps aren't used directly in this callback 
	 */
	const handleInputKeyDown = React.useCallback((ev: React.KeyboardEvent) => {
		if (ev.keyCode === 13) handleInputBlur()
	}, [minValueState, maxValueState])

	const handleInputChange = React.useCallback((ev: React.ChangeEvent) => {
		const target = ev.target as HTMLInputElement
		const resetValue = !target.value.length

		if (target.id === `${idPrefix}from`) {
			if (resetValue) {
				setMinValueState(from)
				handleInputBlur()
			} else {
				setMinValueState(target.valueAsNumber)
			}
		} else {
			if (resetValue) {
				setMaxValueState(to)
				handleInputBlur()
			} else {
				setMaxValueState(target.valueAsNumber)
			}
		}
	}, [from, to])

	return (
		<OptionsWrapper color={style.spotColor}>
			<Fieldset>
				<legend>{uiTexts.set_range}</legend>
				<div>
					<label htmlFor={`${idPrefix}from`}>{uiTexts.range_from}</label>
					<input
						id={`${idPrefix}from`}
						max={maxInputValue}
						min={minInputValue}
						onBlur={handleInputBlur}
						onChange={handleInputChange}
						onKeyDown={handleInputKeyDown}
						// type={isDateFacet ? 'date' : 'number'}
						type="number"
						value={fromInputValue}
					/>
					<label htmlFor={`${idPrefix}to`}>{uiTexts.range_to}</label>
					<input
						id={`${idPrefix}to`}
						max={maxInputValue}
						min={minInputValue}
						onBlur={handleInputBlur}
						onChange={handleInputChange}
						onKeyDown={handleInputKeyDown}
						// type={isDateFacet ? 'date' : 'number'}
						type="number"
						value={toInputValue}
					/>
				</div>
			</Fieldset>
		</OptionsWrapper>
	)
}
