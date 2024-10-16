const brazilianCurrencyNumberFormat = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function formatBrazilianCurrency(value) {
  return brazilianCurrencyNumberFormat.format(value);
}
