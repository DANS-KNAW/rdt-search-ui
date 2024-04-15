import type {
  BaseFacetConfig,
  BaseFacetState,
  FacetFilter,
} from "../context/state/facets";
import React from "react";
import { FacetController } from "./controller";
import { FacetsDataReducerAction } from "../context/state/actions";
import { HelpDropDown } from "../views/ui/drop-down/help";
import { SearchPropsContext } from "../context/props";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

interface Props<
  FacetConfig extends BaseFacetConfig,
  FacetState extends BaseFacetState,
  Filter extends FacetFilter,
> {
  children: React.ReactNode;
  dispatch: React.Dispatch<FacetsDataReducerAction>;
  facet: FacetController<FacetConfig, FacetState, Filter>;
  facetState: FacetState;
  filter: Filter;
  values: any;
  className?: string;
}
function FacetWrapper<
  FacetConfig extends BaseFacetConfig,
  FacetState extends BaseFacetState,
  Filter extends FacetFilter,
>(props: Props<FacetConfig, FacetState, Filter>) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Typography variant="h5">
          {props.facet.config.title}
          {props.facetState.collapse && (
            <ActiveIndicator<Filter> filter={props.filter} />
          )}
        </Typography>
        <HelpDropDown>{props.facet.config.description}</HelpDropDown>
        {props.children}
      </CardContent>
    </Card>
  );
}

export default React.memo(FacetWrapper);

// TODO handle different kinds of filters (like MapFacetFilter)
function ActiveIndicator<FacetFilter>(props: {
  filter: FacetFilter | undefined;
}) {
  const { uiTexts } = React.useContext(SearchPropsContext);

  if (props.filter == null) return null;
  const size = props.filter != null ? 1 : 0;

  if (size === 0) return null;

  return (
    <small>
      {size} {uiTexts.active}
    </small>
  );
}
