import { httpClientGet, httpClientPost } from "./httpClient";

const ENDPOINT = "/products";

// Busca o código do produto na API
export async function getProductByCode(codigo, signal = undefined) {
  return httpClientGet(`${ENDPOINT}/name/${encodeURIComponent(codigo)}`, {
    signal,
  });
}

// Cria um novo produto na API
export async function postProduct(product) {
  return httpClientPost(`${ENDPOINT}`, { body: product });
}
