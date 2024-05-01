import React, { Children, isValidElement } from "react";
import {
  SearchStateContext,
  SearchStateDispatchContext,
  intialSearchState,
} from "./context/state";
import { searchStateReducer } from "./context/state/reducer";
import App from "./app";
import { Dashboard } from "./dashboard";
import {
  SearchProps,
  SearchPropsContext,
  ExternalSearchProps,
  defaultSearchProps,
} from "./context/props";
import {
  FacetControllersContext,
  type FacetControllers,
} from "./context/controllers";
import { useSearch } from "./context/state/use-search";
import type { FacetController } from "./facets/controller";

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import { I18nextProvider } from "react-i18next";
import i18nProvider from "./languages/i18n";
import { useTranslation } from "react-i18next";
import {
  serializeObject,
  deserializeObject,
} from "./views/active-filters/save-search/use-saved-searches";

export function FacetedSearch(props: ExternalSearchProps) {
  const [children, setChildren] = React.useState<React.ReactNode>(undefined);
  const [searchProps, setSearchProps] = React.useState<SearchProps | undefined>(
    undefined,
  );

  React.useEffect(() => {
    // Only set children once
    if (props.children == null || children != null) return;

    const _children =
      // Make sure it is an element and not a string, number, ...
      (
        isValidElement(props.children) &&
        // If children is a fragment, get the children of the fragment
        props.children.type.toString() ===
          Symbol.for("react.fragment").toString()
      ) ?
        props.children.props.children
      : props.children;

    setChildren(_children);
  }, [props.children, props.url]);

  // After children have been set, set the search props.
  // Everytime the props change, the search props will be updated
  React.useEffect(() => {
    if (children == null) return;

    // Extend the search props with default values
    const sp: SearchProps = {
      ...defaultSearchProps,
      ...props,
      url: `${props.url}/_search`,
      style: {
        ...defaultSearchProps.style,
        ...props.style,
      },
    };

    Object.keys(sp.style).forEach((key) => {
      const value = (sp.style as any)[key];
      document.documentElement.style.setProperty(
        `--rdt-${camelCaseToKebabCase(key)}`,
        value,
      );
    });

    setSearchProps(sp);
  }, [props, children]);

  const controllers = useControllers(children);

  if (searchProps == null || controllers.size === 0) return;

  return (
    <SearchPropsContext.Provider value={searchProps}>
      <I18nextProvider i18n={i18nProvider}>
        <AppLoader
          searchProps={searchProps}
          controllers={controllers}
        >
          {children}
        </AppLoader>
      </I18nextProvider>
    </SearchPropsContext.Provider>
  );
}

interface AppLoaderProps {
  children: React.ReactNode;
  controllers: FacetControllers;
  searchProps: SearchProps;
}

function AppLoader({
  children,
  controllers,
  searchProps,
}: AppLoaderProps) {
  // Get the state from session storage
  const storageState = deserializeObject(
    sessionStorage.getItem(
      `rdt-search-state-${window.location.origin}-${searchProps.url}`,
    ) as string,
  );
  const [state, dispatch] = React.useReducer(
    searchStateReducer(controllers),
    // set storageState if available
    { ...intialSearchState, ...storageState },
  );

  useSearch({
    props: searchProps,
    state,
    dispatch,
    controllers,
  });

  const Component = searchProps.dashboard ? Dashboard : App;
  const { t } = useTranslation("app");

  React.useEffect(() => {
    if (!controllers.size) return;
    const facetStates = new Map();
    for (const [id, controller] of controllers.entries()) {
      facetStates.set(id, controller.initState());
    }

    dispatch({
      type: "SET_FACET_STATES",
      facetStates,
    });
  }, [controllers]);

  React.useEffect(() => {
    // Save to session storage on state change, to retrieve when component is remounted
    sessionStorage.setItem(
      `rdt-search-state-${window.location.origin}-${searchProps.url}`,
      serializeObject({
        facetFilters: state.facetFilters,
        query: state.query,
      }),
    );
  }, [state.facetFilters, state.query]);

  return (
    <FacetControllersContext.Provider value={controllers}>
      <SearchStateDispatchContext.Provider value={dispatch}>
        <SearchStateContext.Provider value={state}>
          {state.loading && (
            <LinearProgress
              sx={{
                position: "fixed",
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 100,
              }}
            />
          )}
          {
            state.error ?
              <Stack
                justifyContent="center"
                alignItems="center"
                sx={{ height: "20rem" }}
              >
                <Stack>
                  <Typography variant="h3">{t("error.header")}</Typography>
                  <Typography paragraph>
                    {t("error.p1", { message: state.error.message })}
                  </Typography>
                  <Typography paragraph>{t("error.p2")}</Typography>
                </Stack>
              </Stack>
              // no error, show components
            : <Component
                controllers={controllers}
                searchProps={searchProps}
                searchState={state}
              >
                {children}
              </Component>

          }
        </SearchStateContext.Provider>
      </SearchStateDispatchContext.Provider>
    </FacetControllersContext.Provider>
  );
}

/**
 * Initializes and returns a map of facet controllers based on the `children` prop.
 */
function useControllers(children: React.ReactNode): FacetControllers {
  const [controllers, setControllers] = React.useState<FacetControllers>(
    new Map(),
  );

  React.useEffect(() => {
    if (children == null || controllers.size > 0) return;

    // Initialise the facet controllers
    const facets = Children.map(
      children,
      (child: any) => new child.type.controller(child.props.config),
    );

    setControllers(
      new Map(facets.map((f: FacetController<any, any, any>) => [f.ID, f])),
    );
  }, [children, controllers]);

  return controllers;
}

/**
 * Converts a string from camelCase to kebab-case.
 * @example camelCaseToKebabCase('camelCase') => 'camel-case'
 */
function camelCaseToKebabCase(str: string) {
  return str.replace(/([A-Z])/g, "-$1").toLowerCase();
}
