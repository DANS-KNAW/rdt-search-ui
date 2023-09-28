import React from 'react'
import clsx from 'clsx'

import styles from './index.module.css'
import buttonStyle from '../../ui/button.module.css'

interface Props {
	children: React.ReactNode
	className?: string
	label: string
	caret?: boolean
	right?: boolean
	small?: boolean
	style?: React.CSSProperties
}
export const DropDown = React.memo(
	function DropDown(
		{
			children,
			className,
			label,
			caret = false,
			small = false,
			right = false,
			style
		}: Props
	) {
		const ref = React.useRef<HTMLButtonElement>(null)
		const [active, setActive] = React.useState(false)

		const deactivate = React.useCallback((ev: MouseEvent) => {
			// If the click was on the button, the event is already
			// handled by the button's click handler
			const buttonEl = (ev.target as HTMLElement)?.closest('button')
			if (buttonEl === ref.current) return

			setActive(false)
		}, [active])

		const handleClick = React.useCallback((ev: React.MouseEvent) => {
			setActive(!active)
		}, [active])

		React.useEffect(() => {
			if (active) window.addEventListener('click', deactivate)
			else window.removeEventListener('click', deactivate)

			return () => window.removeEventListener('click', deactivate)
		}, [active])

		return (
			<div
				className={clsx(
					styles.wrapper,
					{
						[styles.stateActive]: active,
						[styles.stateRight]: right,
						[styles.stateSmall]: small,
					},
					className,
				)}
				style={style}
			>
				<button
					className={clsx(buttonStyle.button, styles.button)}
					onClick={handleClick}
					ref={ref}
				>
					{label}
					{
						caret &&
						<span><span>&gt;</span></span>
					}
				</button>
				<div
					className={styles.body}
					onClick={ev => ev.stopPropagation()}
				>
					{children}
				</div>
			</div>
		)
	}
)
