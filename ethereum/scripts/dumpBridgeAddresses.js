const fs = require('fs');
require("dotenv").config();
const path = require('path');

const ETHApp = artifacts.require("ETHApp")
const ERC20App = artifacts.require("ERC20App")
const Bridge = artifacts.require("Bridge")

module.exports = async (callback) => {
    try {
        const eth20AppInstance = await ETHApp.deployed()
        const erc20AppInstance = await ERC20App.deployed()
        const bridgeInstance = await Bridge.deployed()

        const address = {
            ETHApp: eth20AppInstance.address,
            ERC20App: erc20AppInstance.address,
            Bridge: bridgeInstance.address
        }

        fs.appendFileSync(path.join(process.env.BRIDGE_CONTRACTS_DEPLOY_PATH,"/build/address.json"), JSON.stringify(address, null, 2))
				callback();
    } catch (error) {
        return console.error({error})
    }
};