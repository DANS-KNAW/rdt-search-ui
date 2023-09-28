import React from 'react'
import styled from 'styled-components'
import debounce from 'lodash.debounce'
import clsx from 'clsx'

import type { ListFacetProps } from '.'
import { SearchPropsContext } from '../../../context/props'
import { SortBy, SortDirection } from '../../../enum'
import inputStyles from '../../../views/ui/input.module.css'

export const OptionsWrapper = styled('div')`
	font-size: .75rem;
	display: grid;
	grid-template-columns: 1fr 36px 18px;
	grid-gap: 6px;
	height: 1.5rem;
	margin-bottom: .5rem;	

	button {
		background: none;
		border: none;
		cursor: pointer;
		padding: 0;
		width: 18px;
		justify-self: end;
		height: 1.5rem;

		svg {
			height: 100%;
			width: 95%;
		}
	}
`

function Options(props: ListFacetProps) {
	const { style } = React.useContext(SearchPropsContext)
	const [filterInputValue, setFilterInputValue] = React.useState('')

	const setQuery = debounce((value: string) => {
		// props.facet.actions.setQuery(value)
		props.dispatch({
			type: 'UPDATE_FACET_STATE',
			subType: 'LIST_FACET_SET_QUERY',
			facetID: props.facet.ID,
			query: value
		})
	}, 600)

	const handleFilterInputChange = React.useCallback(
		(ev: React.ChangeEvent<HTMLInputElement>) => {
			setFilterInputValue(ev.target.value)
			setQuery(ev.target.value)
		},
		[]
	)

	const sortByKey = props.facetState.sort.by === SortBy.Key
	const sortByCount = props.facetState.sort.by === SortBy.Count
	const ascending = props.facetState.sort.direction === SortDirection.Asc

	return (
		<OptionsWrapper color={style.spotColor}>
			<input
				className={inputStyles.input}
				onChange={handleFilterInputChange}
				type="text"
				value={filterInputValue}
				placeholder="Filter"
			/>
			<button
				className={clsx(
					'sort-button',
					'sort-button__by-key',
					{
						'sort-button--active': props.facetState.sort.by === SortBy.Key
					}
				)}
				onClick={() => {
					props.dispatch({
						type: "UPDATE_FACET_STATE",
						subType: "LIST_FACET_SET_SORT",
						facetID: props.facet.ID,
						sort: {
							by: SortBy.Key,
							direction: ascending
								? SortDirection.Desc
								: SortDirection.Asc
						}
					})
					// props.facet.actions.setSort({
					// 	by: SortBy.Key,
					// 	direction: ascending
					// 		? SortDirection.Desc
					// 		: SortDirection.Asc
					// })
				}}
			>
				{
					sortByKey && ascending
						? <SortAlphaAscIcon color={sortByKey ? style.spotColor : '#CCC'} />
						: <SortAlphaDescIcon color={sortByKey ? style.spotColor : '#CCC'} />
				}
			</button>
			<button
				className={clsx(
					'sort-button',
					'sort-button__by-count',
					{
						'sort-button--active': props.facetState.sort.by === SortBy.Count
					}
				)}
				onClick={() => {
					props.dispatch({
						type: "UPDATE_FACET_STATE",
						subType: "LIST_FACET_SET_SORT",
						facetID: props.facet.ID,
						sort: {
							by: SortBy.Count,
							direction: props.facetState.sort.direction === SortDirection.Asc
								? SortDirection.Desc
								: SortDirection.Asc
						}
					})
				}}
			>
				{
					sortByCount && ascending
						? <SortNumericAscIcon color={sortByCount ? style.spotColor : '#CCC'} />
						: <SortNumericDescIcon color={sortByCount ? style.spotColor : '#CCC'} />
				}
			</button>
		</OptionsWrapper>
	)
}

export default React.memo(Options)

function SortAlphaAscIcon({ color = "#444" } : { color: string }) {
	return (
		<svg viewBox="0 0 18 18">
			<title>Sort alphabetically from A - Z</title>
			<path
				d="m 7.0175,12.841934 -1.22,1.180645 V 2.2258063 C 5.7975,1.8290322 5.4575,1.5 5.0475,1.5 c -0.41,0 -0.75,0.3290322 -0.75,0.7258063 V 14.022579 l -1.22,-1.180645 c -0.29,-0.280645 -0.77,-0.280645 -1.06,0 -0.29,0.280645 -0.29,0.745162 0,1.025807 l 2.5,2.419353 c 0.07,0.06775 0.15,0.11613 0.24,0.15484 0.09,0.03871 0.19,0.05807 0.29,0.05807 0.1,0 0.2,-0.01936 0.29,-0.05807 0.09,-0.03871 0.17,-0.08709 0.24,-0.15484 l 2.5,-2.419353 c 0.29,-0.280645 0.29,-0.745162 0,-1.025807 -0.29,-0.280645 -0.77,-0.280645 -1.06,0 z"
				fill={color}
			/>
			<path
				d="m 10.985712,8.0492307 c 0.382958,0.1421541 0.805195,-0.060923 0.942668,-0.4569238 l 0.274944,-0.791991 h 1.99335 l 0.274945,0.791991 C 14.579633,7.9070766 14.864398,8.1 15.168801,8.1 c 0.07855,0 0.166931,-0.010154 0.245486,-0.040615 0.382959,-0.1421541 0.579348,-0.5787702 0.441876,-0.9747708 l -1.679127,-4.86369 C 14.010105,1.7843082 13.627146,1.5 13.19509,1.5 c -0.432056,0 -0.815015,0.2843082 -0.981946,0.7412319 l -1.669308,4.8433819 c -0.137472,0.3960006 0.05892,0.8326167 0.441876,0.9747708 z M 13.666424,5.2772366 H 12.723756 L 13.19509,3.9166191 Z"
				fill={color}
			/>
			<path
				d="M 15.779878,10.620923 C 15.57672,10.174154 15.149017,9.9 14.65716,9.9 h -3.325385 c -0.438395,0 -0.801942,0.345231 -0.801942,0.761538 0,0.416308 0.363547,0.761539 0.801942,0.761539 h 2.555521 l -3.025993,2.995385 C 10.497756,14.784 10.401523,15.312 10.604681,15.779077 10.80784,16.225846 11.235542,16.5 11.7274,16.5 h 3.346769 c 0.438395,0 0.801942,-0.345231 0.801942,-0.761538 0,-0.416308 -0.363547,-0.761539 -0.801942,-0.761539 h -2.55552 l 3.0153,-2.975077 c 0.363547,-0.365538 0.470473,-0.903692 0.256622,-1.370769 z"
				fill={color}
			/>
		</svg>
	)
}

function SortAlphaDescIcon({ color = "#444" } : { color: string }) {
	return (
		<svg viewBox="0 0 18 18">
			<path
     			d="m 7.0175,12.841934 -1.22,1.180645 V 2.2258063 C 5.7975,1.8290322 5.4575,1.5 5.0475,1.5 c -0.41,0 -0.75,0.3290322 -0.75,0.7258063 V 14.022579 l -1.22,-1.180645 c -0.29,-0.280645 -0.77,-0.280645 -1.06,0 -0.29,0.280645 -0.29,0.745162 0,1.025807 l 2.5,2.419353 c 0.07,0.06775 0.15,0.11613 0.24,0.15484 0.09,0.03871 0.19,0.05807 0.29,0.05807 0.1,0 0.2,-0.01936 0.29,-0.05807 0.09,-0.03871 0.17,-0.08709 0.24,-0.15484 l 2.5,-2.419353 c 0.29,-0.280645 0.29,-0.745162 0,-1.025807 -0.29,-0.280645 -0.77,-0.280645 -1.06,0 z"
				fill={color}
			/>
			<path
     			d="m 10.985712,16.449231 c 0.382958,0.142154 0.805195,-0.06092 0.942668,-0.456924 l 0.274944,-0.791991 h 1.99335 l 0.274945,0.791991 C 14.579633,16.307077 14.864398,16.5 15.168801,16.5 c 0.07855,0 0.166931,-0.01015 0.245486,-0.04061 0.382959,-0.142154 0.579348,-0.57877 0.441876,-0.974771 l -1.679127,-4.86369 C 14.010105,10.184308 13.627146,9.9 13.19509,9.9 c -0.432056,0 -0.815015,0.284308 -0.981946,0.741232 l -1.669308,4.843382 c -0.137472,0.396 0.05892,0.832616 0.441876,0.974771 z m 2.680712,-2.771994 h -0.942668 l 0.471334,-1.360618 z"
				fill={color}
			/>
			<path
     			d="M 15.779878,2.220923 C 15.57672,1.774154 15.149017,1.5 14.65716,1.5 h -3.325385 c -0.438395,0 -0.801942,0.345231 -0.801942,0.761538 0,0.416308 0.363547,0.761539 0.801942,0.761539 h 2.555521 L 10.861303,6.018462 C 10.497756,6.384 10.401523,6.912 10.604681,7.379077 10.80784,7.825846 11.235542,8.1 11.7274,8.1 h 3.346769 c 0.438395,0 0.801942,-0.345231 0.801942,-0.761538 0,-0.416308 -0.363547,-0.761539 -0.801942,-0.761539 h -2.55552 l 3.0153,-2.975077 c 0.363547,-0.365538 0.470473,-0.903692 0.256622,-1.370769 z"
				fill={color}
			/>
		</svg>
	)
}

function SortNumericAscIcon({ color = "#444" } : { color: string }) {
	return (
		<svg viewBox="0 0 12 12">
			<path
     			d="M 9.71,1 V 5.4 H 8.662 V 1.8384096 H 8.611 L 7.4,2.5472618 V 1.7476369 L 8.662,1 h 1.046 z"
				fill={color}
			/>
			<path
     			d="M 8.687614,11 C 7.673442,11 7.1641259,10.477724 7.1159594,9.984065 H 8.0115 c 0.05173,0.177272 0.305946,0.357724 0.689494,0.357724 0.734985,0 1.038256,-0.659007 1.010605,-1.475411 H 9.658969 C 9.526957,9.176405 9.150545,9.456224 8.534192,9.456224 7.722498,9.456224 7,8.968925 7,8.058717 7,7.1461247 7.756392,6.6 8.759861,6.6 9.732111,6.6 10.6,7.1055827 10.6,8.736007 10.6,10.220163 9.955104,11 8.68672,11 Z m 0.0553,-2.174164 c 0.449554,0 0.83221,-0.267101 0.83221,-0.772683 0,-0.5031982 -0.355005,-0.8013011 -0.838454,-0.8013011 -0.463826,0 -0.826858,0.2981029 -0.826858,0.7949411 0,0.508763 0.372844,0.779043 0.833102,0.779043 z"
				fill={color}
			/>
			<path
     			d="M 4.6783333,8.5612905 3.8650003,9.3483873 V 1.483871 C 3.8650003,1.2193549 3.6383334,1 3.3650004,1 c -0.273334,0 -0.5,0.2193549 -0.5,0.483871 V 9.3483873 L 2.0516665,8.5612905 c -0.193333,-0.1870968 -0.513333,-0.1870968 -0.706666,0 -0.193334,0.1870968 -0.193334,0.4967742 0,0.683871 l 1.6666659,1.6129025 c 0.04667,0.04516 0.1,0.07742 0.16,0.103226 0.06,0.02581 0.126667,0.03871 0.193334,0.03871 0.06667,0 0.133333,-0.0129 0.193333,-0.03871 0.06,-0.02581 0.113333,-0.05806 0.16,-0.103226 L 5.3850003,9.2451615 c 0.1933329,-0.1870968 0.1933329,-0.4967742 0,-0.683871 -0.193334,-0.1870968 -0.513334,-0.1870968 -0.706667,0 z"
				fill={color}
			/>
		</svg>
	)
}

function SortNumericDescIcon({ color = "#444" } : { color: string }) {
	return (
		<svg viewBox="0 0 12 12">
			<path
     			d="M 9.71,6.6 V 11 H 8.662 V 7.4384096 H 8.611 L 7.4,8.1472618 V 7.3476369 L 8.662,6.6 h 1.046 z"
				fill={color}
			/>
			<path
     			d="M 8.687614,5.4 C 7.673442,5.4 7.1641259,4.877724 7.1159594,4.384065 H 8.0115 c 0.05173,0.177272 0.305946,0.357724 0.689494,0.357724 0.734985,0 1.038256,-0.659007 1.010605,-1.475411 H 9.658969 C 9.526957,3.576405 9.150545,3.856224 8.534192,3.856224 7.722498,3.856224 7,3.368925 7,2.458717 7,1.5461247 7.756392,1 8.759861,1 9.732111,1 10.6,1.5055827 10.6,3.136007 10.6,4.620163 9.955104,5.4 8.68672,5.4 Z m 0.0553,-2.174164 c 0.449554,0 0.83221,-0.267101 0.83221,-0.772683 0,-0.5031982 -0.355005,-0.8013011 -0.838454,-0.8013011 -0.463826,0 -0.826858,0.2981029 -0.826858,0.7949411 0,0.508763 0.372844,0.779043 0.833102,0.779043 z"
				fill={color}
			/>
			<path
     			d="M 4.6783333,8.5612905 3.8650003,9.3483873 V 1.483871 C 3.8650003,1.2193549 3.6383334,1 3.3650004,1 c -0.273334,0 -0.5,0.2193549 -0.5,0.483871 V 9.3483873 L 2.0516665,8.5612905 c -0.193333,-0.1870968 -0.513333,-0.1870968 -0.706666,0 -0.193334,0.1870968 -0.193334,0.4967742 0,0.683871 l 1.6666659,1.6129025 c 0.04667,0.04516 0.1,0.07742 0.16,0.103226 0.06,0.02581 0.126667,0.03871 0.193334,0.03871 0.06667,0 0.133333,-0.0129 0.193333,-0.03871 0.06,-0.02581 0.113333,-0.05806 0.16,-0.103226 L 5.3850003,9.2451615 c 0.1933329,-0.1870968 0.1933329,-0.4967742 0,-0.683871 -0.193334,-0.1870968 -0.513334,-0.1870968 -0.706667,0 z"
				fill={color}
			/>
		</svg>
	)
}
