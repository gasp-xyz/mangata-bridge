#!/bin/bash

set -e

pushd ../../ethereum

sleep 30s

# Generate configuration for relayer, parachain, and tests based on the details of the contracts deployed by truffle
truffle exec scripts/dumpRelayerDockerConfig.js --network kovan
sleep 30s
truffle exec scripts/dumpParachainDockerConfig.js --network kovan
sleep 30s
truffle exec scripts/dumpAddresses.js --network kovan
sleep 30s
popd

# Update the mangataSpec file to use the truffle contract details
./update-mangataSpec.sh
