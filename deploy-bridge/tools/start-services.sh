#!/bin/bash

set -e

rm -rf build

mkdir build
mkdir build/parachain-state
mkdir build/relayer-config
touch build/parachain.env

pushd ../ethereum

# TODO Uncomment
# Deploy contracts
# truffle deploy --reset --network kovan

# Generate configuration for relayer, parachain, and tests
truffle exec scripts/dumpRelayerDockerConfig.js --network kovan
truffle exec scripts/dumpParachainDockerConfig.js --network kovan
truffle exec scripts/dumpAddresses.js --network kovan
popd

pushd ./deploy

ethAppAddress=`jq .ETHApp ../build/address.json`
ERC20AppAddress=`jq .ERC20App ../build/address.json`
mangataTokenAddress=`jq .MangataToken ../build/address.json`



pushd hex2bytes
ethAppAddressBytes=`eval "cargo run ethAppAddress $ethAppAddress" | tr -d '"'`
ERC20AppAddressBytes=`eval "cargo run ERC20AppAddress $ERC20AppAddress" | tr -d '"'`
mangataTokenAddressBytes=`eval "cargo run mangataTokenAddress $mangataTokenAddress" | tr -d '"'`
popd



jq --raw-output ".genesis.runtime.bridge.bridgedAppIdRegistry[0][0] = \"ETH\"" ./mangataSpec.json > ./tmp.mangataSpec.json && mv ./tmp.mangataSpec.json ./mangataSpec.json
jq --raw-output ".genesis.runtime.bridge.bridgedAppIdRegistry[1][0] = \"ERC20\"" ./mangataSpec.json > ./tmp.mangataSpec.json && mv ./tmp.mangataSpec.json ./mangataSpec.json
jq --raw-output --arg ethAppAddressBytes "$ethAppAddressBytes" ".genesis.runtime.bridge.bridgedAppIdRegistry[0][1] = $ethAppAddressBytes" ./mangataSpec.json > ./tmp.mangataSpec.json && mv ./tmp.mangataSpec.json ./mangataSpec.json
jq --raw-output --arg ERC20AppAddressBytes "$ERC20AppAddressBytes" ".genesis.runtime.bridge.bridgedAppIdRegistry[1][1] = $ERC20AppAddressBytes" ./mangataSpec.json > ./tmp.mangataSpec.json && mv ./tmp.mangataSpec.json ./mangataSpec.json

# TODO add code to change MGA token as well in chain spec

# echo $ethAppAddressBytes
# echo $ERC20AppAddressBytes
# echo $mangataTokenAddressBytes

cp ./mangataSpec.json ../build/
popd

# Start Parachain
docker-compose up -d parachain
tools/wait-for-it.sh localhost:9944 -- echo "Parachain is up"

sleep 10s

# Start Relayer
docker-compose up -d relayer
