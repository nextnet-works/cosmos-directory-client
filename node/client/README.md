[![npm/v](https://badgen.net/npm/v/cosmos-directory-client)](https://www.npmjs.com/package/cosmos-directory-client)
[![npm/dt](https://badgen.net/npm/dt/cosmos-directory-client)](https://www.npmjs.com/package/cosmos-directory-client)
[![stars](https://badgen.net/github/stars/strangelove-ventures/cosmos-directory-client)](https://github.com/strangelove-ventures/cosmos-directory-client)

# cosmos-directory-client

JavaScript client for fetching cosmos.directory endpoints 🛵

## Installing

```sh
# using npm
npm install cosmos-directory-client

# using yarn
yarn add cosmos-directory-client

# using pnpm
pnpm add cosmos-directory-client
```

## Basic example

**Creating client**

You can create the directory client via class or using helper functions:

```ts
import { DirectoryClient, createClient, createTestnetClient } from "cosmos-directory-client";

const client = new DirectoryClient({ ... });
const clientAlt = createClient({ ... });
const testnetClient = createTestnetClient({ ... });
```

All clients defaults to https://cosmos.directory and https://testcosmos.directory for testnet client. You can pass optional arguments on instantiation.

**Using client**

All fetcher functions uses the built-in `fetch` object. You can pass custom `fetch` implementation when instantiating the client.

```ts
const { chains } = await client.fetchChains();
const { chain } = await client.fetchChain("juno");
const { chains } = await client.fetchStatus();
const { validators } = await client.fetchValidators();
const { validator } = await client.fetchValidator("frens");
```

## API

View library APIs via paka.dev: https://paka.dev/npm/cosmos-directory-client

## License

[MIT License, Copyright (c) 2022 Strangelove Ventures](./LICENSE)
