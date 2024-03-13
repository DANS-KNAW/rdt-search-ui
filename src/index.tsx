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

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

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
  }, [props.children]);

  // After children have been set, set the search props.
  // Everytime the props change, the search props will be updated
  React.useEffect(() => {
    if (children == null) return;

    // Extend the search props with default values
    const sp: SearchProps = {
      ...defaultSearchProps,
      ...props,
      url: searchProps?.url || props.endpoints![0].url || "",
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
      <AppLoader searchProps={searchProps} controllers={controllers} setSearchProps={setSearchProps}>
        {children}
      </AppLoader>
    </SearchPropsContext.Provider>
  );
}

interface AppLoaderProps {
  children: React.ReactNode;
  controllers: FacetControllers;
  searchProps: SearchProps;
  setSearchProps: (sp: SearchProps) => void;
}

function AppLoader({ children, controllers, searchProps, setSearchProps }: AppLoaderProps) {
  const [state, dispatch] = React.useReducer(
    searchStateReducer(controllers),
    intialSearchState,
  );

  console.log(state)

  const handleChange = (event: SelectChangeEvent) => {
    setSearchProps({
      ...searchProps,
      url: event.target.value,
    })
  };

  useSearch({
    props: searchProps,
    state,
    dispatch,
    controllers,
  });

  const Component = searchProps.dashboard ? Dashboard : App;

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

  return (
    <FacetControllersContext.Provider value={controllers}>
      <SearchStateDispatchContext.Provider value={dispatch}>
        <SearchStateContext.Provider value={state}>
          
          { // selector for when there are multiple search endpoints
            searchProps.endpoints!.length > 1 &&
            <Stack direction="row" justifyContent="flex-end" alignItems="center" mb={2}>
              <Typography variant="h6" sx={{mr: 2, mb: 0}}>Select your dataset</Typography>
              <FormControl sx={{width: "20rem"}}>
                <InputLabel id="dataset-select-label">Dataset</InputLabel>
                <Select
                  labelId="dataset-select-label"
                  id="dataset-select"
                  value={searchProps.endpoints!.find(ep => ep.url === searchProps.url)!.url}
                  label="Dataset"
                  onChange={handleChange}
                >
                  {searchProps.endpoints!.map( endpoint =>
                    <MenuItem key={endpoint.url} value={endpoint.url}>{endpoint.name}</MenuItem>
                  )}
                </Select>
              </FormControl>
            </Stack>
          }

          {
            state.loading ?
            <Stack justifyContent="center" alignItems="center" sx={{height: "20rem"}}>
              <CircularProgress />
            </Stack> :
            state.error ?
            <Stack justifyContent="center" alignItems="center" sx={{height: "20rem"}}>
              <Stack>
                <Typography variant="h3">Uh oh!</Typography>
                <Typography paragraph>We got an unexpected error: <b>{state.error.message}</b></Typography>
                <Typography paragraph>Please refresh your browser to try again. If the problem persists, contact DANS.</Typography>
              </Stack>
            </Stack> :
            <Component
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
