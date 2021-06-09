/**
 * A custom useEffect hook that enables you to interact with a blockchain built with the Lisk SDK
 * @param {Function} effect
 * @param {Array<any>} dependencies
 */
import React, { FC, useContext, useMemo, useEffect, useState } from "react";
import { APIClient } from "@liskhq/lisk-api-client/dist-node/api_client";
import { Block, LiskNetwork, NetworkEndpoint } from "@lisk-react/types";

import { useNetwork, setupWsClient } from "@lisk-react/core";
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
  const [client, setClient] = useState<APIClient>();
  const { block, accounts, network } = useNetwork({ client, endpoint });

  useEffect(() => {
    async function setupClient() {
      if (endpoint?.nodeUrl) {
        const wsClient = await setupWsClient(endpoint.wsUrl);
        setClient(wsClient);
      }
    }
    setupClient();
  }, [endpoint]);

  const value = useMemo(
    () => ({
      network,
      block,
      accounts,
      client,
    }),
    [client, block, network]
  );

  return (
    <LiskClientContext.Provider value={value}>
      {children}
    </LiskClientContext.Provider>
  );
};
