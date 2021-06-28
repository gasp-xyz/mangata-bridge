const TOML = require('@iarna/toml');
const temp = require('temp');
const fs  = require('fs');
const os = require('os');
const util = require('util');
const path = require('path');
const exec = require('child_process').exec;
const dotenvConfig = require("dotenv").config;

const Bridge = artifacts.require("Bridge")
const ETHApp = artifacts.require("ETHApp")
const ERC20App = artifacts.require("ERC20App")


const CONFIG_DIR = path.join(process.env.BASE_PATH,"/build/relayer-config")


const dump = async (bridge, ethApp, erc20App) => {
    await fs.promises.mkdir(CONFIG_DIR, { recursive: true });

    let bridgeAbiFile = path.join(CONFIG_DIR, "Bridge.json")
    let ethAbiFile = path.join(CONFIG_DIR, "ETHApp.json")
    let erc20AbiFile = path.join(CONFIG_DIR, "ERC20App.json")

    fs.writeFileSync(bridgeAbiFile, JSON.stringify(bridge.abi, null, 2))
    fs.writeFileSync(ethAbiFile, JSON.stringify(ethApp.abi, null, 2))
    fs.writeFileSync(erc20AbiFile, JSON.stringify(erc20App.abi, null, 2))
    const config = {
        ethereum: {
            endpoint: process.env.ETH_ENDPOINT,
            bridge: {
                address: bridge.address,
                abi: "/opt/config/Bridge.json",
            },
            apps:{
                eth:{
                    address: ethApp.address,
                    abi: "/opt/config/ETHApp.json",
                },
                erc20:{
                    address: erc20App.address,
                    abi: "/opt/config/ERC20App.json",
                }
            }
        },
        substrate: {
            endpoint: process.env.SUB_ENDPOINT
        }
    }
    fs.writeFileSync(path.join(CONFIG_DIR, "config.toml"), TOML.stringify(config))

}


module.exports = async (callback) => {
    try {
        let bridge = await Bridge.deployed()
        let ethApp = await ETHApp.deployed()
        let erc20App = await ERC20App.deployed()

        await dump(bridge, ethApp, erc20App)
				callback();
    } catch (error) {
        callback(error)
    }
}
