import type { SearchProps } from "../context/props";
import { SearchStateDispatchContext, type SearchState } from "../context/state";
import type { FacetControllers } from "../context/controllers";

import React, { Children, isValidElement } from "react";
import Grid from "@mui/material/Unstable_Grid2";

interface Props {
  facetClassname?: string;
  children: React.ReactNode;
  controllers: FacetControllers;
  searchProps?: SearchProps;
  searchState: SearchState;
  layout?: string;
}

export const Facets = ({
  children,
  controllers,
  searchState,
  layout,
}: Props) => {
  const dispatch = React.useContext(SearchStateDispatchContext);
  if (searchState.facetStates.size === 0) return null;

  const facets =
    Children.map(children, (child, index) => {
      if (!isValidElement(child)) return;
      return Array.from(controllers.values(), (x) => ({
        facet: x,
        type: child.type,
      }))[index];
    }) || [];

  const sidebarFacet = facets.find((f) => f.facet.ID === "indi");
  const mainFacets = facets.filter(
    (f) =>
      f.facet.ID === "date" || f.facet.ID === "rights" || f.facet.ID === "lang",
  );
  const minorFacets = facets.filter(
    (f) =>
      f.facet.ID === "pw" ||
      f.facet.ID === "wf" ||
      f.facet.ID === "reltype" ||
      f.facet.ID === "restype",
  );

  const dashboard = layout === "dashboard";

  return (
    <Grid container spacing={2}>
      <Grid
        xs={12}
        sm={dashboard ? 5 : 12}
        md={dashboard ? 4 : 12}
        lg={dashboard ? 3 : 12}
      >
        {sidebarFacet && (
          <sidebarFacet.type
            dispatch={dispatch}
            facet={sidebarFacet.facet}
            facetState={searchState.facetStates.get(sidebarFacet.facet.ID)!}
            filter={searchState.facetFilters.get(sidebarFacet.facet.ID)?.value}
            values={searchState.facetValues[sidebarFacet.facet.ID]}
          />
        )}
      </Grid>
      <Grid
        xs={12}
        sm={dashboard ? 7 : 12}
        md={dashboard ? 8 : 12}
        lg={dashboard ? 9 : 12}
        container
      >
        {mainFacets.map((f) => (
          <Grid
            key={f.facet.ID}
            xs={12}
            sm={f.facet.ID !== "date" && dashboard ? 6 : 12}
          >
            <f.type
              key={f.facet.ID}
              dispatch={dispatch}
              facet={f.facet}
              facetState={searchState.facetStates.get(f.facet.ID)!}
              filter={searchState.facetFilters.get(f.facet.ID)?.value}
              values={searchState.facetValues[f.facet.ID]}
            />
          </Grid>
        ))}
      </Grid>
      {minorFacets.map((f) => (
        <Grid
          key={f.facet.ID}
          xs={12}
          sm={dashboard ? 6 : 12}
          lg={dashboard ? 3 : 12}
        >
          <f.type
            key={f.facet.ID}
            dispatch={dispatch}
            facet={f.facet}
            facetState={searchState.facetStates.get(f.facet.ID)!}
            filter={searchState.facetFilters.get(f.facet.ID)?.value}
            values={searchState.facetValues[f.facet.ID]}
          />
        </Grid>
      ))}
    </Grid>
  );
};
