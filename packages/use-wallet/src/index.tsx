import React, { FC, useContext, useEffect, useMemo, useState } from "react";
import { LiskAccount, NetworkEndpoint, Wallet } from "@lisk-react/types";
import {
  useClient,
  normalize,
  normalizeAccount,
  createAccount,
  getAccountByPassphrase,
} from "@lisk-react/core";

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

  const [account, setAccount] = useState<LiskAccount>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (endpoint?.wsUrl) setNetworkEndpoint(endpoint);
  }, [endpoint]);

  useEffect(() => {
    if (client) {
      client.subscribe("app:block:new", ({ accounts }: any) => {
        // Decode related accounts
        const convertedAccounts = accounts?.map((item) => {
          const decodedAccount = client.account.decode(item);
          return normalize(decodedAccount);
        });
        const updatedAccount = convertedAccounts.find(
          (item) => item?.address === account?.address
        );
        if (updatedAccount && Object.keys(updatedAccount)?.length > 0) {
          setAccount(updatedAccount);
        }
      });
    }
  }, [client]);

  async function authenticate(passphrase: string): Promise<void> {
    const account = getAccountByPassphrase(passphrase);
    if (!account) return;
    if (client && account?.address) {
      updateAccount(account?.address, passphrase);
    } else {
      setAccount(account);
    }
  }

  function logout() {
    setAccount(undefined);
  }

  async function updateAccount(
    address: string,
    passphrase: string
  ): Promise<void> {
    await setLoading(true);
    try {
      if (client) {
        const account = await client.account.get(address);
        const normalizedAccount = normalizeAccount(account, passphrase);
        setAccount(normalizedAccount);
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
      generate: () => createAccount(),
      setAccount: (account: LiskAccount) => setAccount(account),
      loading,
      setEndpoint: (endpoint: NetworkEndpoint) => setNetworkEndpoint(endpoint),
    }),
    [endpoint, loading, account, client]
  );

  return (
    <LiskWalletContext.Provider value={value}>
      {children}
    </LiskWalletContext.Provider>
  );
};
