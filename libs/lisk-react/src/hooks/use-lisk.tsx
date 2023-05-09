import { LiskBlockWhiteLabelProvider, useBlock } from 'hooks/use-block';
import { LiskClientProvider, useClient } from 'hooks/use-client';
import { LiskWalletWhiteLabelProvider, useWallet } from 'hooks/use-wallet';
import React, { FC } from 'react';
import { NetworkEndpoint } from 'typings';

interface Props {
  endpoint?: NetworkEndpoint;
}

export { useWallet, useClient, useBlock };

export const LiskProvider: FC<Props> = ({ endpoint, children }) => (
  <LiskClientProvider endpoint={endpoint}>
    <LiskBlockWhiteLabelProvider>
      <LiskWalletWhiteLabelProvider>{children}</LiskWalletWhiteLabelProvider>
    </LiskBlockWhiteLabelProvider>
  </LiskClientProvider>
);
