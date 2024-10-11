import React, { useEffect } from "react";

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
  },
  bill5: {
    image: bill5,
    value: 5.0,
  },
  bill10: {
    image: bill10,
    value: 10.0,
  },
  bill20: {
    image: bill20,
    value: 20.0,
  },
  bill50: {
    image: bill50,
    value: 50.0,
  },
  bill100: {
    image: bill100,
    value: 100.0,
  },
  bill200: {
    image: bill200,
    value: 200.0,
  },
  coin1: {
    image: coin1,
    value: 0.01,
  },
  coin5: {
    image: coin5,
    value: 0.05,
  },
  coin10: {
    image: coin10,
    value: 0.1,
  },
  coin25: {
    image: coin25,
    value: 0.25,
  },
  coin50: {
    image: coin50,
    value: 0.5,
  },
  coin1real: {
    image: coin1real,
    value: 1.0,
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

export default function CurrencyCounter({
  denominationName,
  counterValue,
  onCounterValueChange,
  onTotalValueChange,
}) {
  const currencyData = getCurrencyByName(denominationName);
  const currencyImage = currencyData.image;
  const totalValue = currencyData.value * (counterValue || 0);

  function handleDecrement() {
    onCounterValueChange((v) => (v - 1 >= 0 ? v - 1 : 0));
  }

  function handleIncrement() {
    onCounterValueChange((v) => v + 1);
  }

  function handleCounterChange(event) {
    const newValue = Number(event.target.value);
    onCounterValueChange(newValue);
  }

  useEffect(() => {
    onTotalValueChange?.(totalValue);
  }, [totalValue, onTotalValueChange]);

  return (
    <div>
      <img
        style={{
          maxWidth: "80px",
          maxHeight: "40px",
        }}
        src={currencyImage}
        alt={denominationName}
      />
      {"×"}
      <button type="button" onClick={handleDecrement}>
        {"−"}
      </button>
      <input
        type="number"
        min="0"
        value={counterValue}
        onChange={handleCounterChange}
      />
      <button type="button" onClick={handleIncrement}>
        {"+"}
      </button>
      {"="}
      <span>{intlCurrency.format(totalValue)}</span>
    </div>
  );
}
