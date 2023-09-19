import type { BaseFacetConfig, BaseFacetState, FacetFilter } from '../common'

import React from 'react'
import styled from "styled-components"
import clsx from 'clsx'

import { FacetHeader } from './header'
import { FacetController } from './controller'

const Wrapper = styled.div`
	color: #444;
	display: grid;
	grid-template-rows: fit-content(0) 1fr;
	height: 100%;
	transition: margin 100ms;

	&:hover {
		header > button,
		header > h3:before {
			opacity: 1;
		}
	}


	.facet__header > button,
	.facet__header > h3:before {
		opacity: ${(p: { collapse: boolean }) => p.collapse ? 1 : 0};
		transition: opacity 300ms;
	}

	.facet__body--collapsed {
		display: none;
	}
`

interface Props<
	FacetConfig extends BaseFacetConfig,
	FacetState extends BaseFacetState,
	Filter extends FacetFilter
> {
	children: React.ReactNode
	facet: FacetController<FacetConfig, FacetState, Filter>
	facetState: FacetState
	filter: Filter
	values: any
	className?: string
}
function FacetWrapper<
	FacetConfig extends BaseFacetConfig,
	FacetState extends BaseFacetState,
	Filter extends FacetFilter
>(props: Props<FacetConfig, FacetState, Filter>) {
	return (
		<Wrapper
			className={clsx("facet", props.className)}
			collapse={props.facetState.collapse}
		>
			<FacetHeader
				facet={props.facet}
				facetState={props.facetState}
				filter={props.filter}
				// hasOptions={props.Options != null}
				// Options={props.Options}
			/>
			<div
				className={clsx(
					"facet__body",
					props.facetState.collapse && "facet__body--collapsed"
				)}
			
			>
				{props.children}
			</div>
		</Wrapper>
	)
}

export default React.memo(FacetWrapper)
