import { httpClientGet } from "./httpClient";

const ENDPOINT = "/dashboard";

export async function getMonthlySummary(month) {
  return httpClientGet(`${ENDPOINT}/monthly-summary/${month}`);
}

export async function getAnnualSummary(year) {
  // return httpClientGet(`${ENDPOINT}/annual-summary/${year}`);

  await new Promise((resolve) => setTimeout(resolve, 1500));

  const y = 2024;
  return {
    year: y.toString(),
    totalSales: 2,
    totalSalesAmount: 54.68,
    salesByMonths: Array.from({ length: 12 }, (_, i) => ({
      month: `${y}-${(i + 1).toString().padStart(2, "0")}`,
      totalAmount: Math.floor(Math.random() * 1000),
    })),
    salesByType: [
      {
        saleType: "Varejo",
        count: 1,
      },
      {
        saleType: "Atacado",
        count: 1,
      },
    ],
    salesByPaymentMethod: [
      {
        paymentMethod: "Dinheiro",
        count: 1,
      },
      {
        paymentMethod: "Pix",
        count: 1,
      },
    ],
  };
}
