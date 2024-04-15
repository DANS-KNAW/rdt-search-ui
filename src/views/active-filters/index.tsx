import React from "react";

import { ActiveFilterValue } from "./value";
import { SearchPropsContext } from "../../context/props";

import {
  SearchStateContext,
  SearchStateDispatchContext,
} from "../../context/state";
import { FacetControllersContext } from "../../context/controllers";
import { SaveSearch } from "./save-search/save-search";

import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

export function ActiveFilters() {
  const controllers = React.useContext(FacetControllersContext);
  const { url, uiTexts } = React.useContext(SearchPropsContext);
  const state = React.useContext(SearchStateContext);
  const dispatch = React.useContext(SearchStateDispatchContext);

  const reset = React.useCallback(() => {
    dispatch({ type: "RESET" });
  }, [controllers]);

  const removeFilter = React.useCallback((ev: React.MouseEvent) => {
    dispatch({
      type: "REMOVE_FILTER",
      facetID: ev.currentTarget.getAttribute("data-facet-id")!,
      value: ev.currentTarget.getAttribute("data-value")!,
    });
  }, []);

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6">Active filters</Typography>
      <Stack direction="column" spacing={1}>
        {state.query?.length > 0 && (
          <ActiveFilterItem title="Full text query">
            <ActiveFilterValue
              key="full-text-query"
              removeFilter={() => dispatch({ type: "SET_QUERY", value: "" })}
              title="Full text query"
              value={state.query}
            />
          </ActiveFilterItem>
        )}
        {Array.from(state.facetFilters.entries()).map(([facetID, filter]) => (
          <ActiveFilterItem key={facetID} title={filter.title}>
            {filter.formatted.map((value) => (
              <ActiveFilterValue
                facetID={facetID}
                key={facetID + value}
                removeFilter={removeFilter}
                title={`Facet filter value: ${value}`}
                value={value}
              />
            ))}
          </ActiveFilterItem>
        ))}
        <Stack direction="row" flexWrap="wrap">
          <Button
            variant="contained"
            onClick={reset}
            sx={{ marginBottom: 1, marginRight: 1 }}
          >
            {uiTexts.clearSearch}
          </Button>
          <SaveSearch
            url={url}
            activeFilters={{
              query: state.query,
              filters: state.facetFilters,
            }}
          />
        </Stack>
      </Stack>
    </Paper>
  );
}

interface ItemProps {
  children: React.ReactNode;
  title: string;
}
function ActiveFilterItem({ children, title }: ItemProps) {
  return (
    <Stack direction="row" alignItems="center" flexWrap="wrap">
      <Typography variant="body2" mr={0.5}>
        {title}
      </Typography>
      {children}
    </Stack>
  );
}
