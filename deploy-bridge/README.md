# Deploy bridge on Kovan
## Requirements
1. Compiled mangata-node in SUB_DIR path
2. Around 1.5 KETH in seed account (The one whose MNEMONIC is used)
3. yq v4 installed
4. A copy of the mangataSpec.json consistent with the parachain used. (from the compiled mangata-node in SUB_DIR you can use `./target/releases/mangata-node build-spec > mangataSpec.json` to generate it.)

## Steps to deploy bridge
1. Setup the env variables in init.sh
    - MGA_Kovan_Bridge_MNEMONIC - This is the seed phrase for the seed account that will be used on the Ethereum chain. All accounts are derived from and all contracts are deployed using this account.
	- SUB_DIR - This is the path to the mangata-node folder. This should contain the compiled node.
	- MGA_Kovan_Bridge_SUB_ENDPOINT - This is the endpoint for the substrate chain and should be consistent with SUB_CHAIN_PORTS and the parachain container's docker label.
2. Run `bash init.sh` from /deploy-bridge/deploy
    - This command will setup the env files, deploy contracts, and deploy the docker services.
	- It will require you to enter the sudo password.
	- It will ask you to update the mangataSpec.json manually providing the values to be used.
	- The flow is as follows := init.sh -> deploy-truffle.sh -> exec-truffle-scripts.sh -> update-mangataSpec.sh -> deploy-services.sh

## Testing the deployment
You can test the bridge deployment by running yarn test. This will use the above setup env.
