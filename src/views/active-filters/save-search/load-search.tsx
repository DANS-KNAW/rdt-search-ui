import React from "react";
import { DropDown } from "../../ui/drop-down";
import { SearchProps } from "../../../context/props";
import { SearchStateDispatchContext } from "../../../context/state";
import { SavedSearch, useSavedSearches } from "./use-saved-searches";
import Stack from '@mui/material/Stack';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';

export function LoadSearch(props: { url: SearchProps["url"] }) {
  const [savedSearches] = useSavedSearches(props.url);

  if (savedSearches.length === 0) return null;

  return (
    <DropDown label="Load search">
      <LoadSearches savedSearches={savedSearches} />
    </DropDown>
  );
}

const LoadSearches = (props: { savedSearches: SavedSearch[] }) => {
  const dispatch = React.useContext(SearchStateDispatchContext);

  return (
        props.savedSearches.map((savedSearch, i) => (
          <MenuItem
            key={i}
            onClick={() => {
              dispatch({
                type: "LOAD_SEARCH",
                filters: savedSearch.filters,
                query: savedSearch.query,
              });
            }}
          >
            <Stack direction="row" justifyContent="center" sx={{flex: 1, width: "100%"}} spacing={2}>
              <ListItemText sx={{flex: 2}}>{savedSearch.name || savedSearch.hash}</ListItemText>
              <ListItemText sx={{flex: 1, textAlign: "right", color: "neutral.dark"}}>{dateString(savedSearch.date)}</ListItemText>
            </Stack>
          </MenuItem>
        ))

  );
};

// Show date without time
function dateString(date: string) {
  return date.slice(0, (/\d\d\d\d/.exec(date)?.index || 0) + 4);
}
