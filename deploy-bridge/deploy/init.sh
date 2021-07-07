#!/bin/bash

set -e

# config_init

# Seed/security phrase for depolying account
export MGA_Kovan_Bridge_MNEMONIC="gorilla emotion rare lunar solid install sand burden october supreme breeze wool"

# INFURA Project Id for Kovan
KOVAN_INFURA_PROJECT_ID="e8b4790b8e4049cca3c04f738cfa25f2"

# INFURA endpoints
MGA_Kovan_Bridge_INFURA_ENDPOINT_HTTPS="https://kovan.infura.io/v3/$KOVAN_INFURA_PROJECT_ID"
export MGA_Kovan_Bridge_INFURA_ENDPOINT_WS="wss://kovan.infura.io/ws/v3/$KOVAN_INFURA_PROJECT_ID"

# Parachain endpoint
export MGA_Kovan_Bridge_SUB_ENDPOINT="ws://parachain:9944/"

# Exports for truffle
export ETH_ENDPOINT_WS=$MGA_Kovan_Bridge_INFURA_ENDPOINT_WS
export SUB_ENDPOINT_WS=$MGA_Kovan_Bridge_SUB_ENDPOINT
export INFURA_PROJECT_ID=$KOVAN_INFURA_PROJECT_ID
export -p MNEMONIC=$MGA_Kovan_Bridge_MNEMONIC

# ETH truffle path
ETH_TRUFFLE_PATH="../../ethereum"

# Basepath for mangata-bridge
pushd ../../
BASE_PATH="$PWD"
popd

# Path to deploy-bridge
export BRIDGE_DEPLOY_PATH="$BASE_PATH/deploy-bridge"


# Variables required to deploy a parachain container locally
SUB_DIR="../../mangata-node/"

SUB_COMMAND="bash -c './target/release/mangata-node build-spec --chain=../config/mangataSpec.json --raw > ../config/mangataSpecRaw.json && ./target/release/mangata-node --alice --base-path /root/.local --rpc-cors all --ws-external --rpc-external --chain=../config/mangataSpecRaw.json'"

SUB_CHAIN_PORTS="[\"9944:9944\"]"


# Variables determining the parachain user used for tests
export SUB_CHAIN_RECEIPIENT="0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d"
export SUB_CHAIN_RECEIPIENTSS58="5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"

# setup for docker-compose 
yq e ".services.parachain.ports = $SUB_CHAIN_PORTS | .services.parachain.ports[0] style=\"double\"" -i ../docker-compose.yml
yq e ".services.parachain.volumes[0]=\"$SUB_DIR:/var/docker/mangata-custom-node\"" -i ../docker-compose.yml
yq e ".services.parachain.volumes[1]=\"$BRIDGE_DEPLOY_PATH/build/mangataSpec.json:/var/docker/config/mangataSpec.json\"" -i ../docker-compose.yml
yq e ".services.parachain.command=\"$SUB_COMMAND\"" -i ../docker-compose.yml


# Install relevant packages
yarn global add truffle

pushd ../../ethereum
yarn install
popd

pushd ../
yarn install
popd

# Build docker image (using the DockerFile) required to deploy a parachain container locally
docker build -f ./Dockerfile -t mangata/mangata-node .

# Transfer 1 eth from the 0th eth account (seed account) to 1st derived account this is required for tests
# Also dump the private keys and addreses of these two accounts
node -e "require(\"./ethAccountsSetup\").transferEth( '$MGA_Kovan_Bridge_MNEMONIC', '$MGA_Kovan_Bridge_INFURA_ENDPOINT_HTTPS').then(process.exit);"

# Set the 0th eth account as the one used by the relayer
ethPrivateKey0=$(node -e "require(\"./getPrivateKey\").getPrivateKeyFromSeed( '$MGA_Kovan_Bridge_MNEMONIC', '0').then((x)=>{process.stdout.write(x);}).then(process.exit);")
yq e ".services.relayer.environment.ARTEMIS_ETHEREUM_KEY=\"$ethPrivateKey0\"" -i ../docker-compose.yml

# Clean the build folder
pushd ../

sudo rm -rf build

mkdir build
mkdir build/parachain-state
mkdir build/relayer-config
touch build/parachain.env

popd

# Begin deployment starting with deploying the truffle contracts
./deploy-truffle.sh
