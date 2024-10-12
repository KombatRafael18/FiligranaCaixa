import { useState } from "react";
import CurrencyCounter from "./CurrencyCounter";

const bills = [
  "BILL_2",
  "BILL_5",
  "BILL_10",
  "BILL_20",
  "BILL_50",
  "BILL_100",
  "BILL_200",
];

const coins = [
  "COIN_1",
  "COIN_5",
  "COIN_10",
  "COIN_25",
  "COIN_50",
  "COIN_1_REAL",
];

// TODO: Cria módulo de formatação de moeda
const intlCurrency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export default function MoneyCounter({ moneyCounter, setMoneyCounter }) {
  const sum = Object.values(moneyCounter).reduce(
    (acc, value) => acc + value.total,
    0
  );

  function handleCounterValueChange(denominationName, cv, tv) {
    setMoneyCounter((mc) => ({
      ...mc,
      [denominationName]: {
        count: cv,
        total: tv,
      },
    }));
  }

  return (
    <div className="flex gap-x-8">
      <div className="flex flex-col gap-y-2">
        {bills.map((denominationName) => (
          <CurrencyCounter
            key={denominationName}
            denominationName={denominationName}
            counterValue={moneyCounter[denominationName].count}
            onCounterValueChange={(cv, tv) =>
              handleCounterValueChange(denominationName, cv, tv)
            }
          />
        ))}
      </div>
      <div className="flex flex-col gap-y-2">
        {coins.map((denominationName) => (
          <CurrencyCounter
            key={denominationName}
            denominationName={denominationName}
            counterValue={moneyCounter[denominationName].count}
            onCounterValueChange={(cv, tv) =>
              handleCounterValueChange(denominationName, cv, tv)
            }
          />
        ))}
        Total: {intlCurrency.format(sum)}
      </div>
    </div>
  );
}
