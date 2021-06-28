#!/bin/bash


# deploy

yarn global add truffle
yarn global add ethereumjs-wallet
yarn global add dotenv

pushd ../../ethereum
yarn install
popd

pushd ../
yarn install
popd

docker build -f ./Dockerfile -t mangata/mangata-node .

# transfer 1 eth to 1st derived account
node -e "require(\"./ethAccountsSetup\").transferEthAndDumpKeys( '$1', '$2').then(process.exit);"

pushd ../
docker-compose down -v && sudo rm -rf ./build/parachain-state/* && ./tools/start-services.sh
popd
