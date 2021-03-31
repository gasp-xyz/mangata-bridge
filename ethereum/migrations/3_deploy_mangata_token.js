const MangataToken = artifacts.require('MangataToken')
const BigNumber = require('bignumber.js')

module.exports = function (deployer, network, accounts) {
  deployer.then(async () => {
    await deployer.deploy(
      MangataToken,
      'Mangata Token',
      'MNG',
      BigNumber('200000000000000000000000000'),
      accounts[1]
    )
  })
}
