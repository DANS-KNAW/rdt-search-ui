import React from "react"
import { Colors } from "../../common/enum"
import { FacetConfig, ResultBodyProps, SortOrder } from "../../common/types/search"
import { UITexts, uiTexts } from "./ui-texts"
import { FacetController } from "../../facets"

export interface DashboardProps {
	rows?: number
	columns?: number
	areas?: string[]
}

export interface UserSearchProps {
	/* Required */
	ResultBodyComponent: React.FC<ResultBodyProps>
	url: string
	children: React.ReactNode
	// facets: FacetController<any, any>[]

	/* Optional with defaults */
	autoSuggest?: (query: string) => Promise<string[]>
	excludeResultFields?: string[]
	onClickResult?: (result: any, ev: React.MouseEvent<HTMLLIElement>) => void
	resultFields?: string[]
	resultBodyProps?: Record<string, any>
	resultsPerPage?: number
	track_total_hits?: number | boolean
	sortOrder?: SortOrder
	style?: {
		spotColor: string
	}
	uiTexts?: UITexts

	/* Optional and can be undefined, see SearchProps */
	className?: string /* className prop is used by StyledComponents */
	dashboard?: DashboardProps 
	SearchHomeComponent?: React.FC<any>
}

export type FacetConfigs = Map<string, FacetConfig>

// Redefine the UserSearchProps to make some props required,
// except for the SearchHomeComponent and className props
export type SearchProps = Required<Omit<UserSearchProps, 'children' | 'facetsConfig' | 'SearchHomeComponent' | 'className' | 'dashboard'>> & {
	// The facetsConfig array is converted to a Map, with the facet field + array index as key
	// TODO change to facetConfigs
	facets: FacetController<any, any>[]

	// Optional props
	className?: string
	dashboard?: DashboardProps
	SearchHomeComponent?: React.FC<any>
}

export const defaultSearchProps: SearchProps = {
	/**
	 * These defaults will never be used, because these props are required and
	 * therefor always overriden by the user props
	 */
	ResultBodyComponent: () => null,
	url: '',
	facets: [],
	/* */

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
