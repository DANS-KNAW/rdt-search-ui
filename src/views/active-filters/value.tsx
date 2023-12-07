import type { MouseEvent } from "react";
import Chip from '@mui/material/Chip';

export function ActiveFilterValue(props: {
  facetID?: string;
  removeFilter: (ev: MouseEvent) => void;
  title: string;
  value: string;
}) {
  return (
    <Chip
      data-facet-id={props.facetID}
      data-value={props.value}
      onClick={props.removeFilter}
      onDelete={props.removeFilter}
      label={props.value}
      size="small"
      sx={{mb: 0.5, mr: 0.5}}
    />
  );
}
