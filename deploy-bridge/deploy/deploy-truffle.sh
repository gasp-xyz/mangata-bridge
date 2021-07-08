#!/bin/bash


# Deploy the ethereum contracts

pushd ../../ethereum
echo $MNEMONIC
echo $INFURA_PROJECT_ID
truffle deploy --reset --network kovan
popd

# Execute the truffle scripts to obtain contract deployment details 
./exec-truffle-scripts.sh
