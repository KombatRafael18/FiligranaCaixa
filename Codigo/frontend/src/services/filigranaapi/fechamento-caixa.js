import { httpClientGet } from "./httpClient";

const ENDPOINT = "/fechamento-caixa";

export async function getFechamentoCaixaResumoDia(date) {
  return httpClientGet(`${ENDPOINT}/resumo-dia/${date}`);
}
