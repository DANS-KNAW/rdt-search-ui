import type { Bucket } from "../../context/state/use-search/response-with-facets-parser"
import type { DateChartFacetConfig, DateChartFacetState  } from "./state"

import { addFilter } from "../../context/state/use-search/request-with-facets-creator"
import { ChartFacetView } from "./view"
import { Facet } from ".."
import { EventName } from "../../constants"
import { ElasticSearchResponse, FacetType } from "../../common"
import { KeyCount } from "../list/state"

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
	private valueRange: { min: number, max: number } | undefined

	type = FacetType.Date
	View = ChartFacetView

	actions = {
		setFilter: (filter: string | [number, number]) => {
			// if (typeof filter === 'string') {
			// 	filter = [
			// 		Date.UTC(parseInt(filter), 0),
			// 		Date.UTC(parseInt(filter) + 1, 0)
			// 	]
			// }
			// else if (Array.isArray(filter) && filter.length === 2) {

			// }

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
			values: getValueLabel(this.state.filter, this.valueRange, this.config)
		
		}
	}

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
			if (this.valueRange == null) return

			const interval = this.valueRange.max - this.valueRange.min
			const fromTimestamp = this.valueRange.min + (interval * this.state.filter[0] / 100)
			const toTimestamp = this.valueRange.min + (interval * this.state.filter[1] / 100)
			const fromYear = new Date(fromTimestamp).getUTCFullYear()
			const toYear = new Date(toTimestamp).getUTCFullYear()

			console.log(fromYear, toYear)

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
	responseParser(buckets: Bucket[], _response: ElasticSearchResponse): KeyCount[] {
		if (this.valueRange == null) {
			this.valueRange = getValueRange(buckets, this.config)
		}

		return buckets.map((b: Bucket) => ({
			key: b.key_as_string || b.key.toString(),
			count: b.doc_count
		}))
	}

	reset() {
		this.state = { ...this.initialState }
	}
}

function getValueRange(buckets: Bucket[], config: DateChartFacetConfig) {
	const min = buckets[0].key as number
	let max = buckets[buckets.length - 1].key as number

	if (config.interval === 'year') {
		max = new Date(max).setFullYear(new Date(max).getFullYear() + 1)
	} else if (config.interval === 'quarter') {
		max = new Date(max).setMonth(new Date(max).getMonth() + 3)
	} else if (config.interval === 'month') {
		max = new Date(max).setMonth(new Date(max).getMonth() + 1)
	} else if (config.interval === 'day') {
		max = new Date(max).setDate(new Date(max).getDate() + 1)
	} else if (config.interval === 'hour') {
		max = new Date(max).setHours(new Date(max).getHours() + 1)
	} else if (config.interval === 'minute') {
		max = new Date(max).setMinutes(new Date(max).getMinutes() + 1)
	}

	return {
		min,
		max,
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
		const toTimestamp = valueRange.min + (interval * filter[1] / 100)

		return [
			new Date(fromTimestamp).toISOString(),
			new Date(toTimestamp).toISOString(),
		]
		// return [
		// 	timestampToLabel(fromTimestamp, config),
		// 	timestampToLabel(toTimestamp, config)
		// ]
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
		return `${date.getUTCFullYear()}-${date.getUTCMonth()}`
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