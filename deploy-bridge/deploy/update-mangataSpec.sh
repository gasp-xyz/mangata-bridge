#!/bin/bash

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


./deploy-services.sh
