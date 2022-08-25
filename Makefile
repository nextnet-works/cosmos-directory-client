MAINNET_DOMAIN ?= cosmos.directory
TESTNET_DOMAIN ?= testcosmos.directory

QUICKTYPE_ARGS ?= --alphabetize-properties --no-runtime-typecheck --src-lang json

prepare:
	pnpm install
	cd samples && $(MAKE) prepare

clean:
	cd samples && $(MAKE) clean NETWORK=mainnet && $(MAKE) clean NETWORK=testnet

all: node

node: samples tracery
	pnpm quicktype ${QUICKTYPE_ARGS} --src samples/chains/*.json --out node/types/chains.ts --top-level DirectoryChains
	pnpm quicktype ${QUICKTYPE_ARGS} --src-urls tracery/chain.json --out node/types/chain.ts --top-level DirectoryChain
	pnpm quicktype ${QUICKTYPE_ARGS} --src samples/status/*.json --out node/types/status.ts --top-level DirectoryStatus
	pnpm quicktype ${QUICKTYPE_ARGS} --src samples/validators/*.json --out node/types/validators.ts --top-level DirectoryValidators
	pnpm quicktype ${QUICKTYPE_ARGS} --src-urls tracery/validator.json --out node/types/validator.ts --top-level DirectoryValidator
	pnpm quicktype ${QUICKTYPE_ARGS} --src-urls tracery/chain-validators.json --out node/types/chain-validators.ts --top-level DirectoryChainValidators

samples: samples/mainnet samples/testnet

samples/mainnet:
	cd samples && $(MAKE) all DOMAIN=${MAINNET_DOMAIN} NETWORK=mainnet

samples/testnet:
	cd samples && $(MAKE) all DOMAIN=${TESTNET_DOMAIN} NETWORK=testnet

tracery: tracery/chain.json tracery/validator.json tracery/chain-validators.json

tracery/chain.json: samples
	cat samples/chains.mainnet.keys | sed "s/^/https:\/\/chains.${MAINNET_DOMAIN}\//" | sed "s/^/\"/" | sed "s/$$/\",/" > $@
	cat samples/chains.testnet.keys | sed "s/^/https:\/\/chains.${TESTNET_DOMAIN}\//" | sed "s/^/\"/" | sed "s/$$/\",/" >> $@
	echo "{\"directory-chain\":[{\"oneOf\":[$$(cat $@ | tr -d '\n' | sed "s/,$$//")]}]}" > $@

tracery/validator.json: samples
	cat samples/validators.mainnet.keys | sed "s/^/https:\/\/validators.${MAINNET_DOMAIN}\//" | sed "s/^/\"/" | sed "s/$$/\",/" > $@
	cat samples/validators.testnet.keys | sed "s/^/https:\/\/validators.${TESTNET_DOMAIN}\//" | sed "s/^/\"/" | sed "s/$$/\",/" >> $@
	echo "{\"directory-validator\":[{\"oneOf\":[$$(cat $@ | tr -d '\n' | sed "s/,$$//")]}]}" > $@

tracery/chain-validators.json: samples
	cat samples/chains.mainnet.keys | sed "s/^/https:\/\/validators.${MAINNET_DOMAIN}\/chains\//" | sed "s/^/\"/" | sed "s/$$/\",/" > $@
	cat samples/chains.testnet.keys | sed "s/^/https:\/\/validators.${TESTNET_DOMAIN}\/chains\//" | sed "s/^/\"/" | sed "s/$$/\",/" >> $@
	echo "{\"directory-chain-validators\":[{\"oneOf\":[$$(cat $@ | tr -d '\n' | sed "s/,$$//")]}]}" > $@
