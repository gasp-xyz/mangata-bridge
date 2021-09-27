# Lock MGA ERC20 tokens on Ethereum into Snowbridge

## Steps to lock MGA
From `/lock-mga-tokens-into-bridge`
1. Run `yarn`
2. In the `set-env.sh` file:
    1. Set `MGA_Kovan_Bridge_MNEMONIC`, as the mnemonic of the account you want to lock the MGA ERC20 tokens from.
    2. Set `AMOUNT_TO_LOCK`, as the amount of MGA tokens you'd like to lock, keeping in mind that `18` decimals are used.
    3. Set `ERC20AppAddress`, as the address of the ERC20App contract of the bridge on Ethereum.
    4. Set `MgaAddress`, as the address of the MGA ERC20 contract address on Ethereum.
3. Ensure that the ABIs for the ERC20App and the MGA ERC20 are present in `./abi` as `ERC20ABI.json` and `ERC20AppABI.json`.
4. If the account you want to lock the MGA ERC20 tokens from is the first derived account (`/0`) rather than the second derived account (`/1`), then replace `getUserAccount` with `getDefaultAccount` in `lock-mga-tokens.js` in both places (`approveERC20` and `sendERC20`).
5. Run `source set-env.sh && node lock-mga-tokens.js`
