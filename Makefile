DIRECTORY_PROTOCOL ?= https
DIRECTORY_DOMAIN ?= cosmos.directory

CHAINS_ENDPOINT ?= ${DIRECTORY_PROTOCOL}://chains.${DIRECTORY_DOMAIN}
STATUS_ENDPOINT ?= ${DIRECTORY_PROTOCOL}://status.${DIRECTORY_DOMAIN}
VALIDATORS_ENDPOINT ?= ${DIRECTORY_PROTOCOL}://validators.${DIRECTORY_DOMAIN}

prepare:
	pnpm install
	echo "{\"chain\":[\"${CHAINS_ENDPOINT}/\",{\"oneOf\":[$$(curl -fsSL ${CHAINS_ENDPOINT} | jq '.chains[].path | @uri' | tr -d '\n' | sed 's/""/","/g')]}]}" > .chain-tracery
	echo "{\"validator\":[\"${VALIDATORS_ENDPOINT}/\",{\"oneOf\":[$$(curl -fsSL ${VALIDATORS_ENDPOINT} | jq '.validators[].path | @uri' | tr -d '\n' | sed 's/""/","/g')]}]}" > .validator-tracery
	echo "{\"chain-validators\":[\"${VALIDATORS_ENDPOINT}/chains/\",{\"oneOf\":[$$(curl -fsSL ${CHAINS_ENDPOINT} | jq '.chains[].path | @uri' | tr -d '\n' | sed 's/""/","/g')]}]}" > .chain-validators-tracery

all: chains chain status validators validator chain-validators

chains:
	pnpm exec quicktype \
		--src ${CHAINS_ENDPOINT} \
		--out node/types/chains.ts \
		--alphabetize-properties \
		--top-level DirectoryChains

chain:
	pnpm exec quicktype \
		--src-urls .chain-tracery \
		--src-lang json \
		--out node/types/chain.ts \
		--alphabetize-properties \
		--top-level DirectoryChain

status:
	pnpm exec quicktype \
		--src ${STATUS_ENDPOINT} \
		--out node/types/status.ts \
		--alphabetize-properties \
		--top-level DirectoryStatus

validators:
	pnpm exec quicktype \
		--src ${VALIDATORS_ENDPOINT} \
		--out node/types/validators.ts \
		--alphabetize-properties \
		--top-level DirectoryValidators

validator:
	pnpm exec quicktype \
		--src-urls .validator-tracery \
		--src-lang json \
		--out node/types/validator.ts \
		--alphabetize-properties \
		--top-level DirectoryValidator

chain-validators:
	pnpm exec quicktype \
		--src-urls .chain-validators-tracery \
		--src-lang json \
		--out node/types/chain-validators.ts \
		--alphabetize-properties \
		--top-level DirectoryChainValidators
