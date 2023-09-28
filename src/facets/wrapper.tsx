import type { BaseFacetConfig, BaseFacetState, FacetFilter } from '../common'

import React from 'react'
import clsx from 'clsx'

import { FacetController } from './controller'
import { FacetsDataReducerAction } from '../context/state/actions'

import { HelpDropDown } from '../views/ui/drop-down/help'
import { SearchPropsContext } from '../context/props'

import styles from './wrapper.module.css'

interface Props<
	FacetConfig extends BaseFacetConfig,
	FacetState extends BaseFacetState,
	Filter extends FacetFilter
> {
	children: React.ReactNode
	dispatch: React.Dispatch<FacetsDataReducerAction>
	facet: FacetController<FacetConfig, FacetState, Filter>
	facetState: FacetState
	filter: Filter
	values: any
	className?: string
}
function FacetWrapper<
	FacetConfig extends BaseFacetConfig,
	FacetState extends BaseFacetState,
	Filter extends FacetFilter
>(props: Props<FacetConfig, FacetState, Filter>) {
	return (
		<div
			className={clsx(
				styles.wrapper, 
				{
					[styles.stateCollapsed]: props.facetState.collapse,
				},
				props.className
			)}
		>
			<header className={styles.header}>
				<h3
					className={styles.h3}
					onClick={() => {
						props.dispatch({
							type: "TOGGLE_COLLAPSE",
							facetID: props.facet.ID,
						})
					}}
				>
					{props.facet.config.title}
					{
						props.facetState.collapse &&
						<ActiveIndicator<Filter> filter={props.filter} />
					}
				</h3>
				<HelpDropDown className={styles.helpDropDown}>
					{props.facet.config.description}
				</HelpDropDown>
			</header>
			<div className={styles.body}>
				{props.children}
			</div>
		</div>
	)
}

export default React.memo(FacetWrapper)

// TODO handle different kinds of filters (like MapFacetFilter)
function ActiveIndicator<FacetFilter>(props: { filter: FacetFilter | undefined }) {
	const { uiTexts } = React.useContext(SearchPropsContext)

	if (props.filter == null) return null
	const size = props.filter != null ? 1 : 0

	if (size === 0) return null

	return (
		<small>
			{size} {uiTexts.active}
		</small>
	)
}