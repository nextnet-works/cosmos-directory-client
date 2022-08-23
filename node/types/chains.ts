// To parse this data:
//
//   import { Convert, DirectoryChains } from "./file";
//
//   const directoryChains = Convert.toDirectoryChains(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface DirectoryChains {
    chains:     Chain[];
    repository: Repository;
}

export interface Chain {
    assets?:       Asset[];
    best_apis:     BestApis;
    chain_id:      string;
    chain_name:    string;
    coingecko_id?: string;
    decimals?:     number;
    denom?:        string;
    display?:      string;
    explorers?:    Explorer[];
    height:        number | null;
    image?:        string;
    name:          string;
    network_type:  NetworkType;
    params?:       Params;
    path:          string;
    pretty_name:   string;
    prices?:       ChainPrices;
    services?:     Services;
    status:        Status;
    symbol?:       string;
}

export interface Asset {
    base:          Base;
    coingecko_id?: string;
    decimals:      number;
    denom:         string;
    denom_units:   Base[];
    description?:  string;
    display?:      Base;
    image?:        string;
    logo_URIs?:    LogoURIs;
    name:          string;
    prices?:       AssetPrices;
    symbol:        string;
}

export interface Base {
    aliases?: string[];
    denom:    string;
    exponent: number;
}

export interface LogoURIs {
    png?: string;
    svg?: string;
}

export interface AssetPrices {
    coingecko: Coingecko;
}

export interface Coingecko {
    usd: number;
}

export interface BestApis {
    rest: REST[];
    rpc:  RPC[];
}

export interface REST {
    address:   string;
    provider?: string;
}

export interface RPC {
    address:   string;
    archive?:  boolean;
    provider?: string;
}

export interface Explorer {
    account_page?: string;
    kind?:         string;
    name?:         string;
    tx_page?:      string;
    url:           string;
}

export enum NetworkType {
    Mainnet = "mainnet",
}

export interface Params {
    actual_block_time:        number;
    actual_blocks_per_year:   number;
    annual_provision?:        string;
    authz:                    boolean;
    base_inflation?:          number;
    block_time?:              number;
    blocks_per_year?:         number;
    bonded_ratio?:            number | null;
    bonded_tokens?:           string;
    calculated_apr:           number | null;
    community_tax?:           number;
    distribution?:            Distribution;
    epoch_duration?:          number;
    estimated_apr?:           number | null;
    inflation?:               Inflation;
    max_validators?:          number;
    mint?:                    Mint;
    minting_epoch_provision?: number;
    slashing?:                Slashing;
    staking?:                 Staking;
    total_supply?:            string;
    unbonding_time?:          number;
    year_minting_provision?:  number;
}

export interface Distribution {
    base_proposer_reward:       string;
    bonus_proposer_reward:      string;
    community_tax:              string;
    liquidity_provider_reward?: string;
    secret_foundation_address?: string;
    secret_foundation_tax?:     string;
    withdraw_addr_enabled:      boolean;
}

export interface Inflation {
    enable_inflation:        boolean;
    exponential_calculation: ExponentialCalculation;
    inflation_distribution:  InflationDistribution;
    mint_denom:              string;
}

export interface ExponentialCalculation {
    a:              string;
    bonding_target: string;
    c:              string;
    max_variance:   string;
    r:              string;
}

export interface InflationDistribution {
    community_pool:   string;
    staking_rewards:  string;
    usage_incentives: string;
}

export interface Mint {
    blocks_per_year?:                          string;
    distribution_proportions?:                 DistributionProportions;
    epoch_identifier?:                         string;
    genesis_epoch_provisions?:                 string;
    goal_bonded?:                              string;
    inflation_max?:                            string;
    inflation_min?:                            string;
    inflation_rate?:                           string;
    inflation_rate_change?:                    string;
    mint_denom:                                string;
    minting_rewards_distribution_start_epoch?: string;
    reduction_factor?:                         string;
    reduction_period_in_epochs?:               string;
    weighted_developer_rewards_receivers?:     WeightedDeveloperRewardsReceiver[];
}

export interface DistributionProportions {
    community_pool:    string;
    developer_rewards: string;
    pool_incentives:   string;
    staking:           string;
}

export interface WeightedDeveloperRewardsReceiver {
    address: string;
    weight:  string;
}

export interface Slashing {
    downtime_jail_duration:     string;
    min_signed_per_window:      string;
    signed_blocks_window:       string;
    slash_fraction_double_sign: string;
    slash_fraction_downtime:    string;
}

export interface Staking {
    bond_denom:           string;
    historical_entries:   number;
    max_entries:          number;
    max_validators:       number;
    min_commission_rate?: string;
    unbonding_time:       string;
}

export interface ChainPrices {
    coingecko: { [key: string]: Coingecko };
}

export interface Services {
    staking_rewards?: StakingRewards;
}

export interface StakingRewards {
    name:   string;
    slug:   string;
    symbol: string;
}

export enum Status {
    Killed = "killed",
    Live = "live",
}

export interface Repository {
    branch:    string;
    commit:    string;
    timestamp: number;
    url:       string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toDirectoryChains(json: string): DirectoryChains {
        return cast(JSON.parse(json), r("DirectoryChains"));
    }

    public static directoryChainsToJson(value: DirectoryChains): string {
        return JSON.stringify(uncast(value, r("DirectoryChains")), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any = ''): never {
    if (key) {
        throw Error(`Invalid value for key "${key}". Expected type ${JSON.stringify(typ)} but got ${JSON.stringify(val)}`);
    }
    throw Error(`Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`, );
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases, val);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue("array", val);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue("Date", val);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue("object", val);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, prop.key);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val);
    }
    if (typ === false) return invalidValue(typ, val);
    while (typeof typ === "object" && typ.ref !== undefined) {
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "DirectoryChains": o([
        { json: "chains", js: "chains", typ: a(r("Chain")) },
        { json: "repository", js: "repository", typ: r("Repository") },
    ], false),
    "Chain": o([
        { json: "assets", js: "assets", typ: u(undefined, a(r("Asset"))) },
        { json: "best_apis", js: "best_apis", typ: r("BestApis") },
        { json: "chain_id", js: "chain_id", typ: "" },
        { json: "chain_name", js: "chain_name", typ: "" },
        { json: "coingecko_id", js: "coingecko_id", typ: u(undefined, "") },
        { json: "decimals", js: "decimals", typ: u(undefined, 0) },
        { json: "denom", js: "denom", typ: u(undefined, "") },
        { json: "display", js: "display", typ: u(undefined, "") },
        { json: "explorers", js: "explorers", typ: u(undefined, a(r("Explorer"))) },
        { json: "height", js: "height", typ: u(0, null) },
        { json: "image", js: "image", typ: u(undefined, "") },
        { json: "name", js: "name", typ: "" },
        { json: "network_type", js: "network_type", typ: r("NetworkType") },
        { json: "params", js: "params", typ: u(undefined, r("Params")) },
        { json: "path", js: "path", typ: "" },
        { json: "pretty_name", js: "pretty_name", typ: "" },
        { json: "prices", js: "prices", typ: u(undefined, r("ChainPrices")) },
        { json: "services", js: "services", typ: u(undefined, r("Services")) },
        { json: "status", js: "status", typ: r("Status") },
        { json: "symbol", js: "symbol", typ: u(undefined, "") },
    ], false),
    "Asset": o([
        { json: "base", js: "base", typ: r("Base") },
        { json: "coingecko_id", js: "coingecko_id", typ: u(undefined, "") },
        { json: "decimals", js: "decimals", typ: 0 },
        { json: "denom", js: "denom", typ: "" },
        { json: "denom_units", js: "denom_units", typ: a(r("Base")) },
        { json: "description", js: "description", typ: u(undefined, "") },
        { json: "display", js: "display", typ: u(undefined, r("Base")) },
        { json: "image", js: "image", typ: u(undefined, "") },
        { json: "logo_URIs", js: "logo_URIs", typ: u(undefined, r("LogoURIs")) },
        { json: "name", js: "name", typ: "" },
        { json: "prices", js: "prices", typ: u(undefined, r("AssetPrices")) },
        { json: "symbol", js: "symbol", typ: "" },
    ], false),
    "Base": o([
        { json: "aliases", js: "aliases", typ: u(undefined, a("")) },
        { json: "denom", js: "denom", typ: "" },
        { json: "exponent", js: "exponent", typ: 0 },
    ], false),
    "LogoURIs": o([
        { json: "png", js: "png", typ: u(undefined, "") },
        { json: "svg", js: "svg", typ: u(undefined, "") },
    ], false),
    "AssetPrices": o([
        { json: "coingecko", js: "coingecko", typ: r("Coingecko") },
    ], false),
    "Coingecko": o([
        { json: "usd", js: "usd", typ: 3.14 },
    ], false),
    "BestApis": o([
        { json: "rest", js: "rest", typ: a(r("REST")) },
        { json: "rpc", js: "rpc", typ: a(r("RPC")) },
    ], false),
    "REST": o([
        { json: "address", js: "address", typ: "" },
        { json: "provider", js: "provider", typ: u(undefined, "") },
    ], false),
    "RPC": o([
        { json: "address", js: "address", typ: "" },
        { json: "archive", js: "archive", typ: u(undefined, true) },
        { json: "provider", js: "provider", typ: u(undefined, "") },
    ], false),
    "Explorer": o([
        { json: "account_page", js: "account_page", typ: u(undefined, "") },
        { json: "kind", js: "kind", typ: u(undefined, "") },
        { json: "name", js: "name", typ: u(undefined, "") },
        { json: "tx_page", js: "tx_page", typ: u(undefined, "") },
        { json: "url", js: "url", typ: "" },
    ], false),
    "Params": o([
        { json: "actual_block_time", js: "actual_block_time", typ: 3.14 },
        { json: "actual_blocks_per_year", js: "actual_blocks_per_year", typ: 3.14 },
        { json: "annual_provision", js: "annual_provision", typ: u(undefined, "") },
        { json: "authz", js: "authz", typ: true },
        { json: "base_inflation", js: "base_inflation", typ: u(undefined, 3.14) },
        { json: "block_time", js: "block_time", typ: u(undefined, 3.14) },
        { json: "blocks_per_year", js: "blocks_per_year", typ: u(undefined, 0) },
        { json: "bonded_ratio", js: "bonded_ratio", typ: u(undefined, u(3.14, null)) },
        { json: "bonded_tokens", js: "bonded_tokens", typ: u(undefined, "") },
        { json: "calculated_apr", js: "calculated_apr", typ: u(3.14, null) },
        { json: "community_tax", js: "community_tax", typ: u(undefined, 3.14) },
        { json: "distribution", js: "distribution", typ: u(undefined, r("Distribution")) },
        { json: "epoch_duration", js: "epoch_duration", typ: u(undefined, 0) },
        { json: "estimated_apr", js: "estimated_apr", typ: u(undefined, u(3.14, null)) },
        { json: "inflation", js: "inflation", typ: u(undefined, r("Inflation")) },
        { json: "max_validators", js: "max_validators", typ: u(undefined, 0) },
        { json: "mint", js: "mint", typ: u(undefined, r("Mint")) },
        { json: "minting_epoch_provision", js: "minting_epoch_provision", typ: u(undefined, 3.14) },
        { json: "slashing", js: "slashing", typ: u(undefined, r("Slashing")) },
        { json: "staking", js: "staking", typ: u(undefined, r("Staking")) },
        { json: "total_supply", js: "total_supply", typ: u(undefined, "") },
        { json: "unbonding_time", js: "unbonding_time", typ: u(undefined, 0) },
        { json: "year_minting_provision", js: "year_minting_provision", typ: u(undefined, 0) },
    ], false),
    "Distribution": o([
        { json: "base_proposer_reward", js: "base_proposer_reward", typ: "" },
        { json: "bonus_proposer_reward", js: "bonus_proposer_reward", typ: "" },
        { json: "community_tax", js: "community_tax", typ: "" },
        { json: "liquidity_provider_reward", js: "liquidity_provider_reward", typ: u(undefined, "") },
        { json: "secret_foundation_address", js: "secret_foundation_address", typ: u(undefined, "") },
        { json: "secret_foundation_tax", js: "secret_foundation_tax", typ: u(undefined, "") },
        { json: "withdraw_addr_enabled", js: "withdraw_addr_enabled", typ: true },
    ], false),
    "Inflation": o([
        { json: "enable_inflation", js: "enable_inflation", typ: true },
        { json: "exponential_calculation", js: "exponential_calculation", typ: r("ExponentialCalculation") },
        { json: "inflation_distribution", js: "inflation_distribution", typ: r("InflationDistribution") },
        { json: "mint_denom", js: "mint_denom", typ: "" },
    ], false),
    "ExponentialCalculation": o([
        { json: "a", js: "a", typ: "" },
        { json: "bonding_target", js: "bonding_target", typ: "" },
        { json: "c", js: "c", typ: "" },
        { json: "max_variance", js: "max_variance", typ: "" },
        { json: "r", js: "r", typ: "" },
    ], false),
    "InflationDistribution": o([
        { json: "community_pool", js: "community_pool", typ: "" },
        { json: "staking_rewards", js: "staking_rewards", typ: "" },
        { json: "usage_incentives", js: "usage_incentives", typ: "" },
    ], false),
    "Mint": o([
        { json: "blocks_per_year", js: "blocks_per_year", typ: u(undefined, "") },
        { json: "distribution_proportions", js: "distribution_proportions", typ: u(undefined, r("DistributionProportions")) },
        { json: "epoch_identifier", js: "epoch_identifier", typ: u(undefined, "") },
        { json: "genesis_epoch_provisions", js: "genesis_epoch_provisions", typ: u(undefined, "") },
        { json: "goal_bonded", js: "goal_bonded", typ: u(undefined, "") },
        { json: "inflation_max", js: "inflation_max", typ: u(undefined, "") },
        { json: "inflation_min", js: "inflation_min", typ: u(undefined, "") },
        { json: "inflation_rate", js: "inflation_rate", typ: u(undefined, "") },
        { json: "inflation_rate_change", js: "inflation_rate_change", typ: u(undefined, "") },
        { json: "mint_denom", js: "mint_denom", typ: "" },
        { json: "minting_rewards_distribution_start_epoch", js: "minting_rewards_distribution_start_epoch", typ: u(undefined, "") },
        { json: "reduction_factor", js: "reduction_factor", typ: u(undefined, "") },
        { json: "reduction_period_in_epochs", js: "reduction_period_in_epochs", typ: u(undefined, "") },
        { json: "weighted_developer_rewards_receivers", js: "weighted_developer_rewards_receivers", typ: u(undefined, a(r("WeightedDeveloperRewardsReceiver"))) },
    ], false),
    "DistributionProportions": o([
        { json: "community_pool", js: "community_pool", typ: "" },
        { json: "developer_rewards", js: "developer_rewards", typ: "" },
        { json: "pool_incentives", js: "pool_incentives", typ: "" },
        { json: "staking", js: "staking", typ: "" },
    ], false),
    "WeightedDeveloperRewardsReceiver": o([
        { json: "address", js: "address", typ: "" },
        { json: "weight", js: "weight", typ: "" },
    ], false),
    "Slashing": o([
        { json: "downtime_jail_duration", js: "downtime_jail_duration", typ: "" },
        { json: "min_signed_per_window", js: "min_signed_per_window", typ: "" },
        { json: "signed_blocks_window", js: "signed_blocks_window", typ: "" },
        { json: "slash_fraction_double_sign", js: "slash_fraction_double_sign", typ: "" },
        { json: "slash_fraction_downtime", js: "slash_fraction_downtime", typ: "" },
    ], false),
    "Staking": o([
        { json: "bond_denom", js: "bond_denom", typ: "" },
        { json: "historical_entries", js: "historical_entries", typ: 0 },
        { json: "max_entries", js: "max_entries", typ: 0 },
        { json: "max_validators", js: "max_validators", typ: 0 },
        { json: "min_commission_rate", js: "min_commission_rate", typ: u(undefined, "") },
        { json: "unbonding_time", js: "unbonding_time", typ: "" },
    ], false),
    "ChainPrices": o([
        { json: "coingecko", js: "coingecko", typ: m(r("Coingecko")) },
    ], false),
    "Services": o([
        { json: "staking_rewards", js: "staking_rewards", typ: u(undefined, r("StakingRewards")) },
    ], false),
    "StakingRewards": o([
        { json: "name", js: "name", typ: "" },
        { json: "slug", js: "slug", typ: "" },
        { json: "symbol", js: "symbol", typ: "" },
    ], false),
    "Repository": o([
        { json: "branch", js: "branch", typ: "" },
        { json: "commit", js: "commit", typ: "" },
        { json: "timestamp", js: "timestamp", typ: 0 },
        { json: "url", js: "url", typ: "" },
    ], false),
    "NetworkType": [
        "mainnet",
    ],
    "Status": [
        "killed",
        "live",
    ],
};
