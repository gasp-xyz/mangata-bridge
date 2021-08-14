# Basepath for mangata-bridge
pushd ../
BASE_PATH="$PWD"
popd

# Path to deploy-bridge
export BRIDGE_CONTRACTS_DEPLOY_PATH="$BASE_PATH/deploy-eth-bridge-contracts"

# Deploy the ethereum contracts

pushd ../ethereum
echo $MNEMONIC
echo $INFURA_PROJECT_ID
truffle migrate -f 1 --to 2 --network kovan
popd