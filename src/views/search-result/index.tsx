import type { SearchProps } from "../../context/props";
import type { FSResponse } from "../../context/state/use-search/types";

import React from "react";
import styled from "styled-components";

import { ResultList, Result } from "./components";
import { Pagination } from "../pagination";
import { SearchState, SearchStateDispatchContext } from "../../context/state";

const Section = styled.section`
  .rdt-search__pagination {
    margin-top: 64px;
  }
`;

interface Props {
  currentPage: SearchState["currentPage"];
  ResultBodyComponent: SearchProps["ResultBodyComponent"];
  onClickResult: SearchProps["onClickResult"];
  resultBodyProps: SearchProps["resultBodyProps"];
  searchResult: FSResponse | undefined;
}
export function SearchResult(props: Props) {
  const dispatch = React.useContext(SearchStateDispatchContext);
  if (props.searchResult == null) return null;

  return (
    <Section id="rdt-search__search-result">
      <ResultList>
        {props.searchResult.results.map((hit, i) => (
          <Result key={i} onClick={(ev) => props.onClickResult(hit, ev)}>
            <props.ResultBodyComponent
              {...props.resultBodyProps}
              result={hit}
            />
          </Result>
        ))}
      </ResultList>
      <Pagination
        currentPage={props.currentPage}
        dispatch={dispatch}
        total={props.searchResult.total}
      />
    </Section>
  );
}
