import React from 'react'
import styled from 'styled-components'

import { FacetFilter, FacetConfig, BaseFacetState, BaseFacetConfig } from '../common'
import { HelpButton } from '../views/ui/help-button'
// import { Button } from '../views/ui/button'
import { SearchPropsContext } from '../context/props'
import FacetWrapper from './wrapper'
import { Facet } from '.'
// import { ListFacetUtils } from '../views/list/utils'

/**
 * Interactive elements, like buttons to toggle collapse and show options, are
 * hidden by default. The :hover is set on the parent element {@link FacetWrapper} to show them.
 * The collapse 'caret' is shown when the facet is collapsed.
 */

const Header = styled('header')`
	align-items: center;
	display: grid;
	grid-template-columns: 1fr fit-content(0) fit-content(0);
	grid-gap: .5rem;
	margin-bottom: .5rem;

	.more-button, .help-button {
		height: 20px;
		margin-left: .75rem;
	}
`

type HProps = { collapse: boolean, spotColor: string }
const H3 = styled('h3')`
	cursor: pointer;
	display: inline-block;
	font-size: 1rem;
	margin: 0;
	user-select: none;
	white-space: nowrap;

	&:before {
		color: ${props => props.spotColor};
		content: '>';
		font-size: 0.5rem;
		line-height: 1.5rem;
		margin-left: -1rem;
		position: absolute;
		transform: rotate(${(p: HProps) => p.collapse ? 0 : 90}deg) scale(0.75, 2);
	}
`

interface Props<FacetConfig extends BaseFacetConfig, FacetState extends BaseFacetState> {
	facetState: FacetState
	facet: Facet<FacetConfig, FacetState>
	hasOptions: boolean
	Options?: React.FC<{ facetData: FacetState }>
}
export function FacetHeader<FacetConfig extends BaseFacetConfig, FacetState extends BaseFacetState>(props: Props<FacetConfig, FacetState>) {
	const { style, facets: facetsConfig } = React.useContext(SearchPropsContext)
	const [showOptions, setShowOptions] = React.useState(false)

	const toggleOptions = React.useCallback(() => {
		setShowOptions(!showOptions)
	}, [showOptions])

	// Close options when facet is collapsed
	React.useEffect(() => {
		if (props.facetState.collapse) {
			setShowOptions(false)
		}
	}, [props.facetState.collapse])

	return (
		<Header>
			<H3
				collapse={props.facetState.collapse}
				onClick={props.facet.actions.toggleCollapse}
				spotColor={style.spotColor}
			>
				{props.facet.config.title}
				{
					props.facetState.collapse &&
					<ActiveIndicator filters={props.facetState.filter} />
				}
			</H3>
			<HelpButton
				offset={73}
			>
				{props.facet.config.description}
			</HelpButton>
			{/* {
				ListFacetUtils.is(props.facetState) &&
				!props.collapse &&
				props.hasOptions &&
				<Button
				 	onClick={toggleOptions}
					spotColor={style.spotColor}
				>
					Filter
				</Button>
			}
			{
				ListFacetUtils.is(props.facetState) &&
				!props.collapse &&
				props.hasOptions &&
				<Button
				 	onClick={toggleOptions}
					spotColor={style.spotColor}
				>
					Sort
				</Button>
			} */}
			{
				showOptions &&
				props.Options != null &&
				<props.Options facetData={props.facetState} />
			}
		</Header>
	)
}

const Small = styled.small`
	font-weight: normal;
	margin-left: .5rem;
	font-size: .7rem;
	color: #888;
`

// TODO handle different kinds of filters (like MapFacetFilter)
function ActiveIndicator(props: { filters: FacetFilter | undefined }) {
	const { uiTexts } = React.useContext(SearchPropsContext)

	if (props.filters == null) return null
	const size = props.filters != null ? 1 : 0

	if (size === 0) return null

	return (
		<Small>
			{size} {uiTexts.active}
		</Small>
	)
}
