#!/bin/bash

pushd ../
docker-compose down -v && sudo rm -rf ./build/parachain-state/*


# Start Parachain
docker-compose up -d parachain
./tools/wait-for-it.sh localhost:9944 -- echo "Parachain is up"

sleep 30s

# Start Relayer
docker-compose up -d relayer
popd
