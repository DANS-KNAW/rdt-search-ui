import React from "react"
import styled from "styled-components"
import { DropDown } from "../../../ui/drop-down"
import { SearchProps, SearchPropsContext } from "../../../../context/props"
import { Button } from "../../../ui/button"
import { SearchStateDispatchContext } from "../../../../context/state"
import { SavedSearch, useSavedSearches } from "./use-saved-searches"

export function LoadSearch(props: {
	url: SearchProps['url']
}) {
	const [savedSearches] = useSavedSearches(props.url)

	if (savedSearches.length === 0) return null

	return (
		<DropDown
			label="Load search"
			z={10000}
		>
			<LoadSearches
				savedSearches={savedSearches}
			/>
		</DropDown>
	)
}

const Wrapper = styled.div`
	min-width: 400px;

	ul.load-search {
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

	li.load-search__item button {
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

const LoadSearches = (props: {
	savedSearches: SavedSearch[]
}) => {
	const { style } = React.useContext(SearchPropsContext)
	const dispatch = React.useContext(SearchStateDispatchContext)

	return (
		<Wrapper className="load-search">
			<h3>Load saved searches</h3>
			<ul className="load-search__items">
				{
					props.savedSearches.map((savedSearch, index) => (
						<li
							className="load-search__item"
							key={savedSearch.hash}
						>
							<Button
								className=""
								onClick={() => {
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
		</Wrapper>
	)
}

// Show date without time
function dateString(date: string) {
	return date.slice(0, (/\d\d\d\d/.exec(date)?.index || 0) + 4)
}
