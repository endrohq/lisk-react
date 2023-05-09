import BigNumber from 'bignumber.js';

export const fromRawLsk = (value: number) =>
  new BigNumber(value || 0).dividedBy(new BigNumber(10).pow(8)).toFixed();
