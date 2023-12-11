import React from "react";

import { DropDown } from "../../../ui/drop-down";
import OrderOption from "./option";

import { SearchPropsContext } from "../../../../context/props";
import { FacetControllersContext } from "../../../../context/controllers";
import { SortOrder } from "../../../../context/state/use-search/types";

interface Props {
  sortOrder: SortOrder;
}
export const SortBy = React.memo(function SortBy(props: Props) {
  const controllers = React.useContext(FacetControllersContext);
  const { uiTexts } = React.useContext(SearchPropsContext);

  const label =
    props.sortOrder.size > 0
      ? `${uiTexts.sort_by} (${props.sortOrder.size})`
      : uiTexts.sort_by;

  return (
    <DropDown label={label}>
      {Array.from(controllers.values()).map((facet) => (
        <OrderOption facet={facet} key={facet.ID} sortOrder={props.sortOrder} />
      ))}
    </DropDown>
  );
});
