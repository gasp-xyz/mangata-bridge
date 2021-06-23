#!/bin/bash

mkdir build
mkdir build/parachain-state
mkdir build/relayer-config
touch build/parachain.env

# # Start Ganache
# docker-compose up -d ganache
# tools/wait-for-it.sh localhost:8545 -- echo "Ganache is up"

# pushd ../ethereum
#
# # Deploy contracts
# truffle deploy --network kovan
#
# # Generate configuration for relayer, parachain, and tests
# truffle exec scripts/dumpRelayerDockerConfig.js --network kovan
# truffle exec scripts/dumpParachainDockerConfig.js --network kovan
# truffle exec scripts/dumpAddresses.js --network kovan
# popd

# Start Parachain
docker-compose up -d parachain
tools/wait-for-it.sh localhost:9944 -- echo "Parachain is up"

sleep 10s

# Start Relayer
docker-compose up -d relayer
