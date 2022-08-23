// To parse this data:
//
//   import { Convert, ChainValidators } from "./file";
//
//   const chainValidators = Convert.toChainValidators(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface ChainValidators {
    name:       string;
    validators: Validator[];
}

export interface Validator {
    active:                boolean;
    address:               string;
    commission:            Commission;
    consensus_pubkey:      ConsensusPubkey;
    delegations:           Delegations;
    delegator_shares:      string;
    description:           Description;
    hex_address:           string;
    identity?:             string;
    image?:                string;
    jailed:                boolean;
    keybase_image?:        string;
    min_self_delegation:   string;
    mintscan_image?:       string;
    missed_blocks:         number;
    missed_blocks_periods: MissedBlocksPeriod[];
    moniker:               string;
    name?:                 string;
    operator_address:      string;
    path?:                 string;
    public_nodes?:         PublicNodes;
    rank:                  number;
    restake?:              Restake;
    services?:             Services;
    signing_info?:         SigningInfo;
    slashes?:              Slash[] | null;
    status:                Status;
    tokens:                string;
    unbonding_height:      string;
    unbonding_time:        Date;
    uptime:                number;
    uptime_periods:        UptimePeriod[];
}

export interface Commission {
    commission_rates: CommissionRates;
    rate:             number;
    update_time:      Date;
}

export interface CommissionRates {
    max_change_rate: string;
    max_rate:        string;
    rate:            string;
}

export interface ConsensusPubkey {
    "@type": Type;
    key:     string;
}

export enum Type {
    CosmosCryptoEd25519PubKey = "/cosmos.crypto.ed25519.PubKey",
    CosmosCryptoSecp256K1PubKey = "/cosmos.crypto.secp256k1.PubKey",
}

export interface Delegations {
    total_count?:          number;
    total_tokens?:         string;
    total_tokens_display?: number;
    total_usd?:            number;
}

export interface Description {
    details:          string;
    identity:         string;
    moniker:          string;
    security_contact: string;
    website:          string;
}

export interface MissedBlocksPeriod {
    blocks: number;
    missed: number;
}

export interface PublicNodes {
    "evm-http-jsonrpc"?: EvmHTTPJsonrpc[];
    grpc?:               EvmHTTPJsonrpc[];
    "grpc-web"?:         EvmHTTPJsonrpc[];
    rest?:               EvmHTTPJsonrpc[];
    rpc?:                EvmHTTPJsonrpc[];
}

export interface EvmHTTPJsonrpc {
    address:  string;
    provider: string;
}

export interface Restake {
    address:        string;
    minimum_reward: number;
    run_time:       string[] | string;
}

export interface Services {
    staking_rewards: StakingRewards;
}

export interface StakingRewards {
    name:     string;
    slug:     string;
    verified: boolean;
}

export interface SigningInfo {
    address:               string;
    index_offset:          string;
    jailed_until:          Date;
    missed_blocks_counter: string;
    start_height:          string;
    tombstoned:            boolean;
}

export interface Slash {
    fraction:         string;
    validator_period: string;
}

export enum Status {
    BondStatusBonded = "BOND_STATUS_BONDED",
    BondStatusUnbonded = "BOND_STATUS_UNBONDED",
    BondStatusUnbonding = "BOND_STATUS_UNBONDING",
}

export interface UptimePeriod {
    blocks: number;
    uptime: number;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toChainValidators(json: string): ChainValidators {
        return cast(JSON.parse(json), r("ChainValidators"));
    }

    public static chainValidatorsToJson(value: ChainValidators): string {
        return JSON.stringify(uncast(value, r("ChainValidators")), null, 2);
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
    "ChainValidators": o([
        { json: "name", js: "name", typ: "" },
        { json: "validators", js: "validators", typ: a(r("Validator")) },
    ], false),
    "Validator": o([
        { json: "active", js: "active", typ: true },
        { json: "address", js: "address", typ: "" },
        { json: "commission", js: "commission", typ: r("Commission") },
        { json: "consensus_pubkey", js: "consensus_pubkey", typ: r("ConsensusPubkey") },
        { json: "delegations", js: "delegations", typ: r("Delegations") },
        { json: "delegator_shares", js: "delegator_shares", typ: "" },
        { json: "description", js: "description", typ: r("Description") },
        { json: "hex_address", js: "hex_address", typ: "" },
        { json: "identity", js: "identity", typ: u(undefined, "") },
        { json: "image", js: "image", typ: u(undefined, "") },
        { json: "jailed", js: "jailed", typ: true },
        { json: "keybase_image", js: "keybase_image", typ: u(undefined, "") },
        { json: "min_self_delegation", js: "min_self_delegation", typ: "" },
        { json: "mintscan_image", js: "mintscan_image", typ: u(undefined, "") },
        { json: "missed_blocks", js: "missed_blocks", typ: 0 },
        { json: "missed_blocks_periods", js: "missed_blocks_periods", typ: a(r("MissedBlocksPeriod")) },
        { json: "moniker", js: "moniker", typ: "" },
        { json: "name", js: "name", typ: u(undefined, "") },
        { json: "operator_address", js: "operator_address", typ: "" },
        { json: "path", js: "path", typ: u(undefined, "") },
        { json: "public_nodes", js: "public_nodes", typ: u(undefined, r("PublicNodes")) },
        { json: "rank", js: "rank", typ: 0 },
        { json: "restake", js: "restake", typ: u(undefined, r("Restake")) },
        { json: "services", js: "services", typ: u(undefined, r("Services")) },
        { json: "signing_info", js: "signing_info", typ: u(undefined, r("SigningInfo")) },
        { json: "slashes", js: "slashes", typ: u(undefined, u(a(r("Slash")), null)) },
        { json: "status", js: "status", typ: r("Status") },
        { json: "tokens", js: "tokens", typ: "" },
        { json: "unbonding_height", js: "unbonding_height", typ: "" },
        { json: "unbonding_time", js: "unbonding_time", typ: Date },
        { json: "uptime", js: "uptime", typ: 3.14 },
        { json: "uptime_periods", js: "uptime_periods", typ: a(r("UptimePeriod")) },
    ], false),
    "Commission": o([
        { json: "commission_rates", js: "commission_rates", typ: r("CommissionRates") },
        { json: "rate", js: "rate", typ: 3.14 },
        { json: "update_time", js: "update_time", typ: Date },
    ], false),
    "CommissionRates": o([
        { json: "max_change_rate", js: "max_change_rate", typ: "" },
        { json: "max_rate", js: "max_rate", typ: "" },
        { json: "rate", js: "rate", typ: "" },
    ], false),
    "ConsensusPubkey": o([
        { json: "@type", js: "@type", typ: r("Type") },
        { json: "key", js: "key", typ: "" },
    ], false),
    "Delegations": o([
        { json: "total_count", js: "total_count", typ: u(undefined, 0) },
        { json: "total_tokens", js: "total_tokens", typ: u(undefined, "") },
        { json: "total_tokens_display", js: "total_tokens_display", typ: u(undefined, 3.14) },
        { json: "total_usd", js: "total_usd", typ: u(undefined, 3.14) },
    ], false),
    "Description": o([
        { json: "details", js: "details", typ: "" },
        { json: "identity", js: "identity", typ: "" },
        { json: "moniker", js: "moniker", typ: "" },
        { json: "security_contact", js: "security_contact", typ: "" },
        { json: "website", js: "website", typ: "" },
    ], false),
    "MissedBlocksPeriod": o([
        { json: "blocks", js: "blocks", typ: 0 },
        { json: "missed", js: "missed", typ: 0 },
    ], false),
    "PublicNodes": o([
        { json: "evm-http-jsonrpc", js: "evm-http-jsonrpc", typ: u(undefined, a(r("EvmHTTPJsonrpc"))) },
        { json: "grpc", js: "grpc", typ: u(undefined, a(r("EvmHTTPJsonrpc"))) },
        { json: "grpc-web", js: "grpc-web", typ: u(undefined, a(r("EvmHTTPJsonrpc"))) },
        { json: "rest", js: "rest", typ: u(undefined, a(r("EvmHTTPJsonrpc"))) },
        { json: "rpc", js: "rpc", typ: u(undefined, a(r("EvmHTTPJsonrpc"))) },
    ], false),
    "EvmHTTPJsonrpc": o([
        { json: "address", js: "address", typ: "" },
        { json: "provider", js: "provider", typ: "" },
    ], false),
    "Restake": o([
        { json: "address", js: "address", typ: "" },
        { json: "minimum_reward", js: "minimum_reward", typ: 0 },
        { json: "run_time", js: "run_time", typ: u(a(""), "") },
    ], false),
    "Services": o([
        { json: "staking_rewards", js: "staking_rewards", typ: r("StakingRewards") },
    ], false),
    "StakingRewards": o([
        { json: "name", js: "name", typ: "" },
        { json: "slug", js: "slug", typ: "" },
        { json: "verified", js: "verified", typ: true },
    ], false),
    "SigningInfo": o([
        { json: "address", js: "address", typ: "" },
        { json: "index_offset", js: "index_offset", typ: "" },
        { json: "jailed_until", js: "jailed_until", typ: Date },
        { json: "missed_blocks_counter", js: "missed_blocks_counter", typ: "" },
        { json: "start_height", js: "start_height", typ: "" },
        { json: "tombstoned", js: "tombstoned", typ: true },
    ], false),
    "Slash": o([
        { json: "fraction", js: "fraction", typ: "" },
        { json: "validator_period", js: "validator_period", typ: "" },
    ], false),
    "UptimePeriod": o([
        { json: "blocks", js: "blocks", typ: 0 },
        { json: "uptime", js: "uptime", typ: 3.14 },
    ], false),
    "Type": [
        "/cosmos.crypto.ed25519.PubKey",
        "/cosmos.crypto.secp256k1.PubKey",
    ],
    "Status": [
        "BOND_STATUS_BONDED",
        "BOND_STATUS_UNBONDED",
        "BOND_STATUS_UNBONDING",
    ],
};
