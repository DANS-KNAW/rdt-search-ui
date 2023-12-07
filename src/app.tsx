import React from "react";
import { ResultHeader } from "./views/header";
import { SearchResult } from "./views/search-result";
import { FullTextSearch } from "./views/full-text-search";
import { ActiveFilters } from "./views/active-filters";

import { SearchProps } from "./context/props";
import { SearchState } from "./context/state";
import { Facets } from "./facets";
import { FacetControllers } from "./context/controllers";

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';

/* This is the wrapper for the search interface */

interface Props {
  children: React.ReactNode;
  controllers: FacetControllers;
  searchProps: SearchProps;
  searchState: SearchState;
}

export default function FacetedSearch({
  children,
  controllers,
  searchProps,
  searchState,
}: Props) {

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid xs={4} sx={{ display: "flex", alignItems: "flex-end" }}>
          <FullTextSearch />
        </Grid>
        <Grid xs={8}>
          <ResultHeader
            currentPage={searchState.currentPage}
            searchResult={searchState.searchResult}
            sortOrder={searchState.sortOrder}
          />
        </Grid>
        <Grid xs={4}>
          {(searchState.query || searchState.facetFilters.entries().next().value) && <ActiveFilters /> }
          <Facets
            controllers={controllers}
            searchProps={searchProps}
            searchState={searchState}
          >
            {children}
          </Facets>
        </Grid>
        <Grid xs={8}>
          <SearchResult
            currentPage={searchState.currentPage}
            ResultBodyComponent={searchProps.ResultBodyComponent}
            onClickResult={searchProps.onClickResult}
            resultBodyProps={searchProps.resultBodyProps}
            searchResult={searchState.searchResult}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
