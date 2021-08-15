
const bip39 = require("bip39");
const hdkey = require('ethereumjs-wallet/hdkey');
require("dotenv").config();

(async () => {

  let mnemonic = process.env.MNEMONIC;
  
  let hdwallet = hdkey.fromMasterSeed(await bip39.mnemonicToSeed(mnemonic));
  let wallet_hdpath = "m/44'/60'/0'/0/";


  let wallet = hdwallet.derivePath(wallet_hdpath + "0".toString()).getWallet();
  let address = '0x' + wallet.getAddress().toString("hex");
  let privateKey = wallet.getPrivateKey().toString("hex");

  console.log(`Mnemonic: ${mnemonic}`)
  console.log(`Address: ${address}`) 
  console.log(`PrivateKey: ${privateKey}`) 
})();