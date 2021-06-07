import { apiClient } from "@liskhq/lisk-client";

const { createWSClient } = apiClient;

export const setupWsClient = (wsUrl: string) => {
  return createWSClient(wsUrl);
};
