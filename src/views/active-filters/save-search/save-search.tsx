import React from "react"
import styled from "styled-components"
import md5 from 'md5'
import { DropDown } from "../../ui/drop-down"
import { SearchProps, SearchPropsContext } from "../../../context/props"
import { Button } from "../../ui/button"
import { SearchState } from "../../../context/state"
import { serializeObject, useSavedSearches } from './use-saved-searches'

export interface SearchFilters {
	filters: SearchState['facetFilters']
	query: string
}

export function SaveSearch(props: {
	url: SearchProps['url']
	activeFilters: SearchFilters
}) {
	const [savedSearches, saveSearch] = useSavedSearches(props.url)
	const hash = useHash(props.activeFilters)

	const savedSearch = savedSearches.find(ss => ss.hash === hash)

	if (savedSearch) {
		return (
			<div style={{ lineHeight: '36px'}}>
				<em style={{ marginTop: '1rem' }}>Saved as "{savedSearch.name || savedSearch.hash}"</em>
			</div>
		)
	}

	return (
		<DropDown
			label="Save search"
			right
			z={10000}
		>
			<SavedSearches
				activeFilters={props.activeFilters}
				hash={hash}
				savedSearches={savedSearches}
				saveSearch={saveSearch}
			/>
		</DropDown>
	)
}

const Wrapper = styled.div`
	min-width: 400px;

	.input-wrapper {
		display: grid;
		grid-template-columns: 360px fit-content(0);
		grid-gap: 1rem;
		margin: 1rem 0 2rem 0;

		input {
			font-size: 1rem;
			padding: .1rem .25rem;
		}
	}
`

const SavedSearches = (props: {
	activeFilters: SearchFilters
	hash: string | undefined
	savedSearches: ReturnType<typeof useSavedSearches>[0]
	saveSearch: ReturnType<typeof useSavedSearches>[1]
}) => {
	const { style } = React.useContext(SearchPropsContext)
	const [name, setName] = React.useState<string>()

	const save = React.useCallback(async () => {
		if (props.hash == null) return

		props.saveSearch({
			name,
			hash: props.hash,
			date: new Date().toUTCString(),
			...props.activeFilters
		})
	}, [name, props.hash, props.activeFilters])

	if (props.hash == null) return null

	return (
		<Wrapper>
			<h3>Search name</h3>
			<div className="input-wrapper">
				<input
					type="text"
					value={name || ''}
					placeholder={props.hash}
					onChange={ev => setName(ev.currentTarget.value)}
					onKeyDown={ev => {
						if (ev.key === 'Enter') save()
					}}
				/>
				<Button onClick={save} spotColor={style.spotColor}>Save</Button>
			</div>	
		</Wrapper>
	)
}

function useHash(activeFilters: SearchFilters | undefined) {
	const [hash, setHash] = React.useState<string>()

	React.useEffect(() => {
		if (activeFilters == null) return
		const activeFilterString = serializeObject(activeFilters)
		const hash = md5(activeFilterString)
		setHash(hash)
	}, [activeFilters])

	return hash

}