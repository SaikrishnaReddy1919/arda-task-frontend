const futurePriceRatio = 0.01727 //assume token doubles its price

const calcImpermanentLoss = (baseQty, tokenQty) => {
  baseQty = parseInt(baseQty)
  tokenQty = parseInt(tokenQty)

  console.log(baseQty, tokenQty)
  const productConstant = baseQty * tokenQty // x * y = k
  const hodlStrategy = tokenQty * futurePriceRatio + baseQty
  const lpStrategy =
    Math.sqrt(productConstant / futurePriceRatio) * futurePriceRatio +
    Math.sqrt(productConstant * futurePriceRatio)
  const impermanentLoss = ((hodlStrategy - lpStrategy) / hodlStrategy) * 100
  return impermanentLoss
}
module.exports = calcImpermanentLoss
