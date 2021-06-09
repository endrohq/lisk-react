import React, { FC, useContext, useEffect, useMemo, useState } from "react";
import { NetworkEndpoint, Wallet } from "@lisk-react/types";
import { useWallet, useClient } from "@lisk-react/core";

export interface LiskWalletContextStateProps extends Wallet {
  setEndpoint(endpoint?: NetworkEndpoint): void;
}

export const LiskWalletContext =
  React.createContext<LiskWalletContextStateProps>(
    {} as LiskWalletContextStateProps
  );

export const useLiskWallet = () => useContext(LiskWalletContext);

interface Props {
  endpoint?: NetworkEndpoint;
}

export const LiskWalletProvider: FC<Props> = ({ endpoint, children }) => {
  const [networkEndpoint, setNetworkEndpoint] = useState<NetworkEndpoint>();

  const { client } = useClient({ endpoint: networkEndpoint });
  const wallet = useWallet({ client, endpoint: networkEndpoint });

  useEffect(() => {
    if (endpoint?.wsUrl) setNetworkEndpoint(endpoint);
  }, [endpoint]);

  const value = useMemo(
    () => ({
      ...wallet,
      setEndpoint: (endpoint: NetworkEndpoint) => setNetworkEndpoint(endpoint),
    }),
    [endpoint]
  );

  return (
    <LiskWalletContext.Provider value={value}>
      {children}
    </LiskWalletContext.Provider>
  );
};
