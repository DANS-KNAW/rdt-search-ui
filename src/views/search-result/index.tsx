import type { SearchProps } from "../../context/props";
import type { FSResponse } from "../../context/state/use-search/types";

import React from "react";
import { Pagination } from "../pagination";
import { SearchState, SearchStateDispatchContext } from "../../context/state";

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';

/* Layout for content is defined in the app and passed as props to this component */

interface Props {
  currentPage: SearchState["currentPage"];
  ResultBodyComponent: SearchProps["ResultBodyComponent"];
  onClickResult: SearchProps["onClickResult"];
  resultBodyProps: SearchProps["resultBodyProps"];
  searchResult: FSResponse | undefined;
}
export function SearchResult(props: Props) {
  const dispatch = React.useContext(SearchStateDispatchContext);
  if (props.searchResult == null) return null;

  return (
    <>
      {props.searchResult.results.map((hit, i) => (
        <Card key={i} sx={{marginBottom: 2}}>
          <CardContent>
            <props.ResultBodyComponent
              {...props.resultBodyProps}
              result={hit}
            />
          </CardContent>
          <CardActions>
            <Button 
              size="small" 
              onClick={(ev) => props.onClickResult(hit, ev)} 
            >
              Detailed view
            </Button>
          </CardActions>
        </Card>
      ))}
      <Stack display="flex" alignItems="center">
        <Pagination
          currentPage={props.currentPage}
          dispatch={dispatch}
          total={props.searchResult.total}
        />
      </Stack>
    </>
  );
}
