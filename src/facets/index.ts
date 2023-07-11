import type { ActiveFilter, ElasticSearchResponse } from "../common/types/search";
import type { BaseFacetConfig, BaseFacetState } from "../common/types/search/facets";
import type { Bucket } from "../context/state/use-search/response-with-facets-parser";

export abstract class Facet<FacetConfig extends BaseFacetConfig, FacetState extends BaseFacetState> extends EventTarget {
	ID: string
	config: FacetConfig
	readonly initialState: FacetState
	protected state: FacetState

	abstract View: any
	abstract actions: {
		toggleCollapse: () => void
		removeFilter: (key: string) => void
		[key: string]: (payload: any) => void
	}

	constructor(initialConfig: FacetConfig, initialState?: FacetState) {
		super()

		this.ID = `${initialConfig.field}-${Math.random().toString().slice(2, 8)}`
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