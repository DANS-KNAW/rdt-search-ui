import React from "react"
import { Colors } from "../../common/enum"
import { ResultBodyProps, SortOrder } from "../../common/types/search"
import { UITexts, uiTexts } from "./ui-texts"
import { SearchState } from "../state"

export interface DashboardProps {
	rows?: number
	columns?: number

	/* 
	 * Define grid areas in the config to use the grid area layout.
	 * The areas depend on user defined facet IDs. If dashboard.areas
	 * is defined, the facet container will have grid-area: facet.ID in the
	 * style tag.
	 * 
	 * TODO all the facets should be defined in the area, otherwise it messes
	 * up the layout. Maybe we should add a default area for facets that are
	 * not defined in the areas array.
	 */
	areas?: string[]
}

export interface UserSearchProps {
	/* Required */
	ResultBodyComponent: React.FC<ResultBodyProps>
	url: string
	children: React.ReactNode

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
	onActiveFiltersChange?: (activeFilters: SearchState['facetFilters'], query: string) => void
}

// export type FacetConfigs = Map<string, FacetConfig>

// Redefine the UserSearchProps to make some props required,
// except for the SearchHomeComponent and className props
export type SearchProps = Required<Omit<UserSearchProps, 'children' | 'facetsConfig' | 'SearchHomeComponent' | 'className' | 'dashboard' | 'onActiveFiltersChange'>> & {
	// Optional props
	className?: UserSearchProps['className']
	dashboard?: UserSearchProps['dashboard']
	SearchHomeComponent?: UserSearchProps['SearchHomeComponent']
	onActiveFiltersChange?: UserSearchProps['onActiveFiltersChange']
}

export const defaultSearchProps: SearchProps = {
	/**
	 * These defaults will never be used, because these props are required and
	 * therefor always overriden by the user props
	 */
	ResultBodyComponent: () => null,
	url: '',
	// facets: [],
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
