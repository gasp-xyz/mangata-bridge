#!/bin/bash


# deploy

pushd ../../ethereum

truffle deploy --reset --network kovan
popd

./exec-truffle-scripts.sh
