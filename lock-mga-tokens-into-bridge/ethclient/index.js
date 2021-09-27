const Web3 = require('web3');
const BigNumber = require('bignumber.js');
const bip39 = require("bip39");
const hdkey = require('ethereumjs-wallet/hdkey');

const ERC20AppABI = require('../abi/ERC20AppABI.json');
const ERC20ABI = require('../abi/ERC20ABI.json');

/**
 * The Ethereum client for Bridge interaction
 */
class EthERC20Client {

    constructor(endpoint, erc20AppAddress) {
			console.log(endpoint);
      var web3 = new Web3(new Web3.providers.WebsocketProvider(endpoint));
      this.web3 = web3;

      this.loadApplicationContracts(erc20AppAddress);
    }

    loadApplicationContracts(erc20AppAddress) {
      const appERC20 = new this.web3.eth.Contract(ERC20AppABI, erc20AppAddress);
      this.appERC20 = appERC20;
    };

    loadERC20Contract(tokenContractAddress) {
      return new this.web3.eth.Contract(ERC20ABI, tokenContractAddress);
    }

		async getUserAccount() {
			let hdwallet = hdkey.fromMasterSeed(await bip39.mnemonicToSeed(process.env.MGA_Kovan_Bridge_MNEMONIC));
      let wallet_hdpath1 = "m/44'/60'/0'/0/1";
   
      let wallet1 = hdwallet.derivePath(wallet_hdpath1).getWallet();
      // let address1 = '0x' + wallet1.getAddress().toString("hex");
      let privateKey1 = wallet1.getPrivateKey().toString("hex");

      var userAccount = this.web3.eth.accounts.privateKeyToAccount(privateKey1);
			this.web3.eth.accounts.wallet.add(userAccount);
			return userAccount.address;
		};

		async getDefaultAccount() {
      let hdwallet = hdkey.fromMasterSeed(await bip39.mnemonicToSeed(process.env.MGA_Kovan_Bridge_MNEMONIC));
      let wallet_hdpath0 = "m/44'/60'/0'/0/0";

      let wallet0 = hdwallet.derivePath(wallet_hdpath0).getWallet();
      // let address0 = '0x' + wallet0.getAddress().toString("hex");
      let privateKey0 = wallet0.getPrivateKey().toString("hex");

			var defaultAccount = this.web3.eth.accounts.privateKeyToAccount(privateKey0);
			return defaultAccount.address;
		};

    async initialize() {
      let hdwallet = hdkey.fromMasterSeed(await bip39.mnemonicToSeed(process.env.MGA_Kovan_Bridge_MNEMONIC));
      let wallet_hdpath0 = "m/44'/60'/0'/0/0";
      let wallet_hdpath1 = "m/44'/60'/0'/0/1";
 
      let wallet0 = hdwallet.derivePath(wallet_hdpath0).getWallet();
      // let address0 = '0x' + wallet0.getAddress().toString("hex");
      let privateKey0 = wallet0.getPrivateKey().toString("hex");
 
      let wallet1 = hdwallet.derivePath(wallet_hdpath1).getWallet();
      // let address1 = '0x' + wallet1.getAddress().toString("hex");
      let privateKey1 = wallet1.getPrivateKey().toString("hex");

			var defaultAccount = this.web3.eth.accounts.privateKeyToAccount(privateKey0);
			this.web3.eth.accounts.wallet.add(defaultAccount);
      var userAccount = this.web3.eth.accounts.privateKeyToAccount(privateKey1);
			this.web3.eth.accounts.wallet.add(userAccount);
			this.web3.eth.defaultAccount = defaultAccount.address;
    };

    async getTx(txHash) {
      return await this.web3.eth.getTransaction(txHash);
    }

    async getEthBalance(account = this.web3.eth.defaultAccount) {
      return BigNumber(await this.web3.eth.getBalance(account));
    }

    async getErc20Balance(account, address) {
      const instance = this.loadERC20Contract(address);
      return BigNumber(await instance.methods.balanceOf(account).call());
    }

    async getErc20Allowance(account, address) {
      const instance = this.loadERC20Contract(address);
      return BigNumber(await instance.methods.allowance(account, this.appERC20._address).call());
    }

    async approveERC20(from, amount, address) {
      const erc20Instance = this.loadERC20Contract(address);
      return erc20Instance.methods.approve(this.appERC20._address, this.web3.utils.toBN(amount))
        .send({
          from: from,
	        gas: 500000
        });
    }

    async sendERC20(from, amount, address, recipient) {
      const recipientBytes = Buffer.from(recipient.replace(/^0x/, ""), 'hex');

      return await this.appERC20.methods.sendERC20(recipientBytes, address, this.web3.utils.toBN(amount))
        .send({
          from: from,
	        gas: 500000
        });
    }
}

module.exports.EthERC20Client = EthERC20Client;
