import type { Bucket } from "../../context/state/use-search/response-with-facets-parser"
import type { MapFacetState, MapFacetConfig, MapFacetValue } from "./state"

import ngeohash from 'ngeohash'

import { addFilter } from "../../context/state/use-search/request-with-facets-creator"
import { MapFacetView } from "./view"
import { Facet } from ".."
import { EventName } from "../../constants"
import { ElasticSearchResponse, FacetType } from "../../common"

function capitalize(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1)
}

export class MapFacet extends Facet<MapFacetConfig, MapFacetState> {
	type = FacetType.Map
	View = MapFacetView

	actions = {
		toggleSearchOnZoom: () => {
			this.state.searchOnZoom = !this.state.searchOnZoom
			this.dispatchChange()
		},
		setFilter: (payload: MapFacetState['filter']) => {
			// Only update the filter when it has changed,
			// this happens when the filter is not yet set (undefined)
			// and the user triggers a reset (again undefined)
			const isUpdate = this.state.filter !== payload

			// Set the new filter
			this.state.filter = payload

			// Dispatch the change if the filter has changed
			// and the searchOnZoom is enabled
			if (isUpdate && this.state.searchOnZoom) {
				this.dispatchChange()
			}
		},
		removeFilter: () => {
			this.state.filter = undefined
			this.dispatchChange()
		},
		toggleCollapse: () => {
			this.state.collapse = !this.state.collapse
			this.dispatchChange()
		},
	}

	private dispatchChange() {
		const detail = { ID: this.ID, state: { ...this.state } }

		this.dispatchEvent(
			new CustomEvent(EventName.FacetStateChange, { detail })
		)
	}

	// Config
	protected initConfig(config: MapFacetConfig): MapFacetConfig {
		return {
			title: capitalize(config.field),
			zoom: config.zoom || 0,
			...config
		}
	}

	// State
	protected initState(): MapFacetState {
		return {
			collapse: this.config.collapse || false,
			filter: undefined,
			searchOnZoom: this.config.searchOnZoom || true,
		}
	}

	activeFilter() {
		if (this.state.filter?.bounds == null) return

		return {
			id: this.ID,
			title: this.config.title!,
			values: [this.state.filter.bounds.map(filter => filter.toFixed(2)).join(', ')],
		}
	}

	// Search request
	createPostFilter() {
		let bounds = undefined
		if (this.state.filter != null) {
			let [lonmin, latmax, lonmax, latmin] = this.state.filter.bounds as [number, number, number, number]
			if (lonmin < -180) lonmin = -180
			if (lonmax > 180) lonmax = 180
			if (latmax < -90) latmax = -90
			if (latmin > 90) latmin = 90
			bounds = {
				top_left: `${latmin}, ${lonmin}`,
				bottom_right: `${latmax}, ${lonmax}`
			}
		}

		if (bounds == null) return

		return {
			geo_bounding_box: {
				[this.config.field]: bounds
			}
		}
	}

	createAggregation(postFilters: any) {
		// if filter is not set, use the zoom set in the config
		const zoom = this.state.filter?.zoom == null
			? this.config.zoom
			: this.state.filter.zoom

		let precision = Math.ceil(zoom || 0)
		if (precision < 1) precision = 1
		if (precision > 12) precision = 12

		const values = {
			geohash_grid: {
				field: this.config.field,
				precision,
			}
		}

		return addFilter(this.ID, values, postFilters)
	}

	// Search response
	responseParser(buckets: Bucket[], _response: ElasticSearchResponse): MapFacetValue[] {
		return buckets.map(bucket => {
			const point = ngeohash.decode(bucket.key as string)
			return {
				point: [point.latitude, point.longitude],
				count: bucket.doc_count,
			}
		})
	}

	reset() {
		this.state = { ...this.initialState }
	}
}
