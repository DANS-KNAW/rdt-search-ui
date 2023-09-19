import React from "react"
import styled from "styled-components"
import md5 from 'md5'
import { DropDown } from "../../ui/drop-down"
import { SearchProps, SearchPropsContext } from "../../../context/props"
import { Button } from "../../ui/button"
import { SearchStateContext } from "../../../context/state"

export interface ActiveFilters {
	filters: any
	query: string
}

interface SavedSearch extends ActiveFilters {
	name: string | undefined
	hash: string
	date: string // UTC string
}

export function SaveSearch(props: {
	url: SearchProps['url']
	activeFilters: ActiveFilters
	loadSearchState: (state: any) => void
}) {
	return (
		<DropDown
			label="Save search"
			right
			z={10000}
		>
			<SavedSearches
				activeFilters={props.activeFilters}
				loadSearchState={props.loadSearchState}
				url={props.url}
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

	ul {
		list-style: none;
		padding: 0;
		margin: 0;
		
		li {
			margin-bottom: .3rem;

			button {
				background: none;
				border: none;
				color: rgb(0, 136, 204);
				cursor: pointer;

				&:hover {
					text-decoration: underline;
				}
			}
		}
	}	

	.saved-search__item button {
		display: grid;
		grid-template-columns: 1fr fit-content(0);
		width: 100%;

		& > div {
			text-align: left;
		}

		& > div:last-of-type {
			white-space: nowrap;
		}
	}
`

const SavedSearches = (props: {
	url: SearchProps['url']
	activeFilters: ActiveFilters
	loadSearchState: (state: any) => void
}) => {
	const { style } = React.useContext(SearchPropsContext)
	const { dispatch } = React.useContext(SearchStateContext)
	const [hash, setHash] = React.useState<string | null>(null)
	const [name, setName] = React.useState<string>()
	const [savedSearches, setSavedSearches] = React.useState<SavedSearch[]>([])

	const storageKey = `rdt-search__ss__${props.url}`

	React.useEffect(() => {
		const _savedSearches = localStorage.getItem(storageKey)
		if (_savedSearches == null) return
		setSavedSearches(deserializeObject(_savedSearches))
	}, [props.url])

	React.useEffect(() => {
		if (props.activeFilters == null) return
		const activeFilterString = serializeObject(props.activeFilters)
		getHash(activeFilterString).then(hash => {
			setHash(hash)
			setName(undefined)
		})
	}, [props.activeFilters])

	const save = React.useCallback(async () => {
		if (hash == null) return

		savedSearches.unshift({
			name,
			hash,
			date: new Date().toUTCString(),
			...props.activeFilters
		})

		localStorage.setItem(storageKey, serializeObject(savedSearches))

		setSavedSearches([...savedSearches])
	}, [name, hash, savedSearches, props.activeFilters])

	if (hash == null) return null

	const savedSearch = savedSearches.find(ss => ss.hash === hash)

	return (
		<Wrapper>
			{
				savedSearch != null
					? <em style={{ marginTop: '1rem' }}>Search has been saved as "{savedSearch.name || savedSearch.hash}" on {dateString(savedSearch.date)}</em>
					: <>
						<h3>Search name</h3>
						<div className="input-wrapper">
							<input
								type="text"
								value={name || ''}
								placeholder={hash}
								onChange={ev => setName(ev.currentTarget.value)}
							/>
							<Button onClick={save} spotColor={style.spotColor}>Save</Button>
						</div>	
					</>
			}
			{
				savedSearches.length > 0 &&
				<>
				<h3>Saved searches</h3>
				<ul>
					{
						savedSearches.map((savedSearch, index) => (
							<li
								className="saved-search__item"
								key={savedSearch.hash}
							>
								<Button
									className=""
									onClick={() => {
										console.log(savedSearch)
										props.loadSearchState(savedSearch)
										dispatch({
											type: 'LOAD_SEARCH',
											filters: savedSearch.filters,
											query: savedSearch.query
										})
									}}
									spotColor={style.spotColor}
								>
									<div>{savedSearch.name || savedSearch.hash}</div>
									<div>{dateString(savedSearch.date)}</div>
								</Button>
							</li>
						))
					}
				</ul>
				</>
			}
		</Wrapper>
	)
}

// Show date without time
function dateString(date: string) {
	return date.slice(0, (/\d\d\d\d/.exec(date)?.index || 0) + 4)
}



async function getHash(data: string) {
	// const ab = (await crypto.subtle.digest('SHA-1', new TextEncoder().encode(data)))
	// return Array.from(new Uint8Array(ab)).map(b => b.toString(16).padStart(2, "0")).join('')
	return md5(data)
}

function replacer(_key: string, value: any) {
	if (value instanceof Map) {
		return {
			dataType: 'Map',
			value: [...value]
		}
	}

	if (value instanceof Set) {
		return {
			dataType: 'Set',
			value: [...value]
		}
	}

	return value
}

function reviver(_key: string, value: any) {
	if(typeof value === 'object' && value !== null) {
		if (value.dataType === 'Map') {
			return new Map(value.value)
		}

		if (value.dataType === 'Set') {
			return new Set(value.value)
		}
	}

	return value
}

function serializeObject(object: any) {
	return JSON.stringify(object, replacer)
}

function deserializeObject(filters: string) {
	return JSON.parse(filters, reviver)
}