import { useMemo, useState } from "react";
import { APIClient } from "@liskhq/lisk-api-client/dist-node/api_client";
import { ConvertedBlock } from "../utils/block.utils";
import { zeroHeightBlock } from "../factory/block.factory";
import { NetworkEndpoint, Block } from "@lisk-react/types";

interface Props {
  client?: APIClient;
  endpoint?: NetworkEndpoint;
}

export function useNetwork({ client, endpoint }: Props) {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [block, setBlock] = useState<Block>(zeroHeightBlock);

  if (client) {
    const blockConverter = useMemo(() => {
      return new ConvertedBlock();
    }, []);

    client.subscribe("app:network:ready", () => setIsConnected(true));
    client.subscribe("app:shutdown", () => setIsConnected(false));

    client.subscribe("app:block:new", ({ block }: any) => {
      const decodedBlock = client.block.decode(block);
      const convertedBlock = blockConverter.process(decodedBlock);
      setBlock(convertedBlock);
    });
  }

  return {
    block,
    network: {
      isConnected,
      endpoint,
    },
  };
}
