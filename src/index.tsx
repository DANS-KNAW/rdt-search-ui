import React, { Children, isValidElement } from 'react'
import { EsDataType, SortBy, SortDirection, FacetType, Colors } from './common'
import { SearchStateContext } from './context/state'

import { useSearchStateReducer } from './context/state/reducer'
import App from './app'
import { Dashboard } from './dashboard'

import type { ResultBodyProps } from './common'
import { SearchProps, SearchPropsContext, UserSearchProps, defaultSearchProps } from './context/props'
import { Label } from './views/ui/label'
import type { DashboardProps, FacetConfigs } from './context/props'
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
	DashboardProps,
	FacetConfigs,
	ResultBodyProps
}

export default FacetedSearch


export function FacetedSearch(props: UserSearchProps) {
	const [children, setChildren] = React.useState<React.ReactNode>(props.children)
	const [searchProps, setSearchProps] = React.useState<SearchProps | undefined>(undefined)

	React.useEffect(() => {
		if (props.children == null) return

		const children = isValidElement(props.children) && props.children.type.toString() === Symbol.for('react.fragment').toString()
			? props.children.props.children
			: props.children

		const facets = Children.map(children, child => {
			return new child.type.controller(child.props.config)
		}) as any

		const sp: SearchProps = {
			...defaultSearchProps,
			...props,
			facets
		}

		setSearchProps(sp)
		setChildren(children)
	}, [props])

	if (searchProps == null) return

	return (
		// <React.StrictMode>
			<SearchPropsContext.Provider value={searchProps}>
				<AppLoader searchProps={searchProps} >{children}</AppLoader>
			</SearchPropsContext.Provider>
		// </React.StrictMode>
	)
}

function AppLoader(props: { children: React.ReactNode, searchProps: SearchProps }) {
	const value = useSearchStateReducer(props.searchProps)

	const Component = props.searchProps.dashboard ? Dashboard : App

	return (
		<SearchStateContext.Provider value={value}>
			<Component
				searchProps={props.searchProps}
				searchState={value.state}
			>
				{props.children}
			</Component>
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
