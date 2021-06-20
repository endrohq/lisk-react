/**
 * A custom useEffect hook that enables you to interact with a blockchain built with the Lisk SDK
 * @param {Function} effect
 * @param {Array<any>} dependencies
 */
import React, { FC, useContext, useMemo, useEffect, useState } from "react";
import { createWSClient } from "@liskhq/lisk-api-client";
import { APIClient } from "@liskhq/lisk-api-client/dist-node/api_client";
import { LiskNetwork, NetworkEndpoint } from "@lisk-react/types";
import { useInterval } from "@lisk-react/core";

export interface LiskClientContextStateProps {
  network: LiskNetwork;
  client?: APIClient;
}

export const LiskClientContext =
  React.createContext<LiskClientContextStateProps>(
    {} as LiskClientContextStateProps
  );

export const useClient = () => useContext(LiskClientContext);

interface Props {
  endpoint?: NetworkEndpoint;
}

export const LiskClientProvider: FC<Props> = ({ children, endpoint }) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [subscribed, setSubscribed] = useState<boolean>(false);
  const [client, setClient] = useState<APIClient>();

  useEffect(() => {
    setupClient();
    return () => {
      client?.disconnect();
      setClient(undefined);
    };
  }, [endpoint]);

  async function setupClient() {
    try {
      if (endpoint?.wsUrl) {
        const wsClient = await createWSClient(endpoint?.wsUrl);
        setClient(wsClient);
        setIsConnected(true);
      }
    } catch (error) {
      console.warn("Lisk client can't connect with the given endpoint");
    }
  }

  useInterval(
    () => {
      setupClient();
    },
    !isConnected && subscribed ? 2000 : null
  );

  useEffect(() => {
    async function fetchOnClientInit() {
      if (client && !subscribed) {
        client.subscribe("app:shutdown", () => setIsConnected(false));
        setSubscribed(true);
      }
    }
    fetchOnClientInit();
  }, [client]);

  const value = useMemo(
    () => ({
      network: {
        isConnected,
        endpoint,
      },
      client,
    }),
    [client, isConnected]
  );

  return (
    <LiskClientContext.Provider value={value}>
      {children}
    </LiskClientContext.Provider>
  );
};
