import { ListFacetState } from "../state"
import { LIST_FACET_SCROLL_CUT_OFF } from "./list-view"

export interface ListFacetViewState {
	pagination: boolean
	scroll: boolean
	scrollButton: boolean
	query: boolean
}

export const listFacetViewStates: Record<number, ListFacetViewState> = {
	/** Without query */

	// total < size
	0: { pagination: false, scroll: false, scrollButton: false, query: false },

	// total < LIST_FACET_SCROLL_CUT_OFF
	1: { pagination: false, scroll: false, scrollButton: true, query: false },

	// size === total && total <= LIST_FACET_SCROLL_CUT_OFF
	2: { pagination: false, scroll: true, scrollButton: false, query: false },

	// total > LIST_FACET_SCROLL_CUT_OFF
	3: { pagination: true, scroll: false, scrollButton: false, query: false },


	/** With query */

	4: { pagination: false, scroll: false, scrollButton: false, query: true },

	// values.length === size
	5: { pagination: false, scroll: false, scrollButton: true, query: true },

	// config.size < values.length <= LIST_FACET_SCROLL_CUT_OFF
	6: { pagination: false, scroll: true, scrollButton: false, query: true },
}

export function getViewState(
    total: number,
    configSize: number,
    stateSize: number,
    query: ListFacetState['query']
) {
    if (query?.length) {
        if (total < configSize) {
            return listFacetViewStates[4]
        }
        else if (total > configSize) {
            return listFacetViewStates[6]
        } else if (total === configSize) {
            return listFacetViewStates[5]
        } else {
            throw new Error(`[viewState not set] Unexpected total (${total}) for query "${query}"`)
        }
    } else {
        if (total < configSize) {
            return listFacetViewStates[0]
        }
        else if (total <= LIST_FACET_SCROLL_CUT_OFF) {
            return stateSize === total
                ? listFacetViewStates[2]
                : listFacetViewStates[1]
        }
        else if (total > LIST_FACET_SCROLL_CUT_OFF) {
            return listFacetViewStates[3]
        } else {
            throw new Error(`[viewState not set] unexpected total (${total})`)
        }
    }
}