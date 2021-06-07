export interface NetworkEndpoint {
  wsUrl: string;
  nodeUrl: string;
}

export interface LiskNetwork {
  isConnected: boolean;
  endpoint?: NetworkEndpoint;
}

export interface Wallet {
  account?: LiskAccount;
  isAuthenticated: boolean;
  loading: boolean;
  generate(): LiskAccount;
  logout(): void;
  setAccount(account: LiskAccount): void;
  authenticate(passphrase: string): void;
}

export type LiskAccount = {
  address: string;
  passphrase?: string;
  dpos?: DPoS;
  keys: AccountKeys;
  token?: Token;
  sequence?: Sequence;
};

export interface DPoS {
  delegate: Delegate;
  sentVotes: string[];
  unlocking: [];
}

export interface Delegate {
  username: string;
  pomHeights: number[];
  consecutiveMissedBlocks: number;
  lastForgedHeight: number;
  totalVotesReceived: string;
  isBanned: boolean;
}

export interface AccountKeys {
  numberOfSignatures?: number;
  mandatoryKeys?: number[];
  optionalKeys?: number[];
  publicKey: string;
  privateKey: string;
}

export interface Token {
  balance: string;
}

export interface Sequence {
  nonce: string;
}

type Meta = {
  count: number;
  limit: number;
  offset: number;
};

export type ApiResponseModel<T> = {
  meta: Meta;
  data: T;
};

export type Transaction<T> = {
  moduleID: number;
  assetID: number;
  nonce: number;
  fee: number;
  senderPublicKey: any;
  signatures: string[];
  asset: T;
};

export type BaseAsset = {};

export type Block = {
  header: BlockHeader;
  payload: Transaction<BaseAsset>[];
};

export type BlockHeader = {
  id: string;
  height: number;
  version: number;
  timestamp: number;
  previousBlockID: any;
  transactionRoot: any;
  generatorPublicKey: any;
  reward: number;
  asset: any;
  signature: any;
};

export interface RegisterDelegate extends BaseAsset {
  username: string;
}

export interface DelegateVote extends BaseAsset {
  votes: Vote[];
}

export interface Vote extends BaseAsset {
  delegateAddress: any[];
  amount: number;
}

export interface UnlockToken extends BaseAsset {
  unlockObjects: UnlockObject[];
}

export interface UnlockObject extends BaseAsset {
  delegateAddress: any[];
  amount: number;
  unvoteHeight: number;
}

export interface RegisterMultiSignatureGroup extends BaseAsset {
  numberOfSignatures: number;
  mandatoryKeys: any[];
  optionalKeys: any[];
}

export interface ReportDelegateMisbehaviour extends BaseAsset {
  header1: BlockHeader;
  header2: BlockHeader;
}

export interface BaseModule {
  get(payload: Transaction<BaseAsset>);
}

export interface Transfer extends BaseAsset {
  amount: number;
  recipientAddress: number;
  data: string;
}

export class TokenModule implements BaseModule {
  get(payload: Transaction<BaseAsset>) {
    return payload as Transaction<Transfer>;
  }
}

export class KeysModule implements BaseModule {
  get(payload: Transaction<BaseAsset>) {
    return payload as Transaction<RegisterMultiSignatureGroup>;
  }
}

export class DposModule implements BaseModule {
  get(payload: Transaction<BaseAsset>) {
    if (payload.assetID === 0) {
      return payload as Transaction<RegisterDelegate>;
    } else if (payload.assetID === 1) {
      return payload as Transaction<DelegateVote>;
    } else if (payload.assetID === 2) {
      return payload as Transaction<UnlockToken>;
    } else if (payload.assetID === 3) {
      return payload as Transaction<ReportDelegateMisbehaviour>;
    }
    return payload as Transaction<BaseAsset>;
  }
}

export class ModuleDictionary {
  private _modules: Record<number, BaseModule> = {
    0: new TokenModule(),
    4: new KeysModule(),
    5: new DposModule(),
  };

  register(moduleID: number, module: BaseModule) {
    this._modules[moduleID] = module;
  }

  get(payload: Transaction<BaseAsset>) {
    return this._modules[payload.moduleID].get(payload);
  }
}
