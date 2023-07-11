import React from 'react'
import styled from 'styled-components'
import debounce from 'lodash.debounce'
import { AutoSuggest } from './auto-suggest'
import { InputWrapper } from './input'
import { SearchPropsContext } from '../../context/props'
import { SearchStateContext } from '../../context/state'
import { headerStyle } from '../header'

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
	const searchContext = React.useContext(SearchStateContext)
	const loaderRef = React.useRef<HTMLDivElement>(null)
	const [suggestActive, setSuggestActive] = React.useState(false)
	const [inputValue, setInputValue] = React.useState('')
	const setQuery = debounce(
		(value: string) => {
			// props.setQuery(value)
			searchContext.dispatch({ type: 'SET_QUERY', value })
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
		if (searchContext.state.query !== inputValue) setInputValue(searchContext.state.query) 
	}, [searchContext.state.query])

	return (
		<Wrapper id="rdt-search__full-text">
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
