/**
 * A custom useEffect hook that enables you to interact with a blockchain built with the Lisk SDK
 * @param {Function} effect
 * @param {Array<any>} dependencies
 */
import React, { FC, useContext, useMemo, useEffect, useState } from "react";
import { APIClient } from "@liskhq/lisk-api-client/dist-node/api_client";
import { Block, LiskNetwork, NetworkEndpoint } from "@lisk-react/types";

import { useNetwork } from "@lisk-react/core";
import { LiskAccount } from "@lisk-react/types";

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

  const { block, accounts, network, client } = useNetwork({
    endpoint: networkEndpoint,
  });

  useEffect(() => {
    if (endpoint?.wsUrl) setNetworkEndpoint(endpoint);
  }, [endpoint]);

  const value = useMemo(
    () => ({
      network,
      block,
      accounts,
      client,
      setEndpoint: (endpoint: NetworkEndpoint) => setNetworkEndpoint(endpoint),
    }),
    [block, network]
  );

  return (
    <LiskClientContext.Provider value={value}>
      {children}
    </LiskClientContext.Provider>
  );
};
