#!/bin/bash


# deploy the ethereum contracts

pushd ../../ethereum

truffle deploy --reset --network kovan
popd

# Execute the truffle scripts to obtain contract deployment details 
./exec-truffle-scripts.sh
