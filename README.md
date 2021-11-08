<p align="center">
    <a href="https://https://mangata.finance/">
    <img width="132" height="101" src="https://mangata.finance/images/logo-without-text.svg" class="attachment-full size-full" alt="Mangata brand" loading="lazy" /></a>
</p>

<h2 align="center">Mangata Bridge</h2>

<p align="center">
    Snowfork Polkadot Ethereum Bridge modified for Mangata
</p>

![Issues](https://img.shields.io/github/issues/mangata-finance/mangata-bridge)
![Pull Request](https://img.shields.io/github/issues-pr/mangata-finance/mangata-bridge)
![GitHub last commit](https://img.shields.io/github/last-commit/mangata-finance/mangata-bridge)
![Build Status](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2Fmangata-finance%2Fmangata-bridge%2Fbadge%3Fref%3Ddevelop&style=flat)
![Language](https://img.shields.io/github/languages/top/mangata-finance/mangata-bridge)

Components for a Polkadot Ethereum Bridge

## Components

### Ethereum

This folder includes our Ethereum contracts, tests and truffle config.

See [ethereum/README.md](ethereum/README.md)

### Parachain

Parachain folder is removed since the pallets are integrated into the Mangata node.

### Relayer

This folder includes our Relayer daemon that will be run by relayers to watch and relay 2-way messages.

See [relayer/README.md](relayer/README.md)

### Tests

This folder includes our end to end tests, that pull together all the above services and set them up easily through scripts for automated E2E tests.

See [test/README.md](test/README.md)

## Usage

To test out and use the bridge, see each of the above READMEs in order and run through their steps, or just look through the test guide if that's all you need. The full functionality can then also be demonstrated using our [fork](https://github.com/Snowfork/substrate-ui) of the Polkadot-JS web application. Extra demo steps described [here](https://github.com/Snowfork/substrate-ui/tree/stable-base/packages/app-polkadot-ethereum-bridge).

## Security

The security policy and procedures can be found in SECURITY.md.

Current version is for testnet purposes only, security is not guaranteed.

## Deploying the bridge on Kovan

This folder includes the automated scripts used to deploy the bridge on Kovan.

See [/deploy-bridge/README.md](/deploy-bridge/README.md)


