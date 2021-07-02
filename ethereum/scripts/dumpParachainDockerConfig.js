const fs = require('fs');
require("dotenv").config();
const path = require('path');

const ETHApp = artifacts.require("ETHApp")
const ERC20App = artifacts.require("ERC20App")

module.exports = async (callback) => {
    try {
        let ethApp = await ETHApp.deployed()
        let erc20App = await ERC20App.deployed()

        fs.writeFileSync(path.join(process.env.BRIDGE_DEPLOY_PATH,"/build/parachain.env"), `ETH_APP_ID=${ethApp.address}\nERC20_APP_ID=${erc20App.address}\n`)
				callback();
    } catch (error) {
        callback(error)
    }
}
