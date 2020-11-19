#!/usr/bin/env bash

export PATH=$PATH:/usr/local/go/bin
cd mage
go run bootstrap.go
export PATH=$(go env GOPATH)/bin:$PATH
export PATH=/mnt/c/Users/"Gleb Urvanov"/workspace/substrate/target/release:$PATH
export ARTEMIS_SUBSTRATE_KEY=//Relay
export ARTEMIS_ETHEREUM_KEY=868da07c5dc9c313334de3a542bd576909cfc80ae2c727506e0c009e70da3f88