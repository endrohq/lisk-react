/**
 * A custom useEffect hook that enables you to interact with a blockchain built with the Lisk SDK
 * @param {Function} effect
 * @param {Array<any>} dependencies
 */

import { zeroHeightBlock } from 'factory/block.factory';
import { LiskClientProvider, useClient } from 'hooks/use-client';
import React, { FC, useContext, useMemo, useEffect, useState } from 'react';

import { Block, LiskAccount, NetworkEndpoint, NewBlock } from 'typings';
import { EVENT_CHAIN_BLOCK_NEW } from 'typings/events';
import { normalize } from 'utils/object.utils';

export interface LiskBlockContextStateProps {
  block: Block;
  accounts: LiskAccount[];
}

export const LiskBlockContext = React.createContext<LiskBlockContextStateProps>(
  {} as LiskBlockContextStateProps,
);

export const useBlock = () => useContext(LiskBlockContext);

export const LiskBlockWhiteLabelProvider: FC = ({ children }) => {
  const {
    client,
    network: { isConnected },
  } = useClient();
  const [subscribed, setSubscribed] = useState<boolean>(false);
  const [block, setBlock] = useState<NewBlock>(zeroHeightBlock);

  useEffect(() => {
    async function fetchOnClientInit() {
      if (!isConnected) {
        setSubscribed(false);
      } else if (client && !subscribed) {
        await fetchLatestBlock();
        client.subscribe(EVENT_CHAIN_BLOCK_NEW, persistNewBlock);
        setSubscribed(true);
      }
    }
    fetchOnClientInit();
  }, [isConnected, client]);

  async function fetchLatestBlock() {
    try {
      if (!client) return;
      const block = (await client?.invoke('app:getLastBlock')) as string;
      if (!block) return;
      // Decode block
      const decodedBlock = client.block.decode(Buffer.from(block, 'hex'));
      const convertedBlock = normalize(decodedBlock);
      // @ts-ignore
      setBlock({ block: convertedBlock, accounts: [] });
    } catch (error) {
      console.log('WOWWO');
    }
  }

  function persistNewBlock({ block, accounts }: any) {
    if (!client) return;
    // Decode block
    const decodedBlock = client.block.decode(Buffer.from(block, 'hex'));
    const convertedBlock = normalize(decodedBlock) as Block;

    // Decode related accounts
    const convertedAccounts = accounts?.map(item => {
      const decodedAccount = client.account.decode(Buffer.from(item, 'hex'));
      return normalize(decodedAccount);
    });
    setBlock({ block: convertedBlock, accounts: convertedAccounts });
  }

  const value = useMemo(
    () => ({
      block: block.block,
      accounts: block.accounts,
    }),
    [block],
  );

  return (
    <LiskBlockContext.Provider value={value}>
      {children}
    </LiskBlockContext.Provider>
  );
};

export const LiskBlockProvider: React.FC<{ endpoint?: NetworkEndpoint }> = ({
  endpoint,
  children,
}) => {
  return (
    <LiskClientProvider endpoint={endpoint}>
      <LiskBlockWhiteLabelProvider>{children}</LiskBlockWhiteLabelProvider>
    </LiskClientProvider>
  );
};
