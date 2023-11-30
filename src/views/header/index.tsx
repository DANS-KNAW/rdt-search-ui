import type { FSResponse } from "../../context/state/use-search/types";

import React from "react";

import { Pagination } from "../pagination";
import { ResultCount } from "./result-count";

import { SearchState, SearchStateDispatchContext } from "../../context/state";
import { SortBy } from "./result-count/order-by";
import { LoadSearch } from "../active-filters/save-search/load-search";
import { SearchPropsContext } from "../../context/props";

import styles from "./index.module.css";

interface Props {
  currentPage: SearchState["currentPage"];
  searchResult: FSResponse | undefined;
  sortOrder: SearchState["sortOrder"];
}
export const ResultHeader = function Header(props: Props) {
  const { url } = React.useContext(SearchPropsContext);
  const dispatch = React.useContext(SearchStateDispatchContext);
  if (props.searchResult == null) return null;

  return (
    <header className={styles.header} id='rdt-search__result-header'>
      <ResultCount
        currentPage={props.currentPage}
        searchResult={props.searchResult}
      />
      <div className={styles.buttons}>
        <SortBy sortOrder={props.sortOrder} />
        <LoadSearch url={url} />
      </div>
      <Pagination
        currentPage={props.currentPage}
        dispatch={dispatch}
        total={props.searchResult.total}
      />
    </header>
  );
};
