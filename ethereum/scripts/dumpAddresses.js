const fs = require('fs')

const ETHApp = artifacts.require('ETHApp')
const ERC20App = artifacts.require('ERC20App')
const TestToken = artifacts.require('TestToken')
const MangataToken = artifacts.require('MangataToken')

module.exports = async () => {
  try {
    const eth20AppInstance = await ETHApp.deployed()
    const erc20AppInstance = await ERC20App.deployed()
    const tokenInstance = await TestToken.deployed()
    const mangataTokenInstance = await MangataToken.deployed()

    const address = {
      ETHApp: eth20AppInstance.address,
      ERC20App: erc20AppInstance.address,
      TestToken: tokenInstance.address,
      MangataToken: mangataTokenInstance.address,
    }

    fs.writeFileSync('../test/build/address.json', JSON.stringify(address, null, 2))
  } catch (error) {
    return console.error({ error })
  }
}
