// https://stackoverflow.com/questions/11832914/how-to-round-to-at-most-2-decimal-places-if-necessary
function roundToDecimals(num, decimals) {
  const factor = 10 ** decimals;
  return Math.round((num + Number.EPSILON) * factor) / factor;
}

function roundToTwoDecimals(num) {
  return roundToDecimals(num, 2);
}

module.exports = {
  roundToDecimals,
  roundToTwoDecimals,
};
