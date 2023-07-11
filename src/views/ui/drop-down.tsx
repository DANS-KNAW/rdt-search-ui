import React from 'react'
import styled from 'styled-components'
import { Button } from './button'
import { SearchPropsContext } from '../../context/props'

const Wrapper = styled.div`
	display: inline-block;
	position: relative;
`

const DropDownButton = styled(Button)`
	background: rgba(0, 0, 0, 0);
	/* border: 1px solid rgba(0, 0, 0, 0); */
	height: 46px;
	margin: 0 .5rem;
	padding: 0 12px;
	transition: all 300ms;
	white-space: nowrap;
	z-index: ${props => props.z + 1};

	& > span {
		font-size: .65rem;
	}

	/* ${(props: { showMenu: boolean, z: number }) =>
		(props.showMenu)
			? `
				background: white;
				border: 1px solid #888;
				border-bottom: 1px solid white;
				height: 49px;

				border-radius: unset;
				border-top-left-radius: .2rem;
				border-top-right-radius: .2rem;
			`
			: null
	} */
`

export const DropDownBody = styled.div`
	background: white;
	border: 1px solid #888;
	box-shadow: 0 12px 12px #BBB;
	line-height: 1.6em;
	margin: 2px 0 0 .5rem;
	min-width: 200px;
	opacity: ${(props: { show?: boolean, z?: number }) => props.show ? 1 : 0};
	padding: .5em 1em;
	pointer-events: ${props => props.show ? 'all' : 'none'};
	position: absolute;
	transition: opacity 300ms;
	z-index: ${props => props.z || 0};

	& > div {
		color: #444;
		font-size: .9rem;

		&:hover {
			cursor: pointer;
			color: black;
		}
	}

	& > div:not(:last-of-type) {
		border-bottom: 1px solid #EEE;
	}
`
DropDownBody.defaultProps = { show: true, z: 0 }

interface Props {
	children: React.ReactNode
	className?: string
	label: string
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
		<Wrapper className={props.className}>
			<DropDownButton
				className="huc-fs-dropdown-button"
				onClick={handleClick}
				showMenu={showBody}
				spotColor={style.spotColor}
				z={props.z || 0}
			>
				{props.label} <span>{showBody ? '▲' : '▼'}</span>
			</DropDownButton>
			<DropDownBody
				className="huc-fs-dropdown-body"
				onClick={ev => ev.stopPropagation()}
				show={showBody}
				z={props.z}
			>
				{props.children}
			</DropDownBody>
		</Wrapper>
	)
})
