import React from "react"
import styled from "styled-components"
import { Tooltip } from "../../common"
import { SvgButton } from "./button"
import { SearchPropsContext } from "../../context/props"

const Wrapper = styled.div`
	position: relative;
	line-height: 0;
`

const Body = styled.div`
	padding: .75rem 1rem;
`

interface Props {
	children: React.ReactNode
	offset?: number
}
export function HelpButton(props: Props) {
	const { style } = React.useContext(SearchPropsContext)
	const [tooltipActive, setTooltipActive] = React.useState(false)

	if (props.children == null) return null

	return (
		<Wrapper
			className="rdt-search__help-button"
			onClick={() => setTooltipActive(!tooltipActive)}
		>
			<SvgButton
				active={tooltipActive}
				spotColor={style.spotColor}
			>
				<text
					x="11"
					y="23"
					fontFamily="sans-serif"
					fontSize="18"
					fontWeight="bold"
				>
					?
				</text>
			</SvgButton>
			{
				tooltipActive &&
				<Tooltip
					color={style.spotColor}
					offset={props.offset}
				>
					<Body>
						{props.children}
					</Body>
				</Tooltip>
			}
		</Wrapper>
	)
}
