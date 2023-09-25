import React from 'react'
import styled from 'styled-components'
import { Button } from './button'
import { SearchPropsContext } from '../../context/props'
import clsx from 'clsx'

const Wrapper = styled.div`
	display: inline-block;
	position: relative;
`

const DropDownButton = styled(Button)`
	background: rgba(0, 0, 0, 0);
	height: 100%;
	transition: all 300ms;
	white-space: nowrap;
	z-index: ${({ z = 0 }: CProps) => z + 1};

	& > span {
		display: inline-block;
		width: 1rem;
		height: 1rem;
		& > span {
			display: inline-block;
			font-size: .65rem;
			transform: rotate(${p => p.show ? 90 : 0}deg) scale(0.75, 2) translateY(${p => p.show ? 0 : -1}px);
			text-align: center;
		}
	}
`

interface CProps { show?: boolean, z?: number, right?: boolean }

export const DropDownBody = styled.div`
	background: white;
	border: 1px solid #888;
	box-shadow: 0 12px 12px #BBB;
	line-height: 1.6em;
	margin: 2px 0 0 .5rem;
	min-width: 200px;
	opacity: ${({ show = true }: CProps) => show ? 1 : 0};
	padding: .5em 1em;
	pointer-events: ${props => props.show ? 'all' : 'none'};
	position: absolute;
	right: ${({ right = false }: CProps) => right ? 0 : 'auto'};
	transition: opacity 300ms;
	z-index: ${({ z = 0 }: CProps) => z};
`

interface Props {
	children: React.ReactNode
	className?: string
	label: string
	right?: boolean
	z?: number
}
export const DropDown = React.memo(function DropDown(props: Props) {
	const { style } = React.useContext(SearchPropsContext)
	const [showBody, setShowBody] = React.useState(false)
	const hideMenu = React.useCallback(() => setShowBody(false), [])

	const handleClick = React.useCallback((ev: React.MouseEvent) => {
		ev.stopPropagation()
		setShowBody(!showBody)
	}, [showBody])

	React.useEffect(() => {
		if (showBody) window.addEventListener('click', hideMenu)
		else window.removeEventListener('click', hideMenu)

		return () => window.removeEventListener('click', hideMenu)
	}, [showBody])

	return (
		<Wrapper className={clsx("dropdown", props.className)}>
			<DropDownButton
				className="dropdown__button"
				onClick={handleClick}
				show={showBody}
				spotColor={style.spotColor}
				z={props.z || 0}
			>
				{/* <span>{showBody ? '▼' : '▶'}</span> {props.label} */}
				<span><span>&gt;</span></span>{props.label}
				{/* {props.label} */}
			</DropDownButton>
			<DropDownBody
				className="dropdown__body"
				onClick={ev => ev.stopPropagation()}
				right={props.right}
				show={showBody}
				z={props.z}
			>
				{props.children}
			</DropDownBody>
		</Wrapper>
	)
})
