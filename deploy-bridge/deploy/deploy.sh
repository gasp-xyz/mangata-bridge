#!/bin/bash


# deploy

yarn global add truffle
yarn global add ethereumjs-wallet
yarn global add dotenv

pushd ../
yarn add bip39
popd

pushd ../../ethereum
yarn install
popd

pushd ../
yarn install
popd

docker build -f ./Dockerfile -t mangata/mangata-node .

# transfer 1 eth to 1st derived account
node -e "require(\"./ethAccountsSetup\").transferEthAndDumpKeys( '$1', '$2').then(process.exit);"


ethPrivateKey0=$(grep ethPrivateKey0 ../.env | cut -d '=' -f 2-)


yq e ".services.relayer.environment.ARTEMIS_ETHEREUM_KEY=\"$ethPrivateKey0\"" -i ../docker-compose.yml

pushd ../
docker-compose down -v && sudo rm -rf ./build/parachain-state/* && ./tools/start-services.sh
popd
