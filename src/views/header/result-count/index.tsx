import type { SearchState } from "../../../context/state";
import type { FSResponse } from "../../../context/state/use-search/types";

import React from "react";

import { SearchPropsContext } from "../../../context/props";
import Typography from '@mui/material/Typography';

interface Props {
  currentPage: SearchState["currentPage"];
  searchResult: FSResponse;
}
export function ResultCount(props: Props) {
  const { resultsPerPage, uiTexts } = React.useContext(SearchPropsContext);
  const [fromTo, setFromTo] = React.useState<[number, number]>();

  React.useEffect(() => {
    let nextFrom = (props.currentPage - 1) * resultsPerPage + 1;
    if (nextFrom > props.searchResult.total)
      nextFrom = props.searchResult.total;

    let nextTo = nextFrom + resultsPerPage - 1;
    if (nextTo > props.searchResult.total) nextTo = props.searchResult.total;

    setFromTo([nextFrom, nextTo]);
  }, [props.currentPage, resultsPerPage, props.searchResult.total]);

  if (fromTo == null) return null;

  const fromToOf =
    props.searchResult.total >= resultsPerPage
      ? `${fromTo[0]} - ${fromTo[1]} 
		   ${uiTexts.of}`
      : "";

  const content = `
		${fromToOf}
		${props.searchResult.total} 
		${props.searchResult.total === 1 ? uiTexts.result : uiTexts.results}
	`;

  return <Typography>{content}</Typography>;
}
