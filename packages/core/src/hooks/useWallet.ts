import { useState } from "react";
import { APIClient } from "@liskhq/lisk-api-client/dist-node/api_client";
import { NetworkEndpoint, LiskAccount, Wallet } from "@lisk-react/types";
import { useEffect } from "react";
import { getAccountByPassphrase } from "../utils/account.utils";
import accountFactory from "../factory/account.factory";
import { useNetwork } from "./useNetwork";

interface Props {
  client?: APIClient;
  endpoint?: NetworkEndpoint;
}

export function useWallet({ client, endpoint }: Props): Wallet {
  const { block } = useNetwork({ client, endpoint });
  const [account, setAccount] = useState<LiskAccount>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (client && block.payload && account) {
      const relevantTxs = block.payload.filter(
        (tx) => account?.keys?.publicKey === tx?.senderPublicKey
      );
      if (Array.isArray(relevantTxs) && relevantTxs?.length > 0) {
        updateAccount(account?.address);
      }
    }
  }, [block]);

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

  return {
    isAuthenticated: !!account,
    authenticate,
    logout,
    account,
    generate: generateAccount,
    setAccount: setLiskAccount,
    loading,
  };
}
