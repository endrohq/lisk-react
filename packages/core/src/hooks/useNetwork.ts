import { useMemo, useState, useEffect } from "react";
import { ConvertedBlock } from "../utils/block.utils";
import { zeroHeightBlock } from "../factory/block.factory";
import { NetworkEndpoint, Block, LiskAccount } from "@lisk-react/types";
import { normalize } from "../utils/object.utils";
import { useClient } from "./useClient";

interface Props {
  endpoint?: NetworkEndpoint;
}

export function useNetwork({ endpoint }: Props) {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [block, setBlock] =
    useState<{ block: Block; accounts: LiskAccount[] }>(zeroHeightBlock);
  const { client } = useClient({ endpoint });

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

          // Decode related accounts
          const convertedAccounts = accounts?.map((item) => {
            const decodedAccount = client.account.decode(item);
            return normalize(decodedAccount);
          });
          setBlock({ block: convertedBlock, accounts: convertedAccounts });
        });
      }
    }
    setupSubscriptions();
  }, [client]);

  return {
    block: block.block,
    accounts: block.accounts,
    network: {
      isConnected,
      endpoint,
    },
    client,
  };
}
