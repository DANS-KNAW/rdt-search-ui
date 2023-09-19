import { UpdateFacetFilter, UpdateFacetState } from "../../context/state/actions"

interface ChartFacetSetFilter extends UpdateFacetFilter {
    subType: 'CHART_FACET_SET_FILTER'
    value: string
}

interface ChartFacetSetRange extends UpdateFacetFilter {
    subType: 'CHART_FACET_SET_RANGE'
    value: [number, number]
}

interface ChartFacetRemoveFilter extends UpdateFacetFilter {
    subType: 'REMOVE_FILTER'
}

interface ChartFacetToggleCollapse extends UpdateFacetState {
    subType: 'CHART_FACET_TOGGLE_COLLAPSE'
    facetID: string
}

export type ChartFacetAction =
    ChartFacetSetFilter |
    ChartFacetSetRange |
    ChartFacetRemoveFilter |
    ChartFacetToggleCollapse

