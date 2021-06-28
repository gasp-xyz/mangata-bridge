const Web3 = require('web3');
const bip39 = require("bip39");
const hdkey = require('ethereumjs-wallet/hdkey');
const fs  = require('fs');

module.exports.transferEthAndDumpKeys = async function (fromAccSeed, ethEndpoint) {
   console.log(
      `Attempting to make transaction of 1 ETH using ${fromAccSeed}`
   );
   var web3 = new Web3(new Web3.providers.HttpProvider(ethEndpoint))
	 console.log(typeof fromAccSeed);

    let hdwallet = hdkey.fromMasterSeed(await bip39.mnemonicToSeed(fromAccSeed));
    let wallet_hdpath0 = "m/44'/60'/0'/0/0";
		let wallet_hdpath1 = "m/44'/60'/0'/0/1";

		console.log(hdwallet);

		let wallet0 = hdwallet.derivePath(wallet_hdpath0).getWallet();
    let address0 = '0x' + wallet0.getAddress().toString("hex");
		let privateKey0 = wallet0.getPrivateKey().toString("hex");

    let wallet1 = hdwallet.derivePath(wallet_hdpath1).getWallet();
    let address1 = '0x' + wallet1.getAddress().toString("hex");
		let privateKey1 = wallet1.getPrivateKey().toString("hex");

		fs.appendFileSync("../.env", "ethAddress0=".concat(address0).concat("\n"));
		fs.appendFileSync("../.env", "ethPrivateKey0=0x".concat(privateKey0).concat("\n"));
		fs.appendFileSync("../.env", "ethAddress1=".concat(address1).concat("\n"));
		fs.appendFileSync("../.env", "ethPrivateKey1=0x".concat(privateKey1).concat("\n"));

   const createTransaction = await web3.eth.accounts.signTransaction(
      {
         from: address0,
         to: address1,
         value: web3.utils.toWei('0.5', 'ether'),
         gas: '5500000',
      },
      privateKey0
   );

	 // TODO Uncomment
   // const createReceipt = await web3.eth.sendSignedTransaction(
   //    createTransaction.rawTransaction
   // );
   console.log(
      `Transaction successful`
   );
};
