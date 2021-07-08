const Web3 = require('web3');
const bip39 = require("bip39");
const hdkey = require('ethereumjs-wallet/hdkey');

module.exports.getPrivateKeyFromSeed = async function (fromAccSeed, accNum) {
   
  let hdwallet = hdkey.fromMasterSeed(await bip39.mnemonicToSeed(fromAccSeed));
  let wallet_hdpath = "m/44'/60'/0'/0/";


  let wallet = hdwallet.derivePath(wallet_hdpath + accNum.toString()).getWallet();
  let address = '0x' + wallet.getAddress().toString("hex");
  let privateKey = wallet.getPrivateKey().toString("hex");

  return privateKey   
};
