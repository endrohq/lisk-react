/**
 * A custom useEffect hook that enables you to interact with a blockchain built with the Lisk SDK
 * @param {Function} effect
 * @param {Array<any>} dependencies
 */
import React, { FC, useContext, useMemo, useEffect, useState } from "react";
import { Block, LiskAccount, NetworkEndpoint } from "@lisk-react/types";
import { zeroHeightBlock, normalize } from "@lisk-react/core";
import { useClient, LiskClientProvider } from "@lisk-react/use-client";
import { NewBlock } from "./types";

export interface LiskBlockContextStateProps {
  block: Block;
  accounts: LiskAccount[];
}

export const LiskBlockContext = React.createContext<LiskBlockContextStateProps>(
  {} as LiskBlockContextStateProps
);

export const useBlock = () => useContext(LiskBlockContext);

interface Props {}

export const LiskBlockWhiteLabelProvider: FC<Props> = ({ children }) => {
  const { client } = useClient();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [subscribed, setSubscribed] = useState<boolean>(false);
  const [block, setBlock] = useState<NewBlock>(zeroHeightBlock);

  useEffect(() => {
    async function fetchOnClientInit() {
      if (client && !subscribed) {
        await fetchLatestBlock();
        client.subscribe("app:block:new", persistNewBlock);
        setSubscribed(true);
      }
    }
    fetchOnClientInit();
  }, [client]);

  async function fetchLatestBlock() {
    try {
      if (!client) return;
      const block = (await client?.invoke("app:getLastBlock")) as string;
      if (!block) return;
      // Decode block
      const decodedBlock = client.block.decode(block);
      const convertedBlock = normalize(decodedBlock) as Block;
      setIsConnected(true);
      setBlock({ block: convertedBlock, accounts: [] });
    } catch (error) {}
  }

  function persistNewBlock({ block, accounts }: any) {
    if (!client) return;

    if (!isConnected) {
      setIsConnected(true);
    }
    // Decode block
    const decodedBlock = client.block.decode(block);
    const convertedBlock = normalize(decodedBlock) as Block;

    // Decode related accounts
    const convertedAccounts = accounts?.map((item) => {
      const decodedAccount = client.account.decode(item);
      return normalize(decodedAccount);
    });
    setBlock({ block: convertedBlock, accounts: convertedAccounts });
  }

  const value = useMemo(
    () => ({
      block: block.block,
      accounts: block.accounts,
    }),
    [block, isConnected]
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
