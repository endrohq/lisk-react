/**
 * A custom useEffect hook that enables you to interact with a blockchain built with the Lisk SDK
 * @param {Function} effect
 * @param {Array<any>} dependencies
 */
import React, { FC, useContext, useEffect, useMemo, useState } from 'react';
import { apiClient } from '@liskhq/lisk-client';
import { APIClient } from '@liskhq/lisk-api-client/dist-node/api_client';
import { Block, LiskNetwork } from '@lisk-react/types';
import { ConvertedBlock } from 'utils/block.utils';
import { createDefaultBlock } from 'factory/block.factory';

const { createWSClient } = apiClient;

const defaultBlock = createDefaultBlock();

export interface LiskClientContextStateProps {
  setTargetNetwork(network: LiskNetwork): void;
  targetNetwork?: LiskNetwork;
  isConnected: boolean;
  block: Block;
  client?: APIClient;
}

export const LiskClientContext =
  React.createContext<LiskClientContextStateProps>(
    {} as LiskClientContextStateProps
  );

export const useLiskClient = () => useContext(LiskClientContext);

export const LiskClientProvider: FC<{ targetNetwork?: LiskNetwork }> = ({
  children,
  targetNetwork
}) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [network, setNetwork] = useState<LiskNetwork>();
  const [block, setBlock] = useState<Block>(defaultBlock);
  const [client, setClient] = useState<APIClient>();

  const blockConverter = useMemo(() => {
    return new ConvertedBlock();
  }, []);

  useEffect(() => {
    if (targetNetwork) {
      setNetwork(targetNetwork);
    }
  }, []);

  useEffect(() => {
    async function setupWebsocketListener() {
      if (network) {
        const wsClient = await createWSClient(network.wsUrl);
        setClient(wsClient);
      }
    }
    setupWebsocketListener();
  }, [network]);

  useEffect(() => {
    if (client) {
      client.subscribe('app:network:ready', () => setIsConnected(true));
      client.subscribe('app:shutdown', () => setIsConnected(false));

      client.subscribe('app:block:new', ({ block }: any) => {
        const decodedBlock = client.block.decode(block);
        const convertedBlock = blockConverter.process(decodedBlock);
        setBlock(convertedBlock);
      });
    }
  }, [client]);

  function setTargetNetwork(network: LiskNetwork) {
    setNetwork(network);
  }

  const value = useMemo(
    () => ({
      setTargetNetwork,
      targetNetwork: network,
      isConnected,
      block,
      client
    }),
    [client, block, network]
  );

  return (
    <LiskClientContext.Provider value={value}>
      {children}
    </LiskClientContext.Provider>
  );
};
