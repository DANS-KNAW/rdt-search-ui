import type { ElasticSearchResponse } from "../common/types/search"
import type { BaseFacetConfig, BaseFacetState, FacetFilter } from "../common/types/search/facets"
import type { Bucket } from "../context/state/use-search/response-with-facets-parser"
import { FacetType } from "../common/enum"
import { SearchState } from "../context/state"
import { FacetsDataReducerAction } from "../context/state/actions"

export abstract class FacetController<
	FacetConfig extends BaseFacetConfig,
	FacetState extends BaseFacetState,
	Filter extends FacetFilter
> extends EventTarget {
	ID: string
	config: FacetConfig

	abstract type: FacetType

	constructor(initialConfig: FacetConfig) {
		super()

		this.ID = initialConfig.id
			? initialConfig.id
			: `${initialConfig.field}-${Math.random().toString().slice(2, 8)}`
		// TODO move config to state or props?
		this.config = this.initConfig(initialConfig)
	}

	abstract formatFilter(filter: Filter): string[]
	abstract createAggregation(postFilters: any, filter: Filter, state: FacetState): any

	// Create a post filter, which is used by ES to filter the search results
	// If there is no filter, return undefined
	abstract createPostFilter(filter: Filter): any

    abstract reducer(state: SearchState, action: FacetsDataReducerAction): SearchState

	abstract responseParser(buckets: Bucket[], response: ElasticSearchResponse): any

	protected abstract initConfig(config: FacetConfig): FacetConfig
	abstract initState(): FacetState


	updateFacetState(nextFacetState: FacetState, state: SearchState) {
		const facetStates = new Map(state.facetStates)
		facetStates.set(this.ID, nextFacetState)

		return {
			...state,
			facetStates
		}
	}

	updateFacetFilter(filter: Filter | undefined, state: SearchState) {
		const facetFilters = new Map(state.facetFilters)	

		if (filter == null) {
			facetFilters.delete(this.ID)
		} else {
			facetFilters.set(this.ID, {
				title: this.config.title || '',
				value: filter,
				formatted: this.formatFilter(filter)
			})
		}

		return {
			...state,
			facetFilters
		}
	}
}