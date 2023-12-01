import React from "react";
import md5 from "md5";
import { DropDown } from "../../ui/drop-down";
import { SearchProps } from "../../../context/props";
import { SearchState } from "../../../context/state";
import { serializeObject, useSavedSearches } from "./use-saved-searches";

import styles from "./save-search.module.css";
import buttonStyle from "../../ui/button.module.css";
import inputStyle from "../../ui/input.module.css";

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

  if (savedSearch) {
    return (
      <div style={{ lineHeight: "36px" }}>
        <em style={{ marginTop: "1rem" }}>
          Saved as "{savedSearch.name || savedSearch.hash}"
        </em>
      </div>
    );
  }

  return (
    <DropDown caret label="Save search" right>
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
    <div className={styles.wrapper}>
      <h3>Search name</h3>
      <div className={styles.inputWrapper}>
        <input
          className={inputStyle.input}
          onChange={(ev) => setName(ev.currentTarget.value)}
          onKeyDown={(ev) => {
            if (ev.key === "Enter") save();
          }}
          placeholder={props.hash}
          type="text"
          value={name || ""}
        />
        <button className={buttonStyle.button} onClick={save}>
          Save
        </button>
      </div>
    </div>
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
