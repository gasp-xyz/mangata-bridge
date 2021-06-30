pushd ../../ethereum

sleep 30s

# Generate configuration for relayer, parachain, and tests
truffle exec scripts/dumpRelayerDockerConfig.js --network kovan
sleep 30s
truffle exec scripts/dumpParachainDockerConfig.js --network kovan
sleep 30s
truffle exec scripts/dumpAddresses.js --network kovan
sleep 30s
popd

./update-mangataSpec.sh
