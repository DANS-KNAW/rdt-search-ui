import React from 'react'

import { DropDown } from '../../../ui/drop-down'
import OrderOption from './option'

import { SearchPropsContext } from '../../../../context/props'
import { FacetControllersContext } from '../../../../context/controllers'
import { SortOrder } from '../../../../context/state/use-search/types'

interface Props {
	sortOrder: SortOrder
}
export const SortBy = React.memo(function SortBy(props: Props) {
	const controllers = React.useContext(FacetControllersContext)
	const { uiTexts } = React.useContext(SearchPropsContext)

	const label = (props.sortOrder.size > 0) ?
		`${uiTexts.sort_by} (${props.sortOrder.size})` :
		uiTexts.sort_by

	return (
		<DropDown
			caret
			label={label}
			style={{ zIndex: 2 }}
		>
			{
				Array.from(controllers.values())
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
