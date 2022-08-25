export interface DirectoryStatus {
  chains: Chain[];
}

export interface Chain {
  available: boolean;
  height: number | null;
  name: string;
  rest: REST;
  rpc: RPC;
}

export interface REST {
  available: boolean;
  best: RESTBest[];
  height: number | null;
}

export interface RESTBest {
  address: string;
  provider?: string;
}

export interface RPC {
  available: boolean;
  best: RPCBest[];
  height: number | null;
}

export interface RPCBest {
  address: string;
  archive?: boolean;
  provider?: string;
}
