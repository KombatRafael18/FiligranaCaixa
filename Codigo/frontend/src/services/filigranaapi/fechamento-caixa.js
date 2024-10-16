import { httpClientGet, httpClientPost } from "./httpClient";

const ENDPOINT = "/cash-closure";

export async function getFechamentoCaixaResumoDia(date) {
  return httpClientGet(`${ENDPOINT}/daily-summary/${date}`);
}

export async function postFechamentoCaixaDia(data) {
  return httpClientPost(`${ENDPOINT}/close-day`, { body: data });
}
