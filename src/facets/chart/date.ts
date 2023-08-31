import type { Bucket } from "../../context/state/use-search/response-with-facets-parser"
import type { DateChartFacetConfig, DateChartFacetState, KeyCountMap  } from "./state"

import { addFilter } from "../../context/state/use-search/request-with-facets-creator"
import { ChartFacetView } from "./view"
import { Facet } from ".."
import { EventName } from "../../constants"
import { ElasticSearchResponse, FacetType } from "../../common"

function capitalize(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1)
}

const format = {
	year: 'yyyy',
	quarter: 'yyyy-MM',
	month: 'yyyy-MM',
	day: 'yyyy-MM-dd',
	hour: 'yyyy-MM-dd HH',
	minute: 'yyyy-MM-dd HH:mm',
}

export class DateChartFacet extends Facet<DateChartFacetConfig, DateChartFacetState> {
	/**
	 * Set the range of the values in timestamps. This is used to calculate the 
	 * percentage of the range that the filter represents.
	 * 
	 * Range is not set on the state, because the range is dependent on the response
	 * from the search request. The state is only passed to the rest of the application
	 * when the user changes the filter.
	 */
	range: { min: number, max: number, currentMin: number, currentMax: number } | undefined

	type = FacetType.Date
	View = ChartFacetView

	actions = {
		setFilter: (filter: string | [number, number]) => {
			this.state.filter = this.state.filter === filter
				? undefined
				: filter
			this.dispatchChange()
		},
		toggleCollapse: () => {
			this.state.collapse = !this.state.collapse
			this.dispatchChange()
		},
		removeFilter: () => {
			this.state.filter = undefined
			this.dispatchChange()
		}
	}

	private dispatchChange() {
		const detail = { ID: this.ID, state: { ...this.state } }

		this.dispatchEvent(
			new CustomEvent(EventName.FacetStateChange, { detail })
		)
	}

	// Config, initialised in Facet.constructor
	protected initConfig(config: DateChartFacetConfig): DateChartFacetConfig {
		return {
            title: capitalize(config.field),
            ...config
		}
	}

	// State, initialised in Facet.constructor
	protected initState(): DateChartFacetState {
		return {
			collapse: this.config.collapse || false,
            filter: undefined,
			initialValues: undefined,
		}
	}

	activeFilter() {
		return {
			id: this.ID,
			title: this.config.title!,
			values: getValueLabel(this.state.filter, this.range, this.config)
		
		}
	}

	// TODO only works for year interval
	// Search request
	createPostFilter() {
		if (this.state.filter == null) return 

		if (typeof this.state.filter === 'string') {
			return {
				range: {
					[this.config.field]: {
						gte: this.state.filter + '-01-01||/y',
						lt: this.state.filter + '-01-01||+1y/y'
					}
				}
			}
		} else if (Array.isArray(this.state.filter) && this.state.filter.length === 2) {	
			if (this.range == null) return

			const { min, max } = this.range

			const interval = max - min
			const fromTimestamp = min + (interval * this.state.filter[0] / 100)
			const toTimestamp = min + (interval * this.state.filter[1] / 100)
			const fromYear = new Date(fromTimestamp).getUTCFullYear()
			const toYear = new Date(toTimestamp).getUTCFullYear()

			return {
				range: {
					[this.config.field]: {
						gte: fromYear + '-01-01||/y',
						lt: toYear + '-01-01||+1y/y'
					}
				}
			}
		}

		return
	}

	createAggregation(postFilters: any) {
		const values = {
			date_histogram: {
				field: this.config.field,
				calendar_interval: this.config.interval,
				format: format[this.config.interval]
			}
		}

		return addFilter(this.ID, values, postFilters)
	}

	// Search response
	responseParser(buckets: Bucket[], _response: ElasticSearchResponse): KeyCountMap {
		// If no buckets are returned, return an empty map
		if (buckets == null || buckets.length === 0) {
			return this.values
				// If this is not the first load, reset the values to 0
				? new Map(Array.from(this.values.keys()).map(x => [x, 0]))
				// If this is the first load, return an empty map
				: new Map()
		}	

		this.updateRange(buckets, this.config)

		const emptyMap = this.values == null
			? new Map()
			: new Map(Array.from(this.values.keys()).map(x => [x, 0]))

		this.values = buckets
			.reduce(
				(prev, curr) =>
					prev.set(
						curr.key_as_string || curr.key.toString(),
						curr.doc_count
					)
				, emptyMap
			)

		return this.values
	}

	private values: KeyCountMap | undefined

	reset() {
		this.state = { ...this.initialState }
	}

	private updateRange(buckets: Bucket[], config: DateChartFacetConfig) {
		const currentMin = buckets[0].key as number
		let lastKey = buckets[buckets.length - 1].key as number
		let currentMax: number

		if (config.interval === 'year') {
			currentMax = new Date(lastKey).setFullYear(new Date(lastKey).getFullYear() + 1)
		} else if (config.interval === 'quarter') {
			currentMax = new Date(lastKey).setMonth(new Date(lastKey).getMonth() + 3)
		} else if (config.interval === 'month') {
			currentMax = new Date(lastKey).setMonth(new Date(lastKey).getMonth() + 1)
		} else if (config.interval === 'day') {
			currentMax = new Date(lastKey).setDate(new Date(lastKey).getDate() + 1)
		} else if (config.interval === 'hour') {
			currentMax = new Date(lastKey).setHours(new Date(lastKey).getHours() + 1)
		} else if (config.interval === 'minute') {
			currentMax = new Date(lastKey).setMinutes(new Date(lastKey).getMinutes() + 1)
		} else {
			throw new Error(`Unknown interval: ${config.interval}`)
		}

		this.range = {
			min: this.range?.min || currentMin,
			currentMin,
			currentMax: currentMax - 1, // subtract 1ms to get the last ms of the year/quarter/month/day/hour/minute
			max: this.range?.max || lastKey,
		}
	}
}


// export function rangeToFacetValue(from: number, to: number, count = 0): HistogramFacetValue {
// 	return {
// 		from,
// 		to,
// 		fromLabel: Math.floor(from).toString(),
// 		toLabel: Math.ceil(to).toString(),
// 		count,
// 	}
// }

function getValueLabel(
	filter: DateChartFacetState['filter'],
	valueRange: { min: number, max: number } | undefined,
	config: DateChartFacetConfig
) {
	if (filter == null) return []

	if (typeof filter === 'string') return [filter]
					
	if (Array.isArray(filter) && filter.length === 2) {
		if (valueRange == null) return []

		const interval = valueRange.max - valueRange.min
		const fromTimestamp = valueRange.min + (interval * filter[0] / 100)
		const toTimestamp = valueRange.min + (interval * filter[1] / 100) - 1

		return [
			timestampToLabel(fromTimestamp, config),
			timestampToLabel(toTimestamp, config)
		]
	}

	return []
}

function timestampToLabel(timestamp: number, config: DateChartFacetConfig) {
	if (config.interval === 'year') {
		return new Date(timestamp).getUTCFullYear().toString()
	} else if (config.interval === 'quarter') {
		return new Date(timestamp).getUTCFullYear().toString()
	} else if (config.interval === 'month') {
		const date = new Date(timestamp)
		return `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}`
	} else if (config.interval === 'day') {
		const date = new Date(timestamp)
		return `${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDay()}`
	} else if (config.interval === 'hour') {
		const date = new Date(timestamp)
		return `${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDay()} ${date.getUTCHours()}`
	} else if (config.interval === 'minute') {
		const date = new Date(timestamp)
		return `${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDay()} ${date.getUTCHours()}:${date.getUTCMinutes()}`
	}

	throw new Error(`Unknown interval: ${config.interval}`)
}