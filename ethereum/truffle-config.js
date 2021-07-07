
var HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 9545,
      network_id: "*"
    },
    ganache: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "344"
    },
    ropsten: {
      provider: () => new HDWalletProvider(
        process.env.MNEMONIC,
        "https://ropsten.infura.io/v3/".concat(process.env.INFURA_PROJECT_ID)
      ),
      network_id: 3,
      gas: 6000000,
      gasPrice: 55000000000
    },
    kovan: {
      provider: () => new HDWalletProvider(
          process.env.MNEMONIC,
          "https://kovan.infura.io/v3/".concat(process.env.INFURA_PROJECT_ID)
      ),
      network_id: 42,
      gas: 6000000,
      gasPrice: 55000000000
    }
  },
  mocha: {
    useColors: true
  },
  compilers: {
    solc: {
      version: "0.6.2",
    }
  }
};
