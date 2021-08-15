#!/bin/bash

# Deploy the ethereum contracts

pushd ../ethereum
echo $MNEMONIC
echo $INFURA_PROJECT_ID
truffle migrate --network kovan --to 2 --reset
popd