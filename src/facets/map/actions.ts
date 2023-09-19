import { UpdateFacetFilter, UpdateFacetState } from "../../context/state/actions"
import { MapFacetFilter } from "./state"

// <UPDATE_FACET_STATE>
interface MapFacetToggleSearchOnZoom extends UpdateFacetState {
    subType: 'MAP_FACET_TOGGLE_SEARCH_ON_ZOOM'
}

interface MapFacetToggleCollapse {
    type: 'TOGGLE_COLLAPSE'
    facetID: string
}
// <\UPDATE_FACET_STATE>


// <UPDATE_FACET_FILTER>
interface MapFacetSetFilter extends UpdateFacetFilter {
    subType: 'MAP_FACET_SET_FILTER'
    value: MapFacetFilter
}

interface MapFacetRemoveFilter extends UpdateFacetFilter {
    subType: 'REMOVE_FILTER'
    facetID: string
}
// </UPDATE_FACET_FILTER>

export type MapFacetAction =
    MapFacetToggleSearchOnZoom |
    MapFacetSetFilter |
    MapFacetRemoveFilter |
    MapFacetToggleCollapse

