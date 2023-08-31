import type { BaseFacetConfig, BaseFacetState } from '../common'

import React from 'react'
import styled from "styled-components"
import clsx from 'clsx'

import { FacetHeader } from './header'
import { Facet } from '.'

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

	.facet__body--collapsed {
		display: none;
	}

`

// TODO add a div around children and show/hide using display: none
//      this makes it possible to keep state of children

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
			className={clsx("facet", props.className)}
			collapse={props.facetState.collapse}
		>
			<FacetHeader
				facet={props.facet}
				facetState={props.facetState}
				hasOptions={props.Options != null}
				Options={props.Options}
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
