export interface DirectoryChainValidators {
  name: string;
  validators: Validator[];
}

export interface Validator {
  active: boolean;
  address: string;
  commission: Commission;
  consensus_pubkey: ConsensusPubkey;
  delegations: Delegations;
  delegator_shares: string;
  description: Description;
  hex_address: string;
  identity?: string;
  image?: string;
  jailed: boolean;
  keybase_image?: string;
  min_self_delegation: string;
  mintscan_image?: string;
  missed_blocks: number;
  missed_blocks_periods: MissedBlocksPeriod[];
  moniker: string;
  name?: string;
  operator_address: string;
  path?: string;
  public_nodes?: PublicNodes;
  rank: number;
  restake?: Restake;
  services?: Services;
  signing_info?: SigningInfo;
  slashes?: Slash[] | null;
  status: Status;
  tokens: string;
  unbonding_height: string;
  unbonding_time: Date;
  uptime: number;
  uptime_periods: UptimePeriod[];
}

export interface Commission {
  commission_rates: CommissionRates;
  rate: number;
  update_time: Date;
}

export interface CommissionRates {
  max_change_rate: string;
  max_rate: string;
  rate: string;
}

export interface ConsensusPubkey {
  "@type": Type;
  key: string;
}

export enum Type {
  CosmosCryptoEd25519PubKey = "/cosmos.crypto.ed25519.PubKey",
  CosmosCryptoSecp256K1PubKey = "/cosmos.crypto.secp256k1.PubKey",
}

export interface Delegations {
  total_count?: number;
  total_tokens?: string;
  total_tokens_display?: number;
  total_usd?: number;
}

export interface Description {
  details: string;
  identity: string;
  moniker: string;
  security_contact: string;
  website: string;
}

export interface MissedBlocksPeriod {
  blocks: number;
  missed: number;
}

export interface PublicNodes {
  "evm-http-jsonrpc"?: EvmHTTPJsonrpc[];
  grpc?: EvmHTTPJsonrpc[];
  "grpc-web"?: EvmHTTPJsonrpc[];
  rest?: EvmHTTPJsonrpc[];
  rpc?: EvmHTTPJsonrpc[];
}

export interface EvmHTTPJsonrpc {
  address: string;
  provider: string;
}

export interface Restake {
  address: string;
  minimum_reward: number;
  run_time: string[] | string;
}

export interface Services {
  staking_rewards: StakingRewards;
}

export interface StakingRewards {
  name: string;
  slug: string;
  verified: boolean;
}

export interface SigningInfo {
  address: string;
  index_offset: string;
  jailed_until: Date;
  missed_blocks_counter: string;
  start_height: string;
  tombstoned: boolean;
}

export interface Slash {
  fraction: string;
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
