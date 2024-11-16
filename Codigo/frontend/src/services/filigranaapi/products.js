import { httpClientGet, httpClientPost } from "./httpClient";

const ENDPOINT = "/products";

// Busca o código do produto na API
export async function getProductByCode(codigo) {
  return httpClientGet(`${ENDPOINT}/name/${encodeURIComponent(codigo)}`);
}

// Cria um novo produto na API
export async function postProduct(product) {
  return httpClientPost(`${ENDPOINT}`, { body: product });
}
