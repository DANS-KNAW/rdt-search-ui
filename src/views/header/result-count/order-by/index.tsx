import React from 'react'

import { DropDown } from '../../../ui/drop-down'
import OrderOption from './option'

import { SortOrder } from '../../../../common'
import { SearchPropsContext } from '../../../../context/props'

interface Props {
	// setSortOrder: SetSortOrder
	sortOrder: SortOrder
}
export const SortBy = React.memo(function SortBy(props: Props) {
	const { uiTexts, facets } = React.useContext(SearchPropsContext)

	const label = (props.sortOrder.size > 0) ?
		`${uiTexts.sort_by} (${props.sortOrder.size})` :
		uiTexts.sort_by

	return (
		<DropDown
			label={label}
			z={998}
		>
			{
				Array.from(facets)
					// .sort(([id1, facetData1], [id2, facetData2]) => {
					// 	const a = props.sortOrder.has(id1)
					// 	const b = props.sortOrder.has(id2)

					// 	if (a === b) {
					// 		const order1 = facetData1.config.facet.order
					// 		const order2 = facetData2.config.facet.order
					// 		// @ts-ignore
					// 		return order1 - order2
					// 	}

					// 	return a ? -1 : 1
					// })
					.map((facet) =>
						<OrderOption
							facet={facet}
							key={facet.ID}
							sortOrder={props.sortOrder}
							// setSortOrder={props.setSortOrder}
						/>
					)
			}
		</DropDown>
	)
})
