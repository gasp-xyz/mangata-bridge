let { ApiPromise, WsProvider } = require('@polkadot/api');
let { Keyring } = require('@polkadot/api');
const { default: BigNumber } = require('bignumber.js');

class SubClient {

    constructor(endpoint) {
        this.endpoint = endpoint;
        this.api = null;
        this.keyring = null;
    }

    async connect() {
        const provider = new WsProvider('ws://127.0.0.1:9944');
        this.api = await ApiPromise.create({
            provider,
            rpc: {
              xyk: {
                calculate_buy_price: {
                  description: '',
                  params: [
                    {
                      name: 'input_reserve',
                      type: 'Balance',
                    },
                    {
                      name: 'output_reserve',
                      type: 'Balance',
                    },
                    {
                      name: 'sell_amount',
                      type: 'Balance',
                    },
                  ],
                  type: 'RpcResult<Balance>',
                },
                calculate_sell_price: {
                  description: '',
                  params: [
                    {
                      name: 'input_reserve',
                      type: 'Balance',
                    },
                    {
                      name: 'output_reserve',
                      type: 'Balance',
                    },
                    {
                      name: 'sell_amount',
                      type: 'Balance',
                    },
                  ],
                  type: 'RpcResult<Balance>',
                },
                get_burn_amount: {
                  description: '',
                  params: [
                    {
                      name: 'first_asset_id',
                      type: 'TokenId',
                    },
                    {
                      name: 'second_asset_id',
                      type: 'TokenId',
                    },
                    {
                      name: 'liquidity_asset_amount',
                      type: 'Balance',
                    },
                  ],
                  type: 'RpcResult<Balance>',
                },
              },
            },
            types: {
              CurrencyId: 'u32',
              Balance: 'u128',
              App: {
                _enum: [
                  'ETH',
                  'ERC20'
                ]
              },
              RpcResult: {
                price: 'Balance'
              },
              // mapping the actual specified address format
              Address: 'AccountId',
              // mapping the lookup
              LookupSource: 'AccountId',
              AssetInfo: {
                name: 'Option<Vec<u8>>',
                symbol: 'Option<Vec<u8>>',
                description: 'Option<Vec<u8>>',
                decimals: 'Option<u32>',
              },
              AppId: '[u8; 20]',
              Message: {
                payload: 'Vec<u8>',
                verification: 'VerificationInput',
              },
              VerificationInput: {
                _enum: {
                  Basic: 'VerificationBasic',
                  None: null,
                },
              },
              VerificationBasic: {
                blockNumber: 'u64',
                eventIndex: 'u32',
              },
              TokenId: 'u32',
              BridgedAssetId: 'H160',
              AccountData: {
                free: 'u128',
                reserved: 'u128',
                frozen: 'u128',
              },
              EthereumHeader: {
                parentHash: 'H256',
                timestamp: 'u64',
                number: 'u64',
                author: 'H160',
                transactionsRoot: 'H256',
                ommersHash: 'H256',
                extraData: 'Vec<u8>',
                stateRoot: 'H256',
                receiptsRoot: 'H256',
                logBloom: 'Bloom',
                gasUsed: 'U256',
                gasLimit: 'U256',
                difficulty: 'U256',
                seal: 'Vec<Vec<u8>>',
              },
              Bloom: {
                _: '[u8; 256]',
              },
            },
        })

        this.keyring = new Keyring({ type: 'sr25519' });
        this.alice = this.keyring.addFromUri('//Alice', { name: 'Alice' });

    }

    async queryAccountBalance(accountId, assetId) {
      let accountDetails = await this.api.query.tokens.accounts(accountId, assetId);
      return new BigNumber (accountDetails.free)
    }

    async burnETH(account, recipient, amount) {
      const txHash = await this.api.tx.eth.burn(recipient, amount).signAndSend(account);
    }

    async burnERC20(account, assetId, recipient, amount) {
      const txHash = await this.api.tx.erc20.burn(assetId, recipient, amount).signAndSend(account);
    }

    async waitNewBlock() {
      let count = 0
      return new Promise(async (resolve) => {
        const unsubscribe = await this.api.rpc.chain.subscribeNewHeads((header) => {
          // console.log(`Chain is at block: #${header.number}`)

          if (++count === 2) {
          unsubscribe()
          resolve(true)
          }
        })
      })
    }


}

module.exports.SubClient = SubClient;
