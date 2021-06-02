
import React, {FC, useContext, useEffect, useMemo, useState} from 'react';
import { getAccountByPassphrase } from './utils/account.utils';
import { LiskAccount } from '@lisk-react/types';
import { useLiskClient } from '@lisk-react/use-client';
import accountFactory from './factory/account.factory';

export interface LiskWalletContextStateProps {
  isAuthenticated: boolean;
  loading: boolean;
  account?: LiskAccount;
  authenticate(passphrase: string): Promise<void>;
  logout(): void;
  generateAccount(): LiskAccount;
  setAccount(account: LiskAccount): void;
}

export const LiskWalletContext =
  React.createContext<LiskWalletContextStateProps>(
    {} as LiskWalletContextStateProps
  );

export const useLiskWallet = () => useContext(LiskWalletContext);

interface Props {
  children: JSX.Element;
}

export const LiskWalletProvider: FC<Props> = ({ children }) => {
  const { client, block } = useLiskClient();
  const [account, setAccount] = useState<LiskAccount>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (client && block.payload && account) {
      const relevantTxs = block.payload
          .filter((tx) => account?.keys?.publicKey === tx?.senderPublicKey);
      if (Array.isArray(relevantTxs) && relevantTxs?.length > 0) {
        updateAccount(account?.address);
      }
    }
  }, [block])

  async function authenticate(passphrase: string): Promise<void> {
    const account = getAccountByPassphrase(passphrase);
    if (client && account !== null && Object.keys(account).length > 0) {
      updateAccount(account?.address);
    } else {
      setAccount(account);
    }
  }

  function setLiskAccount(account: LiskAccount) {
    setAccount(account);
  }

  function logout() {
    setAccount(undefined);
  }

  function generateAccount() {
    return accountFactory.create();
  }

  async function updateAccount(address: string): Promise<void> {
    await setLoading(true);
    if (client) {
      const account = (await client.account.get(address)) as LiskAccount;
      setAccount(account);
    }
    setLoading(false);
  }

  const value = useMemo(
    () => ({
      isAuthenticated: !!account,
      authenticate,
      logout,
      account,
      generateAccount,
      setAccount: setLiskAccount,
      loading
    }),
    [account, loading]
  );

  return (
    <LiskWalletContext.Provider value={value}>
      {children}
    </LiskWalletContext.Provider>
  );
};
