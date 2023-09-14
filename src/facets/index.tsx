import React, { Children, isValidElement } from 'react'
import { FacetType } from "../common/enum";
import type { ActiveFilter, ElasticSearchResponse } from "../common/types/search";
import type { BaseFacetConfig, BaseFacetState } from "../common/types/search/facets";
import type { Bucket } from "../context/state/use-search/response-with-facets-parser";
import { SearchProps } from '../context/props';
import { SearchState } from '../context/state';
import clsx from 'clsx';

export abstract class FacetController<FacetConfig extends BaseFacetConfig, FacetState extends BaseFacetState> extends EventTarget {
	ID: string
	config: FacetConfig
	readonly initialState: FacetState
	protected state: FacetState

	abstract type: FacetType
	abstract actions: {
		toggleCollapse: () => void
		removeFilter: (key: string) => void
		[key: string]: (payload: any) => void
	}

	constructor(initialConfig: FacetConfig, initialState?: FacetState) {
		super()

		this.ID = initialConfig.id
			? initialConfig.id
			: `${initialConfig.field}-${Math.random().toString().slice(2, 8)}`
		this.config = this.initConfig(initialConfig)
		this.initialState = initialState || this.initState()
		this.state = { ...this.initialState }
	}

	abstract activeFilter(): ActiveFilter | undefined
	abstract createAggregation(postFilters: any): any

	// Create a post filter, which is used by ES to filter the search results
	// If there is no filter, return undefined
	abstract createPostFilter(): any

	abstract reset(): void
	abstract responseParser(buckets: Bucket[], response: ElasticSearchResponse): any

	protected abstract initConfig(config: FacetConfig): FacetConfig
	protected abstract initState(): FacetState
}

interface Props {
	facetClassname?: string
	children: React.ReactNode
	searchProps: SearchProps
	searchState: SearchState
}

export const Facets = ({ children, facetClassname, searchProps, searchState }: Props) => {
	if (searchState.facetStates.size === 0) return null

	return (
		<div id="facets">
			{
				Children
					.map(children, (child, index) => {
						if (!isValidElement(child)) return
						const facet = searchProps.facets[index]

						return (
							<div
								className={clsx('facet-container', facetClassname )}
								key={facet.ID}
								style={{
									gridArea: searchProps.dashboard?.areas != null
										? facet.ID
										: undefined
								}}
							>
								<child.type
									facet={facet}
									facetState={searchState.facetStates.get(facet.ID)!}
									values={searchState.facetValues[facet.ID]}
								/>
							</div>
						)
					})
			}
		</div>
	)
}