const fs = require('fs');
require("dotenv").config();
const path = require('path');

const ETHApp = artifacts.require("ETHApp")
const ERC20App = artifacts.require("ERC20App")
const TestToken = artifacts.require("TestToken")
const MangataToken = artifacts.require("MangataToken")

module.exports = async (callback) => {
    try {
        const eth20AppInstance = await ETHApp.deployed()
        const erc20AppInstance = await ERC20App.deployed()
        const tokenInstance = await TestToken.deployed();
        const mangataTokenInstance = await MangataToken.deployed();

        const address = {
            ETHApp: eth20AppInstance.address,
            ERC20App: erc20AppInstance.address,
            TestToken: tokenInstance.address,
            MangataToken: mangataTokenInstance.address
        }

        fs.writeFileSync(path.join(process.env.BASE_PATH,"/build/address.json"), JSON.stringify(address, null, 2))
				callback();
    } catch (error) {
        return console.error({error})
    }
};
