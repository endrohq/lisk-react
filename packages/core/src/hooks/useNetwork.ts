import { useMemo, useState } from "react";
import { APIClient } from "@liskhq/lisk-api-client/dist-node/api_client";
import { ConvertedBlock } from "../utils/block.utils";
import { zeroHeightBlock } from "../factory/block.factory";
import { NetworkEndpoint, Block } from "@lisk-react/types";
import { useEffect } from "react";
import { LiskAccount } from "@lisk-react/types";
import { normalize } from "../utils/object.utils";

interface Props {
  client?: APIClient;
  endpoint?: NetworkEndpoint;
}

export function useNetwork({ client, endpoint }: Props) {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [block, setBlock] = useState<Block>(zeroHeightBlock);
  const [accounts, setAccounts] = useState<LiskAccount[]>([]);

  const blockConverter = useMemo(() => {
    return new ConvertedBlock();
  }, []);

  useEffect(() => {
    function setupSubscriptions() {
      if (client) {
        client.subscribe("app:network:ready", () => setIsConnected(true));
        client.subscribe("app:shutdown", () => setIsConnected(false));

        client.subscribe("app:block:new", ({ block, accounts }: any) => {
          // Decode block
          const decodedBlock = client.block.decode(block);
          const convertedBlock = blockConverter.process(decodedBlock);
          setBlock(convertedBlock);

          // Decode related accounts
          const convertedAccounts = accounts?.map((item) => {
            const decodedAccount = client.account.decode(item);
            return normalize(decodedAccount);
          });
          setAccounts(convertedAccounts);
        });
      }
    }
    setupSubscriptions();
  }, [client]);

  return useMemo(
    () => ({
      block,
      accounts,
      network: {
        isConnected,
        endpoint,
      },
    }),
    [block, isConnected]
  );
}
