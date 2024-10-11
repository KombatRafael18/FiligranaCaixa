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
  bill2,
  bill5,
  bill10,
  bill20,
  bill50,
  bill200,
  bill100,
  coin1,
  coin5,
  coin10,
  coin25,
  coin50,
  coin1real,
};

const intlCurrency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function getCurrencyImage(currencyName) {
  const cNameNorm = currencyName.toLowerCase().replaceAll("_", "");
  const cImg = currencyImages[cNameNorm];
  if (!cImg) {
    throw new Error(`Imagem não encontrada para a moeda ${currencyName}`);
  }
  return cImg;
}

console.debug({ currencyImages });

export default function CurrencyCounter({
  denominationName,
  counterValue,
  onCounterValueChange,
}) {
  const currencyImage = getCurrencyImage(denominationName);
  const totalValue = 999.0;
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
      <button type="button">{"−"}</button>
      <input type="number" value={counterValue} />
      <button type="button">{"+"}</button>
      {"="}
      <span>{intlCurrency.format(totalValue)}</span>
    </div>
  );
}
