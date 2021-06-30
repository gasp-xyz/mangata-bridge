#!/bin/bash

set -e

rm -rf build

mkdir build
mkdir build/parachain-state
mkdir build/relayer-config
touch build/parachain.env

pushd ../ethereum

# TODO Uncomment
truffle deploy --reset --network kovan
# truffle deploy --network kovan

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
popd

echo $ethAppAddressBytes
echo $ERC20AppAddressBytes
echo $mangataTokenAddress
echo "Please update deploy-bridge/deploy/mangataSpec.json with the above values."
read -n1 -r -p "Press any key to continue:" dummyInput


cp ./mangataSpec.json ../build/mangataSpec.json
popd

# Start Parachain
docker-compose up -d parachain
tools/wait-for-it.sh localhost:9944 -- echo "Parachain is up"

sleep 10s

# Start Relayer
docker-compose up -d relayer
