export interface DirectoryChains {
  chains: Chain[];
  repository: Repository;
}

export interface Chain {
  assets?: Asset[];
  best_apis: BestApis;
  chain_id: string;
  chain_name: string;
  coingecko_id?: string;
  decimals?: number;
  denom?: string;
  display?: string;
  explorers?: Explorer[];
  height: number | null;
  image?: string;
  name: string;
  network_type: NetworkType;
  params?: Params;
  path: string;
  pretty_name: string;
  prices?: ChainPrices;
  services?: Services;
  status: Status;
  symbol?: string;
}

export interface Asset {
  base: Base;
  coingecko_id?: string;
  decimals: number;
  denom: string;
  denom_units: Base[];
  description?: string;
  display?: Base;
  image?: string;
  logo_URIs?: LogoURIs;
  name: string;
  prices?: AssetPrices;
  symbol: string;
}

export interface Base {
  aliases?: string[];
  denom: string;
  exponent: number;
}

export interface LogoURIs {
  jpeg?: string;
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
  rpc: RPC[];
}

export interface REST {
  address: string;
  provider?: string;
}

export interface RPC {
  address: string;
  archive?: boolean;
  provider?: string;
}

export interface Explorer {
  account_page?: string;
  kind?: string;
  name?: string;
  tx_page?: string;
  url: string;
}

export enum NetworkType {
  Mainnet = "mainnet",
  Testnet = "testnet",
}

export interface Params {
  actual_block_time: number;
  actual_blocks_per_year: number;
  annual_provision?: string;
  authz: boolean;
  base_inflation?: number;
  block_time?: number;
  blocks_per_year?: number;
  bonded_ratio?: number | null;
  bonded_tokens?: string;
  calculated_apr?: number | null;
  community_tax?: number;
  distribution?: Distribution;
  epoch_duration?: number;
  estimated_apr?: number | null;
  inflation?: Inflation;
  max_validators?: number;
  mint?: Mint;
  minting_epoch_provision?: number;
  slashing?: Slashing;
  staking?: Staking;
  total_supply?: string;
  unbonding_time?: number;
  year_minting_provision?: number;
}

export interface Distribution {
  base_proposer_reward: string;
  bonus_proposer_reward: string;
  community_tax: string;
  liquidity_provider_reward?: string;
  secret_foundation_address?: string;
  secret_foundation_tax?: string;
  withdraw_addr_enabled: boolean;
}

export interface Inflation {
  enable_inflation: boolean;
  exponential_calculation: ExponentialCalculation;
  inflation_distribution: InflationDistribution;
  mint_denom: string;
}

export interface ExponentialCalculation {
  a: string;
  bonding_target: string;
  c: string;
  max_variance: string;
  r: string;
}

export interface InflationDistribution {
  community_pool: string;
  staking_rewards: string;
  usage_incentives: string;
}

export interface Mint {
  blocks_per_year?: string;
  distribution_proportions?: DistributionProportions;
  epoch_identifier?: string;
  genesis_epoch_provisions?: string;
  goal_bonded?: string;
  inflation_max?: string;
  inflation_min?: string;
  inflation_rate?: string;
  inflation_rate_change?: string;
  mint_denom: string;
  minting_rewards_distribution_start_epoch?: string;
  reduction_factor?: string;
  reduction_period_in_epochs?: string;
  weighted_developer_rewards_receivers?: WeightedDeveloperRewardsReceiver[];
}

export interface DistributionProportions {
  community_pool: string;
  developer_rewards: string;
  pool_incentives: string;
  staking: string;
}

export interface WeightedDeveloperRewardsReceiver {
  address: string;
  weight: string;
}

export interface Slashing {
  downtime_jail_duration: string;
  min_signed_per_window: string;
  signed_blocks_window: string;
  slash_fraction_double_sign: string;
  slash_fraction_downtime: string;
}

export interface Staking {
  bond_denom: string;
  historical_entries: number;
  max_entries: number;
  max_validators: number;
  min_commission_rate?: string;
  unbonding_time: string;
}

export interface ChainPrices {
  coingecko: Record<string, Coingecko>;
}

export interface Services {
  staking_rewards?: StakingRewards;
}

export interface StakingRewards {
  name: string;
  slug: string;
  symbol: string;
}

export enum Status {
  Killed = "killed",
  Live = "live",
}

export interface Repository {
  branch: string;
  commit: string;
  timestamp: number;
  url: string;
}
