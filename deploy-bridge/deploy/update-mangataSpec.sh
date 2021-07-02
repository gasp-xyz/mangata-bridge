#!/bin/bash

# Get the relevant truffle contract details from env
ethAppAddress=`jq .ETHApp ../build/address.json`
ERC20AppAddress=`jq .ERC20App ../build/address.json`
mangataTokenAddress=`jq .MangataToken ../build/address.json`

pushd hex2bytes
# Transform the App addresses to bytes
ethAppAddressBytes=`eval "cargo run ethAppAddress $ethAppAddress" | tr -d '"'`
ERC20AppAddressBytes=`eval "cargo run ERC20AppAddress $ERC20AppAddress" | tr -d '"'`
popd

# Manually update the mangataSpec
echo ETHApp=$ethAppAddressBytes
echo ERC20App=$ERC20AppAddressBytes
echo mangataTokenAddress=$mangataTokenAddress
echo "Please update deploy-bridge/deploy/mangataSpec.json with the above values."
read -n1 -r -p "Press any key to continue:" dummyInput

# Copy mangataSpec into the build folder
cp ./mangataSpec.json ../build/mangataSpec.json

# Deploy the containers
./deploy-services.sh
