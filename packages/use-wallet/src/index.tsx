import React, { FC, useContext, useEffect, useMemo, useState } from "react";
import {
  LiskAccount,
  NetworkEndpoint,
  Wallet,
  WalletType,
} from "@lisk-react/types";
import { APIClient } from "@liskhq/lisk-api-client/dist-node/api_client";
import {
  useClient,
  normalizeAccount,
  createAccount,
  getAccountByPassphrase,
  normalize,
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

  const [subscribed, setSubscribed] = useState<boolean>(false);
  const [wallet, setWallet] = useState<{
    account: LiskAccount | undefined;
    walletType: WalletType;
  }>({ account: undefined, walletType: WalletType.LOCAL });

  useEffect(() => {
    if (endpoint?.wsUrl) setNetworkEndpoint(endpoint);
  }, [endpoint]);

  useEffect(() => {
    if (client && wallet.account?.address) {
      if (!subscribed) {
        processUpdatedAccountOnNewBlock(client, wallet?.account);
        setSubscribed(true);
      } else {
        client.disconnect();
        client.init();
        processUpdatedAccountOnNewBlock(client, wallet?.account);
      }
    }
  }, [client, wallet?.account?.address]);

  function processUpdatedAccountOnNewBlock(
    client: APIClient,
    activeAccount: LiskAccount
  ) {
    client.subscribe("app:block:new", ({ accounts }: any) => {
      const normalized = accounts?.map((item) => {
        const decodedAccount = client.account.decode(item);
        return normalize(decodedAccount) as LiskAccount;
      });
      const updatedAccount = normalized?.find(
        (acc) => acc.address === activeAccount.address
      );
      if (!!updatedAccount) {
        const acc = normalizeAccount(updatedAccount, activeAccount.passphrase);
        setWallet({ account: acc, walletType: WalletType.BLOCKCHAIN });
      }
    });
  }

  async function authenticate(passphrase: string): Promise<void> {
    const account = getAccountByPassphrase(passphrase);
    if (!account) return;
    if (client && account?.address) {
      updateAccount(account?.address, passphrase);
    } else {
      setWallet({ account, walletType: WalletType.LOCAL });
    }
  }

  function logout() {
    setWallet({ account: undefined, walletType: WalletType.LOCAL });
  }

  async function updateAccount(
    address: string,
    passphrase: string
  ): Promise<void> {
    let account;
    let walletType = WalletType.LOCAL;
    try {
      if (client) {
        account = await client.account.get(address);
        walletType = WalletType.BLOCKCHAIN;
      }
    } catch (error) {
      account = getAccountByPassphrase(passphrase);
      walletType = WalletType.LOCAL;
    }
    const normalizedAccount = normalizeAccount(account, passphrase);
    setWallet({ account: normalizedAccount, walletType });
  }

  const value = useMemo(
    () => ({
      isAuthenticated: !!wallet.account,
      authenticate,
      logout,
      account: wallet.account,
      walletType: wallet.walletType,
      generate: () => createAccount(),
      setEndpoint: (endpoint: NetworkEndpoint) => setNetworkEndpoint(endpoint),
    }),
    [endpoint, wallet.account, client]
  );

  return (
    <LiskWalletContext.Provider value={value}>
      {children}
    </LiskWalletContext.Provider>
  );
};
