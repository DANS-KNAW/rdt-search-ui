import type { DashboardProps, StyleProps } from './context/props'
import type { FacetController } from './facets/controller'
import type { ResultBodyProps } from './context/state/use-search/types'

import React, { Children, isValidElement } from 'react'
import { SearchStateContext, SearchStateDispatchContext, intialSearchState } from './context/state'

import { searchStateReducer } from './context/state/reducer'
import App from './app'
import { Dashboard } from './dashboard'

// import type { ResultBodyProps } from './common'
import { FacetType, SortBy, SortDirection } from './enum'
import { SearchProps, SearchPropsContext, UserSearchProps, defaultSearchProps } from './context/props'
import { Label } from './views/ui/label'
import { DropDown } from './views/ui/drop-down'
import { FacetControllersContext, type FacetControllers } from './context/controllers'
import { useSearch } from './context/state/use-search'

import styles from './facets/wrapper.module.css'
styles

export * from './date.utils'
export {
	DropDown,
	FacetType,
	Label,
	SearchStateContext,
	SortBy,
	SortDirection,
}
export type {
	DashboardProps,
	ResultBodyProps,
	StyleProps,
	UserSearchProps
}

export default FacetedSearch


export function FacetedSearch(props: UserSearchProps) {
	const [children, setChildren] = React.useState<React.ReactNode>(undefined)
	const [searchProps, setSearchProps] = React.useState<SearchProps | undefined>(undefined)

	React.useEffect(() => {
		// Only set children once
		if (props.children == null || children != null) return

		const _children = (
			// Make sure it is an element and not a string, number, ...
			isValidElement(props.children) &&
			// If children is a fragment, get the children of the fragment
			props.children.type.toString() === Symbol.for('react.fragment').toString()
		)	
			? props.children.props.children
			: props.children

		setChildren(_children)
	}, [props.children])

	// After children have been set, set the search props.
	// Everytime the props change, the search props will be updated
	React.useEffect(() => {
		if (children == null) return

		// Extend the search props with default values
		const sp: SearchProps = {
			...defaultSearchProps,
			...props,
			style: {
				...defaultSearchProps.style,
				...props.style
			}
		}

		Object.keys(sp.style).forEach(key => {
			const value = (sp.style as any)[key]
			document.documentElement.style.setProperty(`--rdt-${camelCaseToKebabCase(key)}`, value);
		})

		setSearchProps(sp)
	}, [props, children])

	const controllers = useControllers(children)

	if (searchProps == null || controllers.size === 0) return

	return (
		// <React.StrictMode>
			<SearchPropsContext.Provider value={searchProps}>
				<AppLoader searchProps={searchProps} controllers={controllers}>{children}</AppLoader>
			</SearchPropsContext.Provider>
		// </React.StrictMode>
	)
}

interface AppLoaderProps {
	children: React.ReactNode
	controllers: FacetControllers
	searchProps: SearchProps
}

function AppLoader({ children, controllers, searchProps }: AppLoaderProps) {
	const [state, dispatch] = React.useReducer(searchStateReducer(controllers), intialSearchState)

	useSearch({
		props: searchProps,
		state,
		dispatch,
		controllers
	})

	const Component = searchProps.dashboard ? Dashboard : App

	React.useEffect(() => {
		if (!controllers.size) return
		const facetStates = new Map()
		for (const [id, controller] of controllers.entries()) {
			facetStates.set(id, controller.initState())
		}

		dispatch({
			type: 'SET_FACET_STATES',
			facetStates
		})
	}, [controllers])

	return (
		<FacetControllersContext.Provider value={controllers}>
			<SearchStateDispatchContext.Provider value={dispatch}>
				<SearchStateContext.Provider value={state}>
					<Component
						controllers={controllers}
						searchProps={searchProps}
						searchState={state}
					>
						{children}
					</Component>
				</SearchStateContext.Provider>
			</SearchStateDispatchContext.Provider>
		</FacetControllersContext.Provider>
	)
}

/**
 * Initializes and returns a map of facet controllers based on the `children` prop.
 */
function useControllers(children: React.ReactNode): FacetControllers {
	const [controllers, setControllers] = React.useState<FacetControllers>(new Map())

	React.useEffect(() => {
		if (children == null || controllers.size > 0) return

		// Initialise the facet controllers
		const facets = Children.map(children, (child: any) =>
			 new child.type.controller(child.props.config)
		)

		setControllers(new Map(facets.map((f: FacetController<any, any, any>) => [f.ID, f])))
	}, [children, controllers])

	return controllers
}

/**
 * Converts a string from camelCase to kebab-case.
 * @example camelCaseToKebabCase('camelCase') => 'camel-case'
 */
function camelCaseToKebabCase(str: string) {
	return str.replace(/([A-Z])/g, '-$1').toLowerCase()
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