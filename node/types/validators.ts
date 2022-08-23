// To parse this data:
//
//   import { Convert, DirectoryValidators } from "./file";
//
//   const directoryValidators = Convert.toDirectoryValidators(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface DirectoryValidators {
    repository: Repository;
    validators: Validator[];
}

export interface Repository {
    branch:    string;
    commit:    string;
    timestamp: number;
    url:       string;
}

export interface Validator {
    chains:      Chain[];
    identity:    string;
    name:        string;
    path:        string;
    profile:     Profile;
    services?:   Service[];
    total_usd:   number;
    total_users: number;
}

export interface Chain {
    active?:                boolean;
    address:                string;
    commission?:            Commission;
    delegations?:           Delegations;
    description?:           ChainDescription;
    identity?:              string;
    image?:                 string;
    jailed?:                boolean;
    missed_blocks_periods?: MissedBlocksPeriod[];
    moniker?:               string;
    name:                   string;
    rank?:                  number;
    restake?:               Restake;
    slashes?:               Slash[] | null;
    status?:                Status;
}

export interface Commission {
    rate: number;
}

export interface Delegations {
    total_count?:          number;
    total_tokens?:         string;
    total_tokens_display?: number;
    total_usd?:            number;
}

export interface ChainDescription {
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

export interface Restake {
    address:        string;
    minimum_reward: number;
    run_time:       string[] | string;
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

export interface Profile {
    $schema?:     Schema;
    apps?:        string[];
    contacts?:    Contacts;
    description?: ProfileDescription;
    identity:     string;
    name:         string;
    twitter?:     string;
    website?:     string;
}

export enum Schema {
    ProfileSchemaJSON = "../profile.schema.json",
}

export interface Contacts {
    discord:   string;
    email:     string;
    others:    Others;
    telegram:  string;
    telephone: string;
    twitter:   string;
}

export interface Others {
    emergency: string;
}

export interface ProfileDescription {
    overview:  string;
    security?: string;
    team:      string;
}

export interface Service {
    description: string;
    image?:      string;
    title:       string;
    url:         string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toDirectoryValidators(json: string): DirectoryValidators {
        return cast(JSON.parse(json), r("DirectoryValidators"));
    }

    public static directoryValidatorsToJson(value: DirectoryValidators): string {
        return JSON.stringify(uncast(value, r("DirectoryValidators")), null, 2);
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
    "DirectoryValidators": o([
        { json: "repository", js: "repository", typ: r("Repository") },
        { json: "validators", js: "validators", typ: a(r("Validator")) },
    ], false),
    "Repository": o([
        { json: "branch", js: "branch", typ: "" },
        { json: "commit", js: "commit", typ: "" },
        { json: "timestamp", js: "timestamp", typ: 0 },
        { json: "url", js: "url", typ: "" },
    ], false),
    "Validator": o([
        { json: "chains", js: "chains", typ: a(r("Chain")) },
        { json: "identity", js: "identity", typ: "" },
        { json: "name", js: "name", typ: "" },
        { json: "path", js: "path", typ: "" },
        { json: "profile", js: "profile", typ: r("Profile") },
        { json: "services", js: "services", typ: u(undefined, a(r("Service"))) },
        { json: "total_usd", js: "total_usd", typ: 3.14 },
        { json: "total_users", js: "total_users", typ: 0 },
    ], false),
    "Chain": o([
        { json: "active", js: "active", typ: u(undefined, true) },
        { json: "address", js: "address", typ: "" },
        { json: "commission", js: "commission", typ: u(undefined, r("Commission")) },
        { json: "delegations", js: "delegations", typ: u(undefined, r("Delegations")) },
        { json: "description", js: "description", typ: u(undefined, r("ChainDescription")) },
        { json: "identity", js: "identity", typ: u(undefined, "") },
        { json: "image", js: "image", typ: u(undefined, "") },
        { json: "jailed", js: "jailed", typ: u(undefined, true) },
        { json: "missed_blocks_periods", js: "missed_blocks_periods", typ: u(undefined, a(r("MissedBlocksPeriod"))) },
        { json: "moniker", js: "moniker", typ: u(undefined, "") },
        { json: "name", js: "name", typ: "" },
        { json: "rank", js: "rank", typ: u(undefined, 0) },
        { json: "restake", js: "restake", typ: u(undefined, r("Restake")) },
        { json: "slashes", js: "slashes", typ: u(undefined, u(a(r("Slash")), null)) },
        { json: "status", js: "status", typ: u(undefined, r("Status")) },
    ], false),
    "Commission": o([
        { json: "rate", js: "rate", typ: 3.14 },
    ], false),
    "Delegations": o([
        { json: "total_count", js: "total_count", typ: u(undefined, 0) },
        { json: "total_tokens", js: "total_tokens", typ: u(undefined, "") },
        { json: "total_tokens_display", js: "total_tokens_display", typ: u(undefined, 3.14) },
        { json: "total_usd", js: "total_usd", typ: u(undefined, 3.14) },
    ], false),
    "ChainDescription": o([
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
    "Restake": o([
        { json: "address", js: "address", typ: "" },
        { json: "minimum_reward", js: "minimum_reward", typ: 0 },
        { json: "run_time", js: "run_time", typ: u(a(""), "") },
    ], false),
    "Slash": o([
        { json: "fraction", js: "fraction", typ: "" },
        { json: "validator_period", js: "validator_period", typ: "" },
    ], false),
    "Profile": o([
        { json: "$schema", js: "$schema", typ: u(undefined, r("Schema")) },
        { json: "apps", js: "apps", typ: u(undefined, a("")) },
        { json: "contacts", js: "contacts", typ: u(undefined, r("Contacts")) },
        { json: "description", js: "description", typ: u(undefined, r("ProfileDescription")) },
        { json: "identity", js: "identity", typ: "" },
        { json: "name", js: "name", typ: "" },
        { json: "twitter", js: "twitter", typ: u(undefined, "") },
        { json: "website", js: "website", typ: u(undefined, "") },
    ], false),
    "Contacts": o([
        { json: "discord", js: "discord", typ: "" },
        { json: "email", js: "email", typ: "" },
        { json: "others", js: "others", typ: r("Others") },
        { json: "telegram", js: "telegram", typ: "" },
        { json: "telephone", js: "telephone", typ: "" },
        { json: "twitter", js: "twitter", typ: "" },
    ], false),
    "Others": o([
        { json: "emergency", js: "emergency", typ: "" },
    ], false),
    "ProfileDescription": o([
        { json: "overview", js: "overview", typ: "" },
        { json: "security", js: "security", typ: u(undefined, "") },
        { json: "team", js: "team", typ: "" },
    ], false),
    "Service": o([
        { json: "description", js: "description", typ: "" },
        { json: "image", js: "image", typ: u(undefined, "") },
        { json: "title", js: "title", typ: "" },
        { json: "url", js: "url", typ: "" },
    ], false),
    "Status": [
        "BOND_STATUS_BONDED",
        "BOND_STATUS_UNBONDED",
        "BOND_STATUS_UNBONDING",
    ],
    "Schema": [
        "../profile.schema.json",
    ],
};
