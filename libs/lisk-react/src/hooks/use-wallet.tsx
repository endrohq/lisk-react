import {} from '@liskhq/lisk-client';
import { createAccount } from 'factory/account.factory';
import { LiskClientProvider, useClient } from 'hooks/use-client';
import React, { FC, useContext, useEffect, useMemo, useState } from 'react';

import { LiskAccount, NetworkEndpoint, Wallet, WalletType } from 'typings';
import { EVENT_CHAIN_BLOCK_NEW } from 'typings/events';
import { getAccountByPassphrase, normalizeAccount } from 'utils/account.utils';
import { normalize } from 'utils/object.utils';

export const LiskWalletContext = React.createContext<Wallet>({} as Wallet);

export const useWallet = () => useContext(LiskWalletContext);

export const LiskWalletWhiteLabelProvider: FC = ({ children }) => {
  const {
    client,
    network: { isConnected },
  } = useClient();

  const [subscribed, setSubscribed] = useState<boolean>(false);
  const [wallet, setWallet] = useState<{
    account: LiskAccount | undefined;
    walletType: WalletType;
  }>({ account: undefined, walletType: WalletType.LOCAL });

  useEffect(() => {
    if (!isConnected) {
      setSubscribed(false);
    } else if (client && wallet.account?.address) {
      if (!subscribed) {
        client.subscribe(EVENT_CHAIN_BLOCK_NEW, ({ accounts }: any) => {
          const normalized = accounts?.map(item => {
            const decodedAccount = client.account.decode(
              Buffer.from(item, 'hex'),
            );
            return normalize(decodedAccount) as LiskAccount;
          });
          const updatedAccount = normalized?.find(
            acc => acc.address === wallet?.account?.address,
          );
          if (updatedAccount) {
            const acc = normalizeAccount(
              updatedAccount,
              wallet?.account?.passphrase,
            );
            setWallet({ account: acc, walletType: WalletType.BLOCKCHAIN });
          }
        });
        setSubscribed(true);
      } else {
        setSubscribed(false);
      }
    }
  }, [client, wallet?.account?.address]);

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
    passphrase: string,
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
    }),
    [wallet.account, client],
  );

  return (
    <LiskWalletContext.Provider value={value}>
      {children}
    </LiskWalletContext.Provider>
  );
};

export const LiskWalletProvider: React.FC<{ endpoint?: NetworkEndpoint }> = ({
  endpoint,
  children,
}) => {
  return (
    <LiskClientProvider endpoint={endpoint}>
      <LiskWalletWhiteLabelProvider>{children}</LiskWalletWhiteLabelProvider>
    </LiskClientProvider>
  );
};
