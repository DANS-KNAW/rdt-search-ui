import React from "react"
import styled from "styled-components"

const Tabs = styled.div`
	background: #e66272;
	bottom: 0;
	color: white;
	display: grid;
	grid-template-columns: auto auto;
	height: 24px;
	left: 0;
	padding: 8px;
	position: fixed;
	right: 0;
	z-index: 1;
`

interface TabProps { active: boolean }
const Tab = styled.div`
	align-content: center;
	cursor: ${(props: TabProps) => props.active ? 'default' : 'pointer'};
	display: grid;
	font-weight: ${(props: TabProps) => props.active ? 'bold' : 'normal'};
	text-transform: uppercase;
	letter-spacing: .1rem;
	height: 100%;
	justify-content: center;
	transition: all 300ms;
	width: 100%;

	&:first-of-type {
		border-right: 1px solid white;
	}

	&:hover {

		text-decoration: ${(props: TabProps) => props.active ? 'none' : 'underline'};
		text-underline-offset: .25rem;
	}
`

interface Props {
	setShowResults: (x: boolean) => void
	showResults: boolean
}
export function ToggleView(props: Props) {
	const toggle = React.useCallback((ev: React.MouseEvent) => {
		const target = ev.target as HTMLElement
		props.setShowResults(target.classList.contains('results'))
	}, [props.showResults])

	return (
		<Tabs
			id="rdt-search__toggle-view"
			onClick={toggle}
		>
			<Tab
				active={!props.showResults}
				className="filters"
			>
				Filters
			</Tab>
			<Tab
				active={props.showResults}
				className="results"
			>
				Results
			</Tab>
		</Tabs>
	)
}
