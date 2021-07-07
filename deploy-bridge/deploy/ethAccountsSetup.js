const Web3 = require('web3');
const bip39 = require("bip39");
const hdkey = require('ethereumjs-wallet/hdkey');

module.exports.transferEth = async function (fromAccSeed, ethEndpoint) {

   var web3 = new Web3(new Web3.providers.HttpProvider(ethEndpoint))

     let hdwallet = hdkey.fromMasterSeed(await bip39.mnemonicToSeed(fromAccSeed));
     let wallet_hdpath0 = "m/44'/60'/0'/0/0";
	  let wallet_hdpath1 = "m/44'/60'/0'/0/1";

     let wallet0 = hdwallet.derivePath(wallet_hdpath0).getWallet();
     let address0 = '0x' + wallet0.getAddress().toString("hex");
     let privateKey0 = wallet0.getPrivateKey().toString("hex");

     let wallet1 = hdwallet.derivePath(wallet_hdpath1).getWallet();
     let address1 = '0x' + wallet1.getAddress().toString("hex");
     let privateKey1 = wallet1.getPrivateKey().toString("hex");

   const createTransaction = await web3.eth.accounts.signTransaction(
      {
         from: address0,
         to: address1,
         value: web3.utils.toWei('0.5', 'ether'),
         gas: '5500000',
      },
      privateKey0
   );

   const createReceipt = await web3.eth.sendSignedTransaction(
      createTransaction.rawTransaction
   );
   console.log(
      `Transaction successful`
   );
};
