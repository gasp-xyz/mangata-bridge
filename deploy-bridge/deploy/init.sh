#!/bin/bash

set -e

# config_init

# Seed/security phrase for depolying account
MGA_Kovan_Bridge_MNEMONIC="gorilla emotion rare lunar solid install sand burden october supreme breeze wool"

# INFURA Project Id for Kovan
KOVAN_INFURA_PROJECT_ID="e8b4790b8e4049cca3c04f738cfa25f2"

# INFURA endpoints
MGA_Kovan_Bridge_INFURA_ENDPOINT_HTTPS="https://kovan.infura.io/v3/$KOVAN_INFURA_PROJECT_ID"
MGA_Kovan_Bridge_INFURA_ENDPOINT_WS="wss://kovan.infura.io/ws/v3/$KOVAN_INFURA_PROJECT_ID"

# Parachain endpoint
MGA_Kovan_Bridge_SUB_ENDPOINT="ws://parachain:9944/"

# ETH truffle path
ETH_TRUFFLE_PATH="../../ethereum"

# Basepath for mangata-bridge
BASE_PATH="$PWD/../.."

# Path to deploy-bridge
BRIDGE_DEPLOY_PATH="$BASE_PATH/deploy-bridge"


# variables required to deploy a parachain container locally
SUB_DIR="../../mangata-node/"

SUB_COMMAND="bash -c './target/release/mangata-node build-spec --chain=../config/mangataSpec.json --raw > ../config/mangataSpecRaw.json && ./target/release/mangata-node --alice --base-path /root/.local --rpc-cors all --ws-external --rpc-external --chain=../config/mangataSpecRaw.json'"

SUB_CHAIN_PORTS="[\"9944:9944\"]"


# variables determining the parachain user used for tests
SUB_CHAIN_RECEIPIENT="0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d"
SUB_CHAIN_RECEIPIENTSS58="5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"


# setup of env variables
touch "$ETH_TRUFFLE_PATH/.env"

echo "MNEMONIC=$MGA_Kovan_Bridge_MNEMONIC" > "$ETH_TRUFFLE_PATH/.env"
echo "INFURA_PROJECT_ID=$KOVAN_INFURA_PROJECT_ID" >> "$ETH_TRUFFLE_PATH/.env"
echo "BRIDGE_DEPLOY_PATH=$BRIDGE_DEPLOY_PATH" >> "$ETH_TRUFFLE_PATH/.env"
echo "ETH_ENDPOINT_WS=$MGA_Kovan_Bridge_INFURA_ENDPOINT_WS" >> "$ETH_TRUFFLE_PATH/.env"
echo "SUB_ENDPOINT_WS=$MGA_Kovan_Bridge_SUB_ENDPOINT" >> "$ETH_TRUFFLE_PATH/.env"

touch "../.env"

echo "SUB_CHAIN_RECEIPIENT=$SUB_CHAIN_RECEIPIENT" > "../.env"
echo "SUB_CHAIN_RECEIPIENTSS58=$SUB_CHAIN_RECEIPIENTSS58" >> "../.env"
echo "ETH_ENDPOINT=$MGA_Kovan_Bridge_INFURA_ENDPOINT_HTTPS" >> "../.env"
echo "SUB_ENDPOINT=$MGA_Kovan_Bridge_SUB_ENDPOINT" >> "../.env"


yq e ".services.parachain.ports = $SUB_CHAIN_PORTS | .services.parachain.ports[0] style=\"double\"" -i ../docker-compose.yml
yq e ".services.parachain.volumes[0]=\"$SUB_DIR:/var/docker/mangata-custom-node\"" -i ../docker-compose.yml
yq e ".services.parachain.volumes[1]=\"./build/mangataSpec.json:/var/docker/config/mangataSpec.json\"" -i ../docker-compose.yml
yq e ".services.parachain.command=\"$SUB_COMMAND\"" -i ../docker-compose.yml


# install relevant packages
yarn global add truffle

pushd ../../ethereum
yarn install
popd

pushd ../
yarn install
popd

# Build docker image (using the DockerFile) required to deploy a parachain container locally
docker build -f ./Dockerfile -t mangata/mangata-node .

# transfer 1 eth from the 0th eth account (seed account) to 1st derived account this is required for tests
# Also dump the private keys and addreses of these two accounts
node -e "require(\"./ethAccountsSetup\").transferEthAndDumpKeys( '$MGA_Kovan_Bridge_MNEMONIC', '$MGA_Kovan_Bridge_INFURA_ENDPOINT_HTTPS').then(process.exit);"

# Set the 0th eth account as the one used by the relayer
ethPrivateKey0=$(grep ethPrivateKey0 ../.env | cut -d '=' -f 2-)
yq e ".services.relayer.environment.ARTEMIS_ETHEREUM_KEY=\"$ethPrivateKey0\"" -i ../docker-compose.yml

# Clean the build folder
pushd ../

sudo rm -rf build

mkdir build
mkdir build/parachain-state
mkdir build/relayer-config
touch build/parachain.env

popd

# begin deployment starting with deploying the truffle contracts
./deploy-truffle.sh
