// const Verifier = artifacts.require("Verifier");
// const Decoder = artifacts.require("Decoder");
// const ETHApp = artifacts.require("ETHApp");
// const ERC20App = artifacts.require("ERC20App");
// const Bridge = artifacts.require("Bridge");
const MangataToken = artifacts.require("MangataToken");

module.exports = function(deployer, network, accounts) {
  deployer.then(async () => {

		// Already deployed when deploying TestToken
    // // Deploy Verifier and get deployed address
    // const verifier = await deployer.deploy(Verifier, accounts[0]);
		//
    // // Link libraries to applications
    // await deployer.deploy(Decoder);
    // deployer.link(Decoder, [ETHApp, ERC20App]);
		//
    // // Deploy applications
    // const ethApp = await deployer.deploy(ETHApp);
    // const erc20App = await deployer.deploy(ERC20App);
		//
    // // Deploy Bridge
    // await deployer.deploy(Bridge, verifier.address, [ethApp.address, erc20App.address]);

    // Deploy TEST ERC20 token for testing
    await deployer.deploy(MangataToken, 100000000, "Mangata Token", "MGT");
  })
};
