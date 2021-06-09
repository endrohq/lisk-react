import { useState } from "react";
import { APIClient } from "@liskhq/lisk-api-client/dist-node/api_client";
import { NetworkEndpoint, LiskAccount, Wallet } from "@lisk-react/types";
import { useEffect } from "react";
import { getAccountByPassphrase } from "../utils/account.utils";
import accountFactory from "../factory/account.factory";
import { useNetwork } from "./useNetwork";
import { useMemo } from "react";

interface Props {
  client?: APIClient;
  endpoint?: NetworkEndpoint;
}

export function useWallet({ client, endpoint }: Props): Wallet {
  const { accounts } = useNetwork({ client, endpoint });
  const [account, setAccount] = useState<LiskAccount>();
  const [loading, setLoading] = useState<boolean>(false);

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

  return useMemo(
    () => ({
      isAuthenticated: !!account,
      authenticate,
      logout,
      account,
      generate: generateAccount,
      setAccount: setLiskAccount,
      loading,
    }),
    [account, loading]
  );
}
