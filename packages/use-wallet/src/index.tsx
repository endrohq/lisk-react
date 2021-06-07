import React, { FC, useContext, useEffect, useMemo, useState } from "react";
import { NetworkEndpoint, Wallet } from "@lisk-react/types";
import { useWallet, setupWsClient } from "@lisk-react/core";
import { APIClient } from "@liskhq/lisk-api-client/dist-node/api_client";

export interface LiskWalletContextStateProps extends Wallet {
  setEndpoint(endpoint?: NetworkEndpoint): void;
}

export const LiskWalletContext =
  React.createContext<LiskWalletContextStateProps>(
    {} as LiskWalletContextStateProps
  );

export const useLiskWallet = () => useContext(LiskWalletContext);

interface Props {
  endpoint: NetworkEndpoint;
}

export const LiskWalletProvider: FC<Props> = ({ endpoint, ...props }) => {
  const [client, setClient] = useState<APIClient>();
  const [networkEndpoint, setNetworkEndpoint] = useState<NetworkEndpoint>();

  const wallet = useWallet({ client, endpoint });

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

  const value = useMemo(
    () => ({
      ...wallet,
      setEndpoint,
    }),
    [endpoint]
  );

  return <LiskWalletContext.Provider value={value} {...props} />;
};
