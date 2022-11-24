const contractAddresses = require('./contractAddresses.json')
const abi = require('./abi.json')
const { default: POSITIONS } = require('./subgraphQueries')

module.exports = {
  contractAddresses,
  abi,
  POSITIONS,
}
