DOMAIN ?= cosmos.directory
NETWORK ?= mainnet

CHAINS_ENDPOINT ?= https://chains.${DOMAIN}
STATUS_ENDPOINT ?= https://status.${DOMAIN}
VALIDATORS_ENDPOINT ?= https://validators.${DOMAIN}

SAMPLE_DIRS := chains chain status validators validator chain-validators

prepare:
	mkdir -p $(foreach dir,${SAMPLE_DIRS},$(dir))
	touch $(foreach dir,${SAMPLE_DIRS},$(dir)/.gitkeep)

clean:
	rm -rf $(foreach dir,${SAMPLE_DIRS},$(dir)/)
	rm -rf $(foreach dir,${SAMPLE_DIRS},$(dir)*)
	rm ${NETWORK}

all: chains/${NETWORK}.json status/${NETWORK}.json validators/${NETWORK}.json chains.${NETWORK}.keys validators.${NETWORK}.keys
	touch ${NETWORK}

chains/${NETWORK}.json:
	curl -fsSL ${CHAINS_ENDPOINT} > $@

status/${NETWORK}.json:
	curl -fsSL ${STATUS_ENDPOINT} > $@

validators/${NETWORK}.json:
	curl -fsSL ${VALIDATORS_ENDPOINT} > $@

chains.${NETWORK}.keys: chains/${NETWORK}.json
	cat chains/${NETWORK}.json | jq -r '.chains[].path | @uri' | sort > $@

validators.${NETWORK}.keys: validators/${NETWORK}.json
	cat validators/${NETWORK}.json | jq -r '.validators[].path | @uri' | sort > $@
