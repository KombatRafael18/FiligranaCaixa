import React from "react";

// Imagens das cédulas e moedas
import bill100 from "./assets/currency-images/100_back.jpg";
import bill10 from "./assets/currency-images/10_back.jpg";
import bill200 from "./assets/currency-images/200_back.jpg";
import bill20 from "./assets/currency-images/20_back.jpg";
import bill2 from "./assets/currency-images/2_back.jpg";
import bill50 from "./assets/currency-images/50_back.jpg";
import bill5 from "./assets/currency-images/5_back.jpg";
import coin1 from "./assets/currency-images/moeda-1-centavo.png";
import coin1real from "./assets/currency-images/moeda-1-real.png";
import coin10 from "./assets/currency-images/moeda-10-centavos.png";
import coin25 from "./assets/currency-images/moeda-25-centavos.png";
import coin5 from "./assets/currency-images/moeda-5-centavos.png";
import coin50 from "./assets/currency-images/moeda-50-centavos.png";

const currencyImages = {
  bill2: {
    image: bill2,
    value: 2.0,
    type: "BILL",
  },
  bill5: {
    image: bill5,
    value: 5.0,
    type: "BILL",
  },
  bill10: {
    image: bill10,
    value: 10.0,
    type: "BILL",
  },
  bill20: {
    image: bill20,
    value: 20.0,
    type: "BILL",
  },
  bill50: {
    image: bill50,
    value: 50.0,
    type: "BILL",
  },
  bill100: {
    image: bill100,
    value: 100.0,
    type: "BILL",
  },
  bill200: {
    image: bill200,
    value: 200.0,
    type: "BILL",
  },
  coin1: {
    image: coin1,
    value: 0.01,
    type: "COIN",
  },
  coin5: {
    image: coin5,
    value: 0.05,
    type: "COIN",
  },
  coin10: {
    image: coin10,
    value: 0.1,
    type: "COIN",
  },
  coin25: {
    image: coin25,
    value: 0.25,
    type: "COIN",
  },
  coin50: {
    image: coin50,
    value: 0.5,
    type: "COIN",
  },
  coin1real: {
    image: coin1real,
    value: 1.0,
    type: "COIN",
  },
};

const intlCurrency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function getCurrencyByName(currencyName) {
  const cNameNorm = currencyName.toLowerCase().replaceAll("_", "");
  const cImg = currencyImages[cNameNorm];
  if (!cImg) {
    throw new Error(`Imagem não encontrada para a moeda ${currencyName}`);
  }
  return cImg;
}

function ButtonSmall({ children, ...props }) {
  return (
    <button
      className="inline-flex justify-center items-center py-1 px-2 border border-solid border-current rounded"
      {...props}
    >
      {children}
    </button>
  );
}

export default function CurrencyCounter({
  denominationName,
  counterValue,
  onCounterValueChange,
}) {
  const currencyData = getCurrencyByName(denominationName);
  const currencyImage = currencyData.image;
  const totalValue = currencyData.value * (counterValue || 0);

  function handleDecrement() {
    const v = counterValue;
    const newV = v - 1 >= 0 ? v - 1 : 0;
    const newTotal = currencyData.value * newV;
    onCounterValueChange(newV, newTotal);
  }

  function handleIncrement() {
    const v = counterValue;
    const newV = v + 1;
    const newTotal = currencyData.value * newV;
    onCounterValueChange(newV, newTotal);
  }

  function handleCounterChange(event) {
    const newValue = Number(event.target.value);
    const newTotal = currencyData.value * newValue;
    onCounterValueChange(newValue, newTotal);
  }

  return (
    <div className="flex items-center gap-2">
      <img
        className="w-20 h-10 object-contain flex-none"
        src={currencyImage}
        alt={denominationName}
      />
      {"×"}
      <ButtonSmall type="button" onClick={handleDecrement} tabIndex="-1">
        {"−"}
      </ButtonSmall>
      <input
        className="py-1 px-2 w-16 text-center bg-transparent border border-solid border-inherit rounded no-spinner"
        title="Quantidade"
        type="number"
        min="0"
        inputMode="numeric"
        value={counterValue?.toString()}
        onChange={handleCounterChange}
      />
      <ButtonSmall type="button" onClick={handleIncrement} tabIndex="-1">
        {"+"}
      </ButtonSmall>
      {"="}
      <span className="inline-block min-w-24 flex-none">
        {intlCurrency.format(totalValue)}
      </span>
    </div>
  );
}
