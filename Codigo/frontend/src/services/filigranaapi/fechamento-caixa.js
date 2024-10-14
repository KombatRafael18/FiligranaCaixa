import { httpClientGet, httpClientPost } from "./httpClient";

const ENDPOINT = "/fechamento-caixa";

export async function getFechamentoCaixaResumoDia(date) {
  // return httpClientGet(`${ENDPOINT}/resumo-dia/${date}`);

  return {
    payments: [
      { paymentMethod: "Dinheiro", amount: 1439.5 },
      { paymentMethod: "Pix", amount: 180.0 },
      { paymentMethod: "Qr pix", amount: 330.0 },
      { paymentMethod: "Débito", amount: 210.0 },
      { paymentMethod: "Credito", amount: 2200.0 },
      { paymentMethod: "Promissoria", amount: 720.0 },
    ],
    previousDayCashBalance: 0,
  };
}

export async function postFechamentoCaixaDia(date, data) {
  return httpClientPost(`${ENDPOINT}/fechamento-dia/${date}`, data);
}
