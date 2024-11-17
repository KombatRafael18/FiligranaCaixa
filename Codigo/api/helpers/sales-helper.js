const { roundToTwoDecimals } = require("../../frontend/src/utils/number");

/**
 * Calcula o valor total considerando desconto e cashback
 */
function calcularValorTotal(products, desconto, cashback) {
  const somaPecas = products.reduce((acc, p) => {
    return acc + p.valor * p.quantity;
  }, 0);

  const descontoValor = somaPecas * desconto;

  const total = somaPecas - descontoValor - cashback;
  const totalRounded = roundToTwoDecimals(total);
  return totalRounded;
}

module.exports = {
  calcularValorTotal,
};
