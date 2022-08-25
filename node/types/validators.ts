export interface DirectoryValidators {
  repository: Repository;
  validators: Validator[];
}

export interface Repository {
  branch: string;
  commit: string;
  timestamp: number;
  url: string;
}

export interface Validator {
  chains: Chain[];
  identity: string;
  name: string;
  path: string;
  profile: Profile;
  services?: Service[] | ServicesClass;
  total_usd: number;
  total_users: number;
}

export interface Chain {
  active?: boolean;
  address: string;
  commission?: Commission;
  delegations?: Delegations;
  description?: ChainDescription;
  identity?: string;
  image?: string;
  jailed?: boolean;
  missed_blocks_periods?: MissedBlocksPeriod[];
  moniker?: string;
  name: string;
  rank?: number;
  restake?: Restake;
  slashes?: Slash[] | null;
  status?: Status;
}

export interface Commission {
  rate: number;
}

export interface Delegations {
  total_count?: number;
  total_tokens?: string;
  total_tokens_display?: number;
  total_usd?: number;
}

export interface ChainDescription {
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

export interface Restake {
  address: string;
  minimum_reward: number;
  run_time: string[] | string;
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

export interface Profile {
  apps?: string[];
  contacts?: Contacts;
  description?: ProfileDescription;
  identity: string;
  name: string;
  twitter?: string;
  website?: string;
}

export interface Contacts {
  discord?: string;
  email: string;
  others?: Others;
  telegram: string;
  telephone?: string;
  twitter: string;
}

export interface Others {
  emergency: string;
}

export interface ProfileDescription {
  overview: string;
  security?: string;
  team: string;
}

export interface Service {
  description?: string;
  image?: string;
  title: string;
  url: string;
}

export interface ServicesClass {
  name: string;
  services: Service[];
}
