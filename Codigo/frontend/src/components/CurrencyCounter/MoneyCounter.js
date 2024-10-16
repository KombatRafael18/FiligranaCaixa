import { useState } from "react";
import CurrencyCounter from "./CurrencyCounter";

const bills = [
  // "bill200",
  // "bill100",
  // "bill50",
  "bill20",
  "bill10",
  "bill5",
  "bill2",
];

const coins = [
  "coin1Real",
  "coin50",
  "coin25",
  "coin10",
  "coin5",
  // "coin1",
];

const currencyUnits = [...bills, ...coins];

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
    <div className="flex flex-col gap-y-2">
      {currencyUnits.map((denominationName) => (
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
  );
}
