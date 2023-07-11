import type { BaseFacetConfig, BaseFacetState } from '../common'

import React from 'react'
import styled from "styled-components"

import { FacetHeader } from './header'
import { Facet } from '.'
import { HistogramFacetValue } from './histogram/state'

const Wrapper = styled.div`
	color: #444;
	margin-bottom: 2rem;
	transition: margin 100ms;

	header > button,
	header > h3:before {
		opacity: ${(p: { collapse: boolean }) => p.collapse ? 1 : 0};
		transition: opacity 300ms;
	}

	&:hover {
		header > button,
		header > h3:before {
			opacity: 1;
		}
	}

`

interface Props<FacetConfig extends BaseFacetConfig, FacetState extends BaseFacetState> {
	children: React.ReactNode
	facet: Facet<FacetConfig, FacetState>
	facetState: FacetState
	values: any[]
	className?: string
	Options?: React.FC<{ facetData: FacetState }>
}
function FacetWrapper<FacetConfig extends BaseFacetConfig, FacetState extends BaseFacetState>(props: Props<FacetConfig, FacetState>) {
	return (
		<Wrapper
			className={props.className}
			collapse={props.facetState.collapse}
		>
			<FacetHeader
				facet={props.facet}
				facetState={props.facetState}
				hasOptions={props.Options != null}
				Options={props.Options}
			/>
			{
				!props.facetState.collapse &&
				props.children
			}
		</Wrapper>
	)
}

export default React.memo(FacetWrapper)
