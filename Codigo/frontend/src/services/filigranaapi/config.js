export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const defaultHeaders = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

export function getApiBaseUrlWithSlash() {
  // Garantir que a URL tenha um / no final
  return API_BASE_URL.endsWith("/") ? API_BASE_URL : `${API_BASE_URL}/`;
}

export function getApiOrigin() {
  return new URL(API_BASE_URL).origin;
}
