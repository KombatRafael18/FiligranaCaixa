import { httpClientGet } from "./httpClient";

const ENDPOINT = "/dashboard";

export async function getMonthlySummary(month) {
  return httpClientGet(`${ENDPOINT}/monthly-summary/${month}`);
}

export async function getAnnualSummary(year) {
  return httpClientGet(`${ENDPOINT}/annual-summary/${year}`);
}
