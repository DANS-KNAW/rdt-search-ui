import React from "react"
import { Colors } from "../../common/enum"
import { FacetConfig, ResultBodyProps, SortOrder } from "../../common/types/search"
import { UITexts, uiTexts } from "./ui-texts"
import { Facet } from "../../facets"

export interface UserSearchProps {
	ResultBodyComponent: React.FC<ResultBodyProps>
	url: string
	facets: Facet<any, any>[]

	autoSuggest?: (query: string) => Promise<string[]>
	className?: string /* className prop is used by StyledComponents */
	excludeResultFields?: string[]
	onClickResult?: (result: any, ev: React.MouseEvent<HTMLLIElement>) => void
	resultFields?: string[]
	resultBodyProps?: Record<string, any>
	resultsPerPage?: number
	SearchHomeComponent?: React.FC<any>
	track_total_hits?: number | boolean
	sortOrder?: SortOrder
	style?: {
		spotColor: string
	}
	uiTexts?: UITexts
}

export type FacetConfigs = Map<string, FacetConfig>

// Redefine the UserSearchProps to make some props required,
// except for the SearchHomeComponent and className props
export type SearchProps = Required<Omit<UserSearchProps, 'facetsConfig' | 'SearchHomeComponent' | 'className'>> & {
	// The facetsConfig array is converted to a Map, with the facet field + array index as key
	// TODO change to facetConfigs
	facets: Facet<any, any>[]

	// Optional props
	SearchHomeComponent?: React.FC<any>
	className?: string
}

export const defaultSearchProps: SearchProps = {
	ResultBodyComponent: () => null,
	url: '',
	facets: [],

	autoSuggest: async function autoSuggest(query: string) {
		console.log('[RDT-SEARCH-UI] autoSuggest:', query)
		return []
	},
	excludeResultFields: [],
	onClickResult: result => {
		console.log('[RDT-SEARCH-UI] onClickResult:', result)
	},
	resultBodyProps: {},
	resultFields: [],
	resultsPerPage: 20,
	sortOrder: new Map(),
	style: {
		spotColor: Colors.BlueBright
	},
	track_total_hits: true,
	uiTexts: uiTexts
}

export const SearchPropsContext =  React.createContext<SearchProps>(defaultSearchProps)
