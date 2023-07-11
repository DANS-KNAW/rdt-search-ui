import React from 'react'
import { EsDataType, SortBy, SortDirection, FacetType, Colors } from './common'
import { SearchStateContext } from './context/state'

import { useSearchStateReducer } from './context/state/reducer'
import App from './app'

import type { ResultBodyProps } from './common'
import { SearchProps, SearchPropsContext, UserSearchProps, defaultSearchProps } from './context/props'
import { Label } from './views/ui/label'
import type { FacetConfigs } from './context/props'
import { DropDown } from './views/ui/drop-down'

export * from './date.utils'
export {
	EsDataType,
	SearchStateContext,
	SortBy,
	SortDirection,
	useSearchStateReducer,
	Label,
	FacetType,
	DropDown,
	Colors
}
export type {
	FacetConfigs,
}

export type {
	ResultBodyProps
}

export function FacetedSearch(props: UserSearchProps) {
	const [searchProps, setSearchProps] = React.useState<SearchProps | undefined>(undefined)

	React.useEffect(() => {
		const sp: SearchProps = {
			...defaultSearchProps,
			...props,
		}

		setSearchProps(sp)
	}, [props])

	return (
		// <React.StrictMode>
			<SearchPropsContext.Provider value={searchProps || defaultSearchProps}>
				{
					searchProps &&
					<AppLoader {...searchProps} />
				}
			</SearchPropsContext.Provider>
		// </React.StrictMode>
	)
}

function AppLoader(props: SearchProps) {
	const value = useSearchStateReducer(props)

	return (
		<SearchStateContext.Provider value={value}>
			<App searchProps={props} searchState={value.state} />
		</SearchStateContext.Provider>
	)
}

// function compareProps(prevProps: any, nextProps: any) {
// 	console.log('COMPAREING')
// 	Object.keys(prevProps).forEach(key => {
// 		const isSame = prevProps[key] === nextProps[key]
// 		console.log(`${key}\t\t${isSame}`, isSame ? '' : `${prevProps[key]} __ ${nextProps[key]}`)
// 	})
// 	console.log('=-=-=-=-=-=-=-=')
// 	return false
// }
