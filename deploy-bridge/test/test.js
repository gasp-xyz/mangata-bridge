const EthClient = require('../src/ethclient').EthClient;
const SubClient = require('../src/subclient').SubClient;

const { sleep } = require('../src/helpers');
const Web3Utils = require("web3-utils");
const BigNumber = require('bignumber.js');

const { expect } = require("chai")
  .use(require("chai-as-promised"))
  .use(require("chai-bignumber")(BigNumber))

describe('Bridge', function () {

  var ethClient;
  var subClient;

  // Address for //Alice on Substrate
  const polkadotRecipient = process.env.SUB_CHAIN_RECEIPIENT;
  const polkadotRecipientSS58 = process.env.SUB_CHAIN_RECEIPIENTSS58;
  console.log(polkadotRecipient);
  console.log(polkadotRecipientSS58);

  const subNullRecipient = "0x0000000000000000000000000000000000000000";

  const MNG_ASSET_ID = "0x00"
  const ETH_ASSET_ID = "0x01"
  const TKN_ASSET_ID = "0x04"

  before(async function () {

    var addrs = require("../build/address.json")
    this.ethAppAddress = addrs.ETHApp;
    this.erc20AppAddress = addrs.ERC20App;
    this.tokenAddress = addrs.TestToken;
    this.mngAddress = addrs.MangataToken;

    console.log(process.env.MGA_Kovan_Bridge_INFURA_ENDPOINT_WS);


    ethClient = new EthClient(process.env.MGA_Kovan_Bridge_INFURA_ENDPOINT_WS, this.ethAppAddress, this.erc20AppAddress);
    subClient = new SubClient(process.env.MGA_Kovan_Bridge_SUB_ENDPOINT);
    await subClient.connect();
    await ethClient.initialize();

  });

  describe('ETH App', function () {
    it('should transfer ETH from Ethereum to Substrate', async function() {
      let amount = BigNumber('10000000000000000'); // 0.01 ETH

      let beforeEthBalance = await ethClient.getEthBalance(await ethClient.getUserAccount());
      let beforeSubBalance = await subClient.queryAccountBalance(polkadotRecipientSS58, ETH_ASSET_ID);

      let { gasCost } = await ethClient.sendEth(await ethClient.getUserAccount(), amount, polkadotRecipient);
      await sleep(90000);

      let afterEthBalance = await ethClient.getEthBalance(await ethClient.getUserAccount());
      let afterSubBalance = await subClient.queryAccountBalance(polkadotRecipientSS58, ETH_ASSET_ID);

      expect(beforeEthBalance.minus(afterEthBalance)).to.be.bignumber.equal(amount.plus(gasCost));
      expect(afterSubBalance.minus(beforeSubBalance)).to.be.bignumber.equal(amount);

      // conservation of value
      expect(beforeEthBalance.plus(beforeSubBalance)).to.be.bignumber.equal(afterEthBalance.plus(afterSubBalance).plus(gasCost))
    });

    it('should transfer ETH from Substrate to Ethereum', async function () {

      let amount = BigNumber('10000000000000000'); // 0.01 ETH

      let beforeEthBalance = await ethClient.getEthBalance(await ethClient.getUserAccount());
      let beforeSubBalance = await subClient.queryAccountBalance(polkadotRecipientSS58, ETH_ASSET_ID);

      await subClient.burnETH(subClient.alice, await ethClient.getUserAccount(), amount.toFixed())
      await sleep(90000);

      let afterEthBalance = await ethClient.getEthBalance(await ethClient.getUserAccount());
      let afterSubBalance = await subClient.queryAccountBalance(polkadotRecipientSS58, ETH_ASSET_ID);

      expect(afterEthBalance.minus(beforeEthBalance)).to.be.bignumber.equal(amount);
      expect(beforeSubBalance.minus(afterSubBalance)).to.be.bignumber.equal(amount);

      // conservation of value
      expect(beforeEthBalance.plus(beforeSubBalance)).to.be.bignumber.equal(afterEthBalance.plus(afterSubBalance))

    })
  });

  describe('ERC20 App', function () {
    it('should transfer ERC20 tokens from Ethereum to Substrate', async function () {
      let amount = BigNumber('1000');

      let beforeEthBalance = await ethClient.getErc20Balance(await ethClient.getDefaultAccount(), this.tokenAddress);
      let beforeSubBalance = await subClient.queryAccountBalance(polkadotRecipientSS58, TKN_ASSET_ID);

      await ethClient.approveERC20(await ethClient.getDefaultAccount(), amount, this.tokenAddress);
      await ethClient.sendERC20(await ethClient.getDefaultAccount(), amount, this.tokenAddress, polkadotRecipient);
      await sleep(90000);

      let afterEthBalance = await ethClient.getErc20Balance(await ethClient.getDefaultAccount(), this.tokenAddress);
      let afterSubBalance = await subClient.queryAccountBalance(polkadotRecipientSS58, TKN_ASSET_ID);

      expect(afterEthBalance).to.be.bignumber.equal(beforeEthBalance.minus(amount));
      expect(afterSubBalance).to.be.bignumber.equal(beforeSubBalance.plus(amount));

      // conservation of value
      expect(beforeEthBalance.plus(beforeSubBalance)).to.be.bignumber.equal(afterEthBalance.plus(afterSubBalance))
    });

    it('should transfer ERC20 from Substrate to Ethereum', async function () {
      let amount = BigNumber('1000');

      let beforeEthBalance = await ethClient.getErc20Balance(await ethClient.getDefaultAccount(), this.tokenAddress);
      let beforeSubBalance = await subClient.queryAccountBalance(polkadotRecipientSS58, TKN_ASSET_ID);

      await subClient.burnERC20(subClient.alice, this.tokenAddress, await ethClient.getDefaultAccount(), amount.toFixed())
      await sleep(90000);

      let afterEthBalance = await ethClient.getErc20Balance(await ethClient.getDefaultAccount(), this.tokenAddress);
      let afterSubBalance = await subClient.queryAccountBalance(polkadotRecipientSS58, TKN_ASSET_ID);

      expect(afterEthBalance.minus(beforeEthBalance)).to.be.bignumber.equal(amount);
      expect(beforeSubBalance.minus(afterSubBalance)).to.be.bignumber.equal(amount);

      // conservation of value
      expect(beforeEthBalance.plus(beforeSubBalance)).to.be.bignumber.equal(afterEthBalance.plus(afterSubBalance))
    })
  })

	describe('ERC20 App with MNG', function () {

		it('should lock all MNG ERC20 tokens on Ethereum into Snowbridge bridge contract', async function () {
      let amount = BigNumber('200000000000000000000000000');

      let beforeEthBalance = await ethClient.getErc20Balance(await ethClient.getUserAccount(), this.mngAddress);

      await ethClient.approveERC20(await ethClient.getUserAccount(), amount, this.mngAddress);
			await ethClient.sendERC20(await ethClient.getUserAccount(), amount, this.mngAddress, subNullRecipient);
      await sleep(90000);

      let afterEthBalance = await ethClient.getErc20Balance(await ethClient.getUserAccount(), this.mngAddress);

      expect(afterEthBalance).to.be.bignumber.equal(beforeEthBalance.minus(amount));

    });

		it('should NOT transfer MNG ERC20 tokens from Ethereum to Substrate', async function () {
      let amount = BigNumber('1000');

      let beforeEthBalance = await ethClient.getErc20Balance(await ethClient.getUserAccount(), this.mngAddress);
      let beforeSubBalance = await subClient.queryAccountBalance(polkadotRecipientSS58, MNG_ASSET_ID);

			await ethClient.approveERC20(await ethClient.getUserAccount(), amount, this.mngAddress);
      await expect(ethClient.sendERC20(await ethClient.getUserAccount(), amount, this.mngAddress, polkadotRecipient)).to.be.rejected;
      await sleep(90000);

      let afterEthBalance = await ethClient.getErc20Balance(await ethClient.getUserAccount(), this.mngAddress);
      let afterSubBalance = await subClient.queryAccountBalance(polkadotRecipientSS58, MNG_ASSET_ID);

      expect(afterEthBalance).to.be.bignumber.equal(beforeEthBalance);
      expect(afterSubBalance).to.be.bignumber.equal(beforeSubBalance);

      // conservation of value
      expect(beforeEthBalance.plus(beforeSubBalance)).to.be.bignumber.equal(afterEthBalance.plus(afterSubBalance))
    });

    it('should transfer MNG Assets from Substrate to Ethereum', async function () {
      let amount = BigNumber('1000');

      let beforeEthBalance = await ethClient.getErc20Balance(await ethClient.getUserAccount(), this.mngAddress);
      let beforeSubBalance = await subClient.queryAccountBalance(polkadotRecipientSS58, MNG_ASSET_ID);

      await subClient.burnERC20(subClient.alice, this.mngAddress, await ethClient.getUserAccount(), amount.toFixed())
      await sleep(90000);

      let afterEthBalance = await ethClient.getErc20Balance(await ethClient.getUserAccount(), this.mngAddress);
      let afterSubBalance = await subClient.queryAccountBalance(polkadotRecipientSS58, MNG_ASSET_ID);

      expect(afterEthBalance.minus(beforeEthBalance)).to.be.bignumber.equal(amount);
      expect(beforeSubBalance.minus(afterSubBalance)).to.be.bignumber.equal(amount);

      // conservation of value
      expect(beforeEthBalance.plus(beforeSubBalance)).to.be.bignumber.equal(afterEthBalance.plus(afterSubBalance))
    })

    it('should transfer MNG ERC20 tokens from Ethereum to Substrate', async function () {
      let amount = BigNumber('1000');

      let beforeEthBalance = await ethClient.getErc20Balance(await ethClient.getUserAccount(), this.mngAddress);
      let beforeSubBalance = await subClient.queryAccountBalance(polkadotRecipientSS58, MNG_ASSET_ID);

			await ethClient.approveERC20(await ethClient.getUserAccount(), amount, this.mngAddress);
      await ethClient.sendERC20(await ethClient.getUserAccount(), amount, this.mngAddress, polkadotRecipient);
      await sleep(90000);

      let afterEthBalance = await ethClient.getErc20Balance(await ethClient.getUserAccount(), this.mngAddress);
      let afterSubBalance = await subClient.queryAccountBalance(polkadotRecipientSS58, MNG_ASSET_ID);

      expect(afterEthBalance).to.be.bignumber.equal(beforeEthBalance.minus(amount));
      expect(afterSubBalance).to.be.bignumber.equal(beforeSubBalance.plus(amount));

      // conservation of value
      expect(beforeEthBalance.plus(beforeSubBalance)).to.be.bignumber.equal(afterEthBalance.plus(afterSubBalance))
    });
  })

});
