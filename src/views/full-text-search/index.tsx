import React from 'react'
import styled, { css } from 'styled-components'
import debounce from 'lodash.debounce'
import { AutoSuggest } from './auto-suggest'
import { InputWrapper } from './input'
import { SearchPropsContext } from '../../context/props'
import { SearchStateContext, SearchStateDispatchContext } from '../../context/state'

// Same as ../header
export const headerStyle = css`
	background: var(--rdt-background);
	border-bottom: 1px solid #CCC;
	box-sizing: border-box;
	box-shadow: 0 1.5rem 1.5rem var(--rdt-background);
	color: #888;
	font-size: .85em;
`

export * from './input'

export const Wrapper = styled.div`
	${headerStyle}

	#loader {
		background: linear-gradient(to right, white 0%, #AAA 80%, white 100%);
		grid-column: 1 / span 2;
		height: 3px;
		position: absolute;
		width: 0;
	}
`

let loaderIntervalID: number
let loaderIntervalProgress = 0
function showLoader(loaderRef: any) {
	clearInterval(loaderIntervalID)
	loaderIntervalProgress = 0
	loaderIntervalID = window.setInterval(() => {
		loaderIntervalProgress += 25
		const perc = loaderIntervalProgress / 1050
		loaderRef.current.style.width = `${perc * 100}%`
	}, 25)
}

function hideLoader(loaderRef: any) {
	clearInterval(loaderIntervalID)
	loaderIntervalProgress = 0
	loaderRef.current.style.width = '0'
}

export function FullTextSearch() {
	const { autoSuggest } = React.useContext(SearchPropsContext)
	const state = React.useContext(SearchStateContext)
	const dispatch = React.useContext(SearchStateDispatchContext)
	const loaderRef = React.useRef<HTMLDivElement>(null)
	const [suggestActive, setSuggestActive] = React.useState(false)
	const [inputValue, setInputValue] = React.useState('')
	const setQuery = debounce(
		(value: string) => {
			dispatch({ type: 'SET_QUERY', value })
			hideLoader(loaderRef)
		},
		1000
	)
	const handleInputChange = React.useCallback(
		(ev: React.ChangeEvent<HTMLInputElement>) => {
			setSuggestActive(autoSuggest != null) // Set suggestActive state only to true if props.autoSuggest exists
			setInputValue(ev.target.value)
			setQuery(ev.target.value)
			showLoader(loaderRef)
		},
		[]
	)

	React.useEffect(() => {
		if (state.query !== inputValue) setInputValue(state.query) 
	}, [state.query])

	return (
		<Wrapper
			id="rdt-search__full-text"
		>
			<InputWrapper
				handleInputChange={handleInputChange}
				inputValue={inputValue}
				setSuggestActive={setSuggestActive}
			/>
			{
				suggestActive &&
				<AutoSuggest
					autoSuggest={autoSuggest}
					onClick={query => {
						setInputValue(query)
						setQuery(query)
					}}
					value={inputValue}
				/>	
			}
			<div id="loader" ref={loaderRef} />
		</Wrapper>
	)
}
