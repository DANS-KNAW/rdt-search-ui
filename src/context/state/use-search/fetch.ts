import type { Payload } from "./request-creator";
import { enqueueSnackbar } from "notistack";
import type { Endpoints } from "../../props";

const cache = new Map();

export async function fetchSearchResult(url: string, payload: Payload, dispatch: any, endpoints?: Endpoints[]) {
  let fetchResponse: Response;
  let response: any;

  const currentEndpoint = endpoints && endpoints.find( ep => ep.url === url );

  const body = JSON.stringify(payload);
  const encodedCredentials = currentEndpoint?.user ? btoa(`${currentEndpoint?.user}:${currentEndpoint?.pass}`) : null;

  if (cache.has(body)) {
    return cache.get(body);
  }

  try {
    // set loading state and remove error
    dispatch({
      type: "SET_LOADING",
      loading: true,
    });
    dispatch({
      type: "SET_ERROR",
      error: undefined,
    });
    fetchResponse = await fetch(url, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${encodedCredentials}`,
      },
      body: JSON.stringify(payload),
    });
    response = await fetchResponse.json();
    cache.set(body, response);
  } catch (err) {
    console.log(err)
    enqueueSnackbar("Dashboard and Search error: failed to fetch data.", {
      variant: "error",
    });
    dispatch({
      type: "SET_ERROR",
      error: err,
    });
    dispatch({
      type: "SET_LOADING",
      loading: false,
    });
    throw "Failed to fetch Faceted Search state";
  }

  dispatch({
    type: "SET_LOADING",
    loading: false,
  });

  return fetchResponse.status === 200 ? response : null;
}
