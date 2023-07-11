import type { HistogramFacetState, HistogramFacetValue } from "./state"
import type { Bucket } from "../../context/state/use-search/response-with-facets-parser"

export const histogramFacetResponseParser = (
    facetState: HistogramFacetState,
    buckets: Bucket[]
) =>

export 

// function createRangeBuckets(facetState: HistogramFacetState): HistogramFacetValue[] {
//     if (facetState.filter == null) return []
// 	const values: HistogramFacetValue[] = []

// 	let i = facetState.filter.from
// 	while (i <= facetState.filter.to) {
// 		const to = i + facetState.interval
// 		values.push(rangeToFacetValue(i, to))
// 		i = to
// 	}

// 	return values
// }
