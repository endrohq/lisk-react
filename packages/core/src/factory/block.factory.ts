import { Block } from '@lisk-react/types';

export const zeroHeightBlock: Block = {
  header: {
    id: '',
    height: 0,
    previousBlockID: '',
    reward: 0,
    generatorPublicKey: '',
    timestamp: +new Date(),
    signature: '',
    version: 0,
    transactionRoot: '',
    asset: undefined
  },
  payload: []
};
