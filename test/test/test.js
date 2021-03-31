const EthClient = require('../src/ethclient').EthClient
const SubClient = require('../src/subclient').SubClient

const { sleep } = require('../src/helpers')
const Web3Utils = require('web3-utils')
const BigNumber = require('bignumber.js')

const { expect } = require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))

describe('Bridge', function () {
  var ethClient
  var subClient

  // Address for //Alice on Substrate
  const polkadotRecipient = '0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d'
  const polkadotRecipientSS58 = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'

  const subNullRecipient = '0x0000000000000000000000000000000000000000'

  const MNG_ASSET_ID = '0x00'
  const ETH_ASSET_ID = '0x01'
  const TKN_ASSET_ID = '0x02'

  before(async function () {
    var addrs = require('../build/address.json')
    this.ethAppAddress = addrs.ETHApp
    this.erc20AppAddress = addrs.ERC20App
    this.tokenAddress = addrs.TestToken
    this.mngAddress = addrs.MangataToken

    ethClient = new EthClient('ws://localhost:8545', this.ethAppAddress, this.erc20AppAddress)
    subClient = new SubClient('ws://localhost:9944')
    await subClient.connect()
    await ethClient.initialize()
  })

  describe('ETH App', function () {
    it('should transfer ETH from Ethereum to Substrate', async function () {
      let amount = BigNumber('10000000000000000') // 0.01 ETH

      let beforeEthBalance = await ethClient.getEthBalance(ethClient.accounts[1])
      let beforeSubBalance = await subClient.queryAccountBalance(
        polkadotRecipientSS58,
        ETH_ASSET_ID
      )

      let { gasCost } = await ethClient.sendEth(ethClient.accounts[1], amount, polkadotRecipient)
      await sleep(30000)

      let afterEthBalance = await ethClient.getEthBalance(ethClient.accounts[1])
      let afterSubBalance = await subClient.queryAccountBalance(polkadotRecipientSS58, ETH_ASSET_ID)

      expect(beforeEthBalance.minus(afterEthBalance)).to.be.bignumber.equal(amount.plus(gasCost))
      expect(afterSubBalance.minus(beforeSubBalance)).to.be.bignumber.equal(amount)

      // conservation of value
      expect(beforeEthBalance.plus(beforeSubBalance)).to.be.bignumber.equal(
        afterEthBalance.plus(afterSubBalance).plus(gasCost)
      )
    })

    it('should transfer ETH from Substrate to Ethereum', async function () {
      let amount = BigNumber('10000000000000000') // 0.01 ETH

      let beforeEthBalance = await ethClient.getEthBalance(ethClient.accounts[1])
      let beforeSubBalance = await subClient.queryAccountBalance(
        polkadotRecipientSS58,
        ETH_ASSET_ID
      )

      await subClient.burnETH(subClient.alice, ethClient.accounts[1], amount.toFixed())
      await sleep(30000)

      let afterEthBalance = await ethClient.getEthBalance(ethClient.accounts[1])
      let afterSubBalance = await subClient.queryAccountBalance(polkadotRecipientSS58, ETH_ASSET_ID)

      expect(afterEthBalance.minus(beforeEthBalance)).to.be.bignumber.equal(amount)
      expect(beforeSubBalance.minus(afterSubBalance)).to.be.bignumber.equal(amount)

      // conservation of value
      expect(beforeEthBalance.plus(beforeSubBalance)).to.be.bignumber.equal(
        afterEthBalance.plus(afterSubBalance)
      )
    })
  })

  describe('ERC20 App', function () {
    it('should transfer ERC20 tokens from Ethereum to Substrate', async function () {
      let amount = BigNumber('1000')

      let beforeEthBalance = await ethClient.getErc20Balance(
        ethClient.accounts[0],
        this.tokenAddress
      )
      let beforeSubBalance = await subClient.queryAccountBalance(
        polkadotRecipientSS58,
        TKN_ASSET_ID
      )

      await ethClient.approveERC20(ethClient.accounts[0], amount, this.tokenAddress)
      await ethClient.sendERC20(ethClient.accounts[0], amount, this.tokenAddress, polkadotRecipient)
      await sleep(30000)

      let afterEthBalance = await ethClient.getErc20Balance(
        ethClient.accounts[0],
        this.tokenAddress
      )
      let afterSubBalance = await subClient.queryAccountBalance(polkadotRecipientSS58, TKN_ASSET_ID)

      expect(afterEthBalance).to.be.bignumber.equal(beforeEthBalance.minus(amount))
      expect(afterSubBalance).to.be.bignumber.equal(beforeSubBalance.plus(amount))

      // conservation of value
      expect(beforeEthBalance.plus(beforeSubBalance)).to.be.bignumber.equal(
        afterEthBalance.plus(afterSubBalance)
      )
    })

    it('should transfer ERC20 from Substrate to Ethereum', async function () {
      let amount = BigNumber('1000')

      let beforeEthBalance = await ethClient.getErc20Balance(
        ethClient.accounts[0],
        this.tokenAddress
      )
      let beforeSubBalance = await subClient.queryAccountBalance(
        polkadotRecipientSS58,
        TKN_ASSET_ID
      )

      await subClient.burnERC20(
        subClient.alice,
        this.tokenAddress,
        ethClient.accounts[0],
        amount.toFixed()
      )
      await sleep(30000)

      let afterEthBalance = await ethClient.getErc20Balance(
        ethClient.accounts[0],
        this.tokenAddress
      )
      let afterSubBalance = await subClient.queryAccountBalance(polkadotRecipientSS58, TKN_ASSET_ID)

      expect(afterEthBalance.minus(beforeEthBalance)).to.be.bignumber.equal(amount)
      expect(beforeSubBalance.minus(afterSubBalance)).to.be.bignumber.equal(amount)

      // conservation of value
      expect(beforeEthBalance.plus(beforeSubBalance)).to.be.bignumber.equal(
        afterEthBalance.plus(afterSubBalance)
      )
    })
  })

  describe('ERC20 App with MNG', function () {
    it('should lock all MNG ERC20 tokens on Ethereum into Snowbridge bridge contract', async function () {
      let amount = BigNumber('200000000000000000000000000')

      let beforeEthBalance = await ethClient.getErc20Balance(ethClient.accounts[1], this.mngAddress)

      await ethClient.approveERC20(ethClient.accounts[1], amount, this.mngAddress)
      await ethClient.sendERC20(ethClient.accounts[1], amount, this.mngAddress, subNullRecipient)
      await sleep(30000)

      let afterEthBalance = await ethClient.getErc20Balance(ethClient.accounts[1], this.mngAddress)

      expect(afterEthBalance).to.be.bignumber.equal(beforeEthBalance.minus(amount))
    })

    it('should NOT transfer MNG ERC20 tokens from Ethereum to Substrate', async function () {
      let amount = BigNumber('1000')

      let beforeEthBalance = await ethClient.getErc20Balance(ethClient.accounts[1], this.mngAddress)
      let beforeSubBalance = await subClient.queryAccountBalance(
        polkadotRecipientSS58,
        MNG_ASSET_ID
      )

      await ethClient.approveERC20(ethClient.accounts[1], amount, this.mngAddress)
      await expect(
        ethClient.sendERC20(ethClient.accounts[1], amount, this.mngAddress, polkadotRecipient)
      ).to.be.rejected
      await sleep(30000)

      let afterEthBalance = await ethClient.getErc20Balance(ethClient.accounts[1], this.mngAddress)
      let afterSubBalance = await subClient.queryAccountBalance(polkadotRecipientSS58, MNG_ASSET_ID)

      expect(afterEthBalance).to.be.bignumber.equal(beforeEthBalance)
      expect(afterSubBalance).to.be.bignumber.equal(beforeSubBalance)

      // conservation of value
      expect(beforeEthBalance.plus(beforeSubBalance)).to.be.bignumber.equal(
        afterEthBalance.plus(afterSubBalance)
      )
    })

    it('should transfer MNG Assets from Substrate to Ethereum', async function () {
      let amount = BigNumber('1000')

      let beforeEthBalance = await ethClient.getErc20Balance(ethClient.accounts[1], this.mngAddress)
      let beforeSubBalance = await subClient.queryAccountBalance(
        polkadotRecipientSS58,
        MNG_ASSET_ID
      )

      await subClient.burnERC20(
        subClient.alice,
        this.mngAddress,
        ethClient.accounts[1],
        amount.toFixed()
      )
      await sleep(30000)

      let afterEthBalance = await ethClient.getErc20Balance(ethClient.accounts[1], this.mngAddress)
      let afterSubBalance = await subClient.queryAccountBalance(polkadotRecipientSS58, MNG_ASSET_ID)

      expect(afterEthBalance.minus(beforeEthBalance)).to.be.bignumber.equal(amount)
      expect(beforeSubBalance.minus(afterSubBalance)).to.be.bignumber.equal(amount)

      // conservation of value
      expect(beforeEthBalance.plus(beforeSubBalance)).to.be.bignumber.equal(
        afterEthBalance.plus(afterSubBalance)
      )
    })

    it('should transfer MNG ERC20 tokens from Ethereum to Substrate', async function () {
      let amount = BigNumber('1000')

      let beforeEthBalance = await ethClient.getErc20Balance(ethClient.accounts[1], this.mngAddress)
      let beforeSubBalance = await subClient.queryAccountBalance(
        polkadotRecipientSS58,
        MNG_ASSET_ID
      )

      await ethClient.approveERC20(ethClient.accounts[1], amount, this.mngAddress)
      await ethClient.sendERC20(ethClient.accounts[1], amount, this.mngAddress, polkadotRecipient)
      await sleep(30000)

      let afterEthBalance = await ethClient.getErc20Balance(ethClient.accounts[1], this.mngAddress)
      let afterSubBalance = await subClient.queryAccountBalance(polkadotRecipientSS58, MNG_ASSET_ID)

      expect(afterEthBalance).to.be.bignumber.equal(beforeEthBalance.minus(amount))
      expect(afterSubBalance).to.be.bignumber.equal(beforeSubBalance.plus(amount))

      // conservation of value
      expect(beforeEthBalance.plus(beforeSubBalance)).to.be.bignumber.equal(
        afterEthBalance.plus(afterSubBalance)
      )
    })
  })
})
