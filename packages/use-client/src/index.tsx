/**
 * A custom useEffect hook that enables you to interact with a blockchain built with the Lisk SDK
 * @param {Function} effect
 * @param {Array<any>} dependencies
 */
import React, { FC, useContext, useMemo, useEffect, useState } from "react";
import { APIClient } from "@liskhq/lisk-api-client/dist-node/api_client";
import {
  Block,
  LiskNetwork,
  NetworkEndpoint,
  LiskAccount,
} from "@lisk-react/types";
import {
  useClient,
  zeroHeightBlock,
  normalize,
  ConvertedBlock,
} from "@lisk-react/core";

export interface LiskClientContextStateProps {
  network: LiskNetwork;
  block: Block;
  accounts: LiskAccount[];
  client?: APIClient;
}

export const LiskClientContext =
  React.createContext<LiskClientContextStateProps>(
    {} as LiskClientContextStateProps
  );

export const useLiskClient = () => useContext(LiskClientContext);

interface Props {
  endpoint?: NetworkEndpoint;
}

export const LiskClientProvider: FC<Props> = ({ children, endpoint }) => {
  const [networkEndpoint, setNetworkEndpoint] = useState<NetworkEndpoint>();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [subscribed, setSubscribed] = useState<boolean>(false);
  const [block, setBlock] =
    useState<{ block: Block; accounts: LiskAccount[] }>(zeroHeightBlock);
  const { client } = useClient({ endpoint: networkEndpoint });

  const blockConverter = useMemo(() => {
    return new ConvertedBlock();
  }, []);

  useEffect(() => {
    if (client && !subscribed) {
      client.subscribe("app:network:ready", () => setIsConnected(true));
      client.subscribe("app:shutdown", () => setIsConnected(false));

      client.subscribe("app:block:new", ({ block, accounts }: any) => {
        // Decode block
        const decodedBlock = client.block.decode(block);
        const convertedBlock = blockConverter.process(decodedBlock);

        // Decode related accounts
        const convertedAccounts = accounts?.map((item) => {
          const decodedAccount = client.account.decode(item);
          return normalize(decodedAccount);
        });
        setBlock({ block: convertedBlock, accounts: convertedAccounts });
      });
      setSubscribed(true);
    }
  }, [client]);

  useEffect(() => {
    if (endpoint?.wsUrl) setNetworkEndpoint(endpoint);
  }, [endpoint]);

  const value = useMemo(
    () => ({
      block: block.block,
      accounts: block.accounts,
      network: {
        isConnected,
        endpoint,
      },
      client,
      setEndpoint: (endpoint: NetworkEndpoint) => setNetworkEndpoint(endpoint),
    }),
    [block, isConnected]
  );

  return (
    <LiskClientContext.Provider value={value}>
      {children}
    </LiskClientContext.Provider>
  );
};
