import type { SearchHighlight } from "@elastic/elasticsearch/lib/api/types";

import React from "react";
import { ResultBodyProps, SortOrder } from "../state/use-search/types";
import { UITexts, uiTexts } from "./ui-texts";

export interface DashboardProps {
  rows?: number;
  columns?: number;

  /*
   * Define grid areas in the config to use the grid area layout.
   * The areas depend on user defined facet IDs. If dashboard.areas
   * is defined, the facet container will have grid-area: facet.ID in the
   * style tag.
   *
   * TODO all the facets should be defined in the area, otherwise it messes
   * up the layout. Maybe we should add a default area for facets that are
   * not defined in the areas array.
   */
  areas?: string[];
}

export interface StyleProps {
  // Set the background color of the active page number in the Pagination component
  buttonBackground?: string;

  // Set the general background color
  background?: string;

  // Set the spot color, used to attract attention to interactive elements
  spotColor?: string;
}

/**
 * Required SearchProps
 */
interface RequiredSearchProps {
  ResultBodyComponent: React.FC<ResultBodyProps>;
  url: string;
  children: React.ReactNode;
}

/**
 * Optional SearchProps with defaults
 */
interface OptionalWithDefaultsSearchProps {
  autoSuggest?: (query: string) => Promise<string[]>;
  excludeResultFields?: string[];
  onClickResult?: (
    result: any,
    ev: React.MouseEvent<HTMLButtonElement>,
  ) => void;
  resultFields?: string[];
  resultBodyProps?: Record<string, any>;
  resultsPerPage?: number;
  track_total_hits?: number | boolean;
  sortOrder?: SortOrder;

  // TODO rename to theme? style is a React attribute
  //		or not necessary, because replacing with CSS?
  style?: StyleProps;
  uiTexts?: UITexts;
}

/**
 * Optional SearchProps without defaults (can be undefined)
 */
interface OptionalSearchProps {
  className?: string /* className prop is used by StyledComponents */;
  dashboard?: DashboardProps;

  // Fields to search full text. The field names are passed to
  // ElasticSearch so boosters can be applied to the fields.
  // ie: ['title^3', 'description^2', 'body']
  fullTextFields?: string[];

  // Set the ES highlight directly from the config,
  // gives more finegrained control over returned snippets
  fullTextHighlight?: SearchHighlight;

  SearchHomeComponent?: React.FC<any>;
  endpoints?: Endpoints[];
}

// Endpoints for search/endpoint urls and names
export interface Endpoints {
  name: string;
  url: string;
  user?: string;
  pass?: string;
}

/**
 * External props, added to component declaration
 */
export type ExternalSearchProps = Omit<RequiredSearchProps, "url"> &
  OptionalWithDefaultsSearchProps &
  OptionalSearchProps;

/**
 * Internal props = external props + defaults
 */
export type SearchProps = Required<
  RequiredSearchProps & OptionalWithDefaultsSearchProps
> &
  OptionalSearchProps & {
    style: Required<StyleProps>;
  };

export const defaultSearchProps: SearchProps = {
  /**
   * These defaults will never be used, because these props are required and
   * therefor always overriden by the user props
   */
  children: null,
  ResultBodyComponent: () => null,
  url: "",

  autoSuggest: async function autoSuggest(query: string) {
    console.log("[RDT-SEARCH-UI] autoSuggest:", query);
    return [];
  },
  excludeResultFields: [],
  onClickResult: (result) => {
    console.log("[RDT-SEARCH-UI] onClickResult:", result);
  },
  resultBodyProps: {},
  resultFields: [],
  resultsPerPage: 20,
  sortOrder: new Map(),
  style: {
    background: "#FFFFFF",
    spotColor: "#0088CC",
    buttonBackground: "#F6F6F6",
  },
  track_total_hits: true,
  uiTexts: uiTexts,
};

export const SearchPropsContext =
  React.createContext<SearchProps>(defaultSearchProps);
