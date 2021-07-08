# Deploy bridge on Kovan
## Requirements
1. Compiled mangata-node in SUB_DIR path
2. Around 1.5 KETH in seed account (The one whose MNEMONIC is used)
3. jq installed
4. yq v4 installed
5. A copy of the mangataSpec.json consistent with the parachain used. (from the compiled mangata-node in SUB_DIR you can use `./target/releases/mangata-node build-spec > mangataSpec.json` to generate it.)

## Steps to deploy bridge
1. Setup the env variables in setenv.sh
    - MGA_Kovan_Bridge_MNEMONIC - This is the seed phrase for the seed account that will be used on the Ethereum chain. All accounts are derived from and all contracts are deployed using this account.
	- SUB_DIR - This is the path to the mangata-node folder. This should contain the compiled node.
	- KOVAN_INFURA_PROJECT_ID - This is the project ID that is used to connect to Kovan via Infura. No project secret or JWT is required.
	- MGA_Kovan_Bridge_SUB_ENDPOINT_DOCKER - This is the endpoint for the substrate chain and should be consistent with SUB_CHAIN_PORTS and the parachain container's docker label.
	- MGA_Kovan_Bridge_SUB_ENDPOINT - Similar to MGA_Kovan_Bridge_SUB_ENDPOINT_DOCKER, but targets localhost instead of the docker label so that the docker contained parachain can be accessed externally.
	- SUB_COMMAND - The command used to deploy the docker parachain. Does not normally need to be customized for typical deployments.
	- SUB_CHAIN_PORTS - The setting used to expose the ports of the docker parachain ports. Should be consistent with MGA_Kovan_Bridge_SUB_ENDPOINT and MGA_Kovan_Bridge_SUB_ENDPOINT_DOCKER.
	- SUB_CHAIN_RECEIPIENT - The parachain user used for tests.
	- SUB_CHAIN_RECEIPIENTSS58 - SS58 form of SUB_CHAIN_RECEIPIENT.

2. Run `source setenv.sh && bash init.sh` from /deploy-bridge/deploy
    - This command will setup the env files, deploy contracts, and deploy the docker services.
	- It will require you to enter the sudo password.
	- It will ask you to update the mangataSpec.json manually providing the values to be used.
	- The flow is as follows := setenv.sh && init.sh -> deploy-truffle.sh -> exec-truffle-scripts.sh -> update-mangataSpec.sh -> deploy-services.sh

## Testing the deployment
You can test the bridge deployment by running yarn test. This will use the variables exported from setenv.sh and the address.json in the build folder.
Relevant env variables:
1. MGA_Kovan_Bridge_INFURA_ENDPOINT_WS
2. MGA_Kovan_Bridge_SUB_ENDPOINT
3. MGA_Kovan_Bridge_MNEMONIC
4. SUB_CHAIN_RECEIPIENT
5. SUB_CHAIN_RECEIPIENTSS58

Relevant address.json contract address variables:
1. ETHApp
2. ERC20App
3. TestToken
4. MangataToken
