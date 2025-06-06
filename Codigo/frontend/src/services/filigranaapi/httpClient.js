import { API_BASE_URL, defaultHeaders } from "./config";
import { ApiError } from "./errors";

function buildUrl(endpoint) {
  const apiBaseUrl = new URL(API_BASE_URL);
  const apiPathnameNormalized = apiBaseUrl.pathname.endsWith("/")
    ? apiBaseUrl.pathname
    : `${apiBaseUrl.pathname}/`;
  const endpointNormalized = endpoint.startsWith("/")
    ? endpoint.slice(1)
    : endpoint;
  return new URL(`${apiPathnameNormalized}${endpointNormalized}`, apiBaseUrl);
}

export async function httpClient(
  method,
  endpoint,
  { body, ...customConfig } = {}
) {
  const config = {
    method,
    headers: {
      ...defaultHeaders,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    ...customConfig,
  };

  const url = buildUrl(endpoint);
  const response = await fetch(url, config);

  if (!response.ok) {
    const errorBody = await response.json();
    throw new ApiError(
      errorBody?.error || errorBody?.message || "Erro desconhecido",
      errorBody,
      response
    );
  }

  return await response.json();
}

export async function httpClientGet(endpoint, customConfig = {}) {
  return httpClient("GET", endpoint, customConfig);
}

export async function httpClientPost(endpoint, customConfig = {}) {
  return httpClient("POST", endpoint, customConfig);
}
