const MangataToken = artifacts.require("MangataToken");
const BigNumber = require('bignumber.js');

module.exports = function(deployer, network, accounts) {
  deployer.then(async () => {
    console.log(accounts[1]);
    // Deploy TEST ERC20 token for testing
    await deployer.deploy(MangataToken, "Mangata Token", "MNG", BigNumber('200000000000000000000000000'), accounts[1]);
  })
};
