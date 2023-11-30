export interface UITexts {
  active: string;
  clearSearch: string;
  document: string;
  documents: string;
  fullTextSearchHelp: string;
  highest_first: string;
  list_facet_filter: string;
  list_facet_order: string;
  lowest_first: string;
  of: string;
  range_from: string;
  range_to: string;
  result: string;
  results: string;
  search_documents: string;
  set_range: string;
  sort_by: string;
  view_more: string;
  view_less: string;
}

export const uiTexts: UITexts = {
  active: "active",
  clearSearch: "Clear search",
  document: "document",
  documents: "documents",
  fullTextSearchHelp: "Search for words in the full text of the documents",
  of: "of",
  result: "result",
  results: "results",
  search_documents: "Search documents",
  sort_by: "Sort by",
  view_more: "More",
  view_less: "Less",

  // Range facet
  set_range: "Set range",
  range_from: "From",
  range_to: "To",

  // List facet
  list_facet_filter: "Filter",
  list_facet_order: "Order",
  lowest_first: "Lowest first",
  highest_first: "Highest first",
};
