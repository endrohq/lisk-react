import { Block, LiskAccount } from "@lisk-react/types";

export const zeroHeightBlock: { accounts: LiskAccount[]; block: Block } = {
  accounts: [],
  block: {
    header: {
      id: "",
      height: 0,
      previousBlockID: "",
      reward: 0,
      generatorPublicKey: "",
      timestamp: +new Date(),
      signature: "",
      version: 0,
      transactionRoot: "",
      asset: undefined,
    },
    payload: [],
  },
};
