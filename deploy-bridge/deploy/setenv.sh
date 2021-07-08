# Seed/security phrase for depolying account
export MGA_Kovan_Bridge_MNEMONIC="gorilla emotion rare lunar solid install sand burden october supreme breeze wool"

# INFURA Project Id for Kovan
export KOVAN_INFURA_PROJECT_ID="44a296fce7bf4ad79e21b1c2002d34d1"

# INFURA endpoints
export MGA_Kovan_Bridge_INFURA_ENDPOINT_HTTPS="https://kovan.infura.io/v3/$KOVAN_INFURA_PROJECT_ID"
export MGA_Kovan_Bridge_INFURA_ENDPOINT_WS="wss://kovan.infura.io/ws/v3/$KOVAN_INFURA_PROJECT_ID"

# Parachain endpoint
export MGA_Kovan_Bridge_SUB_ENDPOINT="ws://localhost:9944/"
export MGA_Kovan_Bridge_SUB_ENDPOINT_DOCKER="ws://parachain:9944/"


# Exports for truffle
export ETH_ENDPOINT_WS=$MGA_Kovan_Bridge_INFURA_ENDPOINT_WS
export SUB_ENDPOINT_WS=$MGA_Kovan_Bridge_SUB_ENDPOINT_DOCKER
export INFURA_PROJECT_ID=$KOVAN_INFURA_PROJECT_ID
export MNEMONIC=$MGA_Kovan_Bridge_MNEMONIC

# Variables required to deploy a parachain container locally
export SUB_DIR="../../mangata-node/"
export SUB_COMMAND="bash -c './target/release/mangata-node build-spec --chain=../config/mangataSpec.json --raw > ../config/mangataSpecRaw.json && ./target/release/mangata-node --alice --base-path /root/.local --rpc-cors all --ws-external --rpc-external --chain=../config/mangataSpecRaw.json'"
export SUB_CHAIN_PORTS="[\"9944:9944\"]"


# Variables determining the parachain user used for tests
export SUB_CHAIN_RECEIPIENT="0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d"
export SUB_CHAIN_RECEIPIENTSS58="5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"