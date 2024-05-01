import React from "react";
import md5 from "md5";
import { DropDown } from "../../ui/drop-down";
import { SearchProps } from "../../../context/props";
import { SearchState } from "../../../context/state";
import { serializeObject, useSavedSearches } from "./use-saved-searches";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useTranslation } from "react-i18next";

export interface SearchFilters {
  filters: SearchState["facetFilters"];
  query: string;
}

export function SaveSearch(props: {
  url: SearchProps["url"];
  activeFilters: SearchFilters;
}) {
  const [savedSearches, saveSearch] = useSavedSearches(props.url);
  const hash = useHash(props.activeFilters);

  const savedSearch = savedSearches.find((ss) => ss.hash === hash);
  const { t } = useTranslation("views");

  if (savedSearch) {
    return (
      <Typography variant="body2" mt={1} sx={{ color: "neutral.dark" }}>
        {t("savedAs", { value: savedSearch.name || savedSearch.hash })}
      </Typography>
    );
  }

  return (
    <DropDown label={t("saveSearch")}>
      <SavedSearches
        activeFilters={props.activeFilters}
        hash={hash}
        savedSearches={savedSearches}
        saveSearch={saveSearch}
      />
    </DropDown>
  );
}

const SavedSearches = (props: {
  activeFilters: SearchFilters;
  hash: string | undefined;
  savedSearches: ReturnType<typeof useSavedSearches>[0];
  saveSearch: ReturnType<typeof useSavedSearches>[1];
}) => {
  const [name, setName] = React.useState<string>();
  const { t } = useTranslation("views");

  const save = React.useCallback(async () => {
    if (props.hash == null) return;

    props.saveSearch({
      name,
      hash: props.hash,
      date: new Date().toUTCString(),
      ...props.activeFilters,
    });
  }, [name, props.hash, props.activeFilters]);

  if (props.hash == null) return null;

  return (
    <Box p={2}>
      <Typography variant="h6">{t("saveSearchAs")}</Typography>
      <Stack direction="row" spacing={1} mt={2}>
        <TextField
          onChange={(ev) => setName(ev.currentTarget.value)}
          onKeyDown={(ev) => {
            if (ev.key === "Enter") save();
          }}
          label={t("enterName")}
          placeholder={props.hash}
          type="text"
          value={name || ""}
          InputLabelProps={{ shrink: true }}
          fullWidth
          size="small"
        />
        <Button variant="contained" onClick={save}>
          Save
        </Button>
      </Stack>
    </Box>
  );
};

function useHash(activeFilters: SearchFilters | undefined) {
  const [hash, setHash] = React.useState<string>();

  React.useEffect(() => {
    if (activeFilters == null) return;
    const activeFilterString = serializeObject(activeFilters);
    const hash = md5(activeFilterString);
    setHash(hash);
  }, [activeFilters]);

  return hash;
}
