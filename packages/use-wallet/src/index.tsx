import React, { FC, useContext, useEffect, useMemo, useState } from "react";
import { LiskAccount, NetworkEndpoint, Wallet } from "@lisk-react/types";
import { useClient, useNetwork } from "@lisk-react/core";
import { getAccountByPassphrase } from "@lisk-react/core/dist/utils/account.utils";
import accountFactory from "@lisk-react/core/dist/factory/account.factory";

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
  const { accounts } = useNetwork({ client, endpoint });

  const [account, setAccount] = useState<LiskAccount>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (endpoint?.wsUrl) setNetworkEndpoint(endpoint);
  }, [endpoint]);

  useEffect(() => {
    const updatedAccount = accounts.find(
      (item) => item?.address === account?.address
    );
    if (updatedAccount && Object.keys(updatedAccount)?.length > 0) {
      setAccount(updatedAccount);
    }
  }, [accounts]);

  async function authenticate(passphrase: string): Promise<void> {
    const account = getAccountByPassphrase(passphrase);
    if (!account) return;
    if (client && account?.address) {
      updateAccount(account?.address);
    } else {
      setAccount(account);
    }
  }

  function logout() {
    setAccount(undefined);
  }

  async function updateAccount(address: string): Promise<void> {
    await setLoading(true);
    try {
      if (client) {
        const account = (await client.account.get(address)) as LiskAccount;
        setAccount(account);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }

  const value = useMemo(
    () => ({
      isAuthenticated: !!account,
      authenticate,
      logout,
      account,
      generate: () => accountFactory.create(),
      setAccount: (account: LiskAccount) => setAccount(account),
      loading,
      setEndpoint: (endpoint: NetworkEndpoint) => setNetworkEndpoint(endpoint),
    }),
    [endpoint, loading, account]
  );

  return (
    <LiskWalletContext.Provider value={value}>
      {children}
    </LiskWalletContext.Provider>
  );
};
