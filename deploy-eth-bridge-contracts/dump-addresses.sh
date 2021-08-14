#!/bin/bash

pushd ../ethereum

# sleep 30s

# Dump addresses
truffle exec scripts/dumpBridgeAddresses.js --network kovan

popd
