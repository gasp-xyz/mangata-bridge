#!/bin/bash


# Deploy the ethereum contracts

pushd ../../ethereum
echo $MNEMONIC
truffle deploy --reset --network kovan
popd

# Execute the truffle scripts to obtain contract deployment details 
# ./exec-truffle-scripts.sh
