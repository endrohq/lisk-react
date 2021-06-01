import { Block } from '@hallarhq/types';

export const createDefaultBlock = (): Block => {
  return {
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
};
