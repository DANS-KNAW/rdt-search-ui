import React from "react"
import { DropDown } from "../../ui/drop-down"
import { SearchProps } from "../../../context/props"
import { SearchStateDispatchContext } from "../../../context/state"
import { SavedSearch, useSavedSearches } from "./use-saved-searches"
import styles from './load-search.module.css'

const dropdownStyle = { zIndex: 2 }

export function LoadSearch(props: {
	url: SearchProps['url']
}) {
	const [savedSearches] = useSavedSearches(props.url)

	if (savedSearches.length === 0) return null

	return (
		<DropDown
			caret
			label="Load search"
			style={dropdownStyle}
		>
			<LoadSearches
				savedSearches={savedSearches}
			/>
		</DropDown>
	)
}

const LoadSearches = (props: {
	savedSearches: SavedSearch[]
}) => {
	const dispatch = React.useContext(SearchStateDispatchContext)

	return (
		<div className={styles.loadSearch}>
			<ul className={styles.list}>
				{
					props.savedSearches.map((savedSearch, index) => (
						<li
							className={styles.item}
							key={savedSearch.hash}
							onClick={() => {
								dispatch({
									type: 'LOAD_SEARCH',
									filters: savedSearch.filters,
									query: savedSearch.query
								})
							}}
						>
							<div>{savedSearch.name || savedSearch.hash}</div>
							<div>{dateString(savedSearch.date)}</div>
						</li>
					))
				}
			</ul>
		</div>
	)
}

// Show date without time
function dateString(date: string) {
	return date.slice(0, (/\d\d\d\d/.exec(date)?.index || 0) + 4)
}
