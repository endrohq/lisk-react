import React, { FC, useState, useEffect } from "react";
import { APIClient } from "@liskhq/lisk-api-client/dist-node/api_client";
import { NetworkEndpoint, Block, LiskNetwork, Wallet } from "@lisk-react/types";
import { setupWsClient, useNetwork, useWallet } from "@lisk-react/core";
import { LiskAccount } from "@lisk-react/types";

export interface LiskContextStateProps {
  client?: APIClient;
  network: LiskNetwork;
  block: Block;
  accounts: LiskAccount[];
  wallet: Wallet;
  setEndpoint(endpoint?: NetworkEndpoint): void;
}

export const LiskContext = React.createContext<LiskContextStateProps>(
  {} as LiskContextStateProps
);

export const useLisk = (): LiskContextStateProps => {
  const context = React.useContext(LiskContext);
  if (!context) {
    throw new Error(`useLisk must be used within a LiskProvider`);
  }
  return context;
};

interface Props {
  endpoint?: NetworkEndpoint;
}

export const LiskProvider: FC<Props> = ({ endpoint, ...props }) => {
  const [client, setClient] = useState<APIClient>();
  const [networkEndpoint, setNetworkEndpoint] = useState<NetworkEndpoint>();

  const { block, accounts, network } = useNetwork({
    client,
    endpoint: networkEndpoint,
  });
  const wallet = useWallet({ client, endpoint: networkEndpoint });

  useEffect(() => {
    async function setupClient() {
      if (endpoint?.nodeUrl) {
        const wsClient = await setupWsClient(endpoint.wsUrl);
        setClient(wsClient);
      }
    }
    setupClient();
    return () => {
      client?.disconnect();
      setClient(undefined);
    };
  }, [networkEndpoint]);

  function setEndpoint(endpoint: NetworkEndpoint) {
    setNetworkEndpoint(endpoint);
  }

  const value = React.useMemo(
    () => ({
      client,
      block,
      accounts,
      network,
      wallet,
      setEndpoint,
    }),
    [client, network, block]
  );

  return <LiskContext.Provider value={value} {...props} />;
};
