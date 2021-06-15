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
    setupClient();
    return () => {
      client?.disconnect();
      setClient(undefined);
    };
  }, [endpoint]);

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

  function reInitializeClient() {
    client?.disconnect();
    setupClient();
  }

  return { client, reInitializeClient };
}
