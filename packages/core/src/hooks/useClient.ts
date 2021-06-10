import { NetworkEndpoint } from "@lisk-react/types";
import { APIClient } from "@liskhq/lisk-api-client/dist-node/api_client";
import { useEffect, useState } from "react";
import { setupWsClient } from "../client";

interface Props {
  endpoint?: NetworkEndpoint;
}

export function useClient({ endpoint }: Props) {
  const [client, setClient] = useState<APIClient>();

  useEffect(() => {
    async function setupClient() {
      try {
        if (endpoint?.wsUrl) {
          const wsClient = await setupWsClient(endpoint.wsUrl);
          setClient(wsClient);
        }
      } catch (error) {
        console.warn("Lisk client can't connect with the given endpoint");
      }
    }
    setupClient();
    return () => {
      client?.disconnect();
      setClient(undefined);
    };
  }, [endpoint]);

  return { client };
}
