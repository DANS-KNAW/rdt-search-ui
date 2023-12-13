import type { Payload } from "./request-creator";

const cache = new Map();

export async function fetchSearchResult(url: string, payload: Payload) {
  let fetchResponse: Response;
  let response: any;

  const body = JSON.stringify(payload);
  const encodedCredentials = btoa(
    `${import.meta.env.VITE_ELASTICSEARCH_API_USER}:${
      import.meta.env.VITE_ELASTICSEARCH_API_PASS
    }`,
  );

  if (cache.has(body)) {
    return cache.get(body);
  }

  try {
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
    throw "Failed to fetched Faceted Search state";
  }

  return fetchResponse.status === 200 ? response : null;
}
