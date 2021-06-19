import React, { FC } from "react";
import { NetworkEndpoint } from "@lisk-react/types";
import { LiskClientProvider, useClient } from "@lisk-react/use-client";
import {
  LiskWalletWhiteLabelProvider,
  useWallet,
} from "@lisk-react/use-wallet";
import { LiskBlockWhiteLabelProvider, useBlock } from "@lisk-react/use-block";

interface Props {
  endpoint?: NetworkEndpoint;
}

export { useWallet, useClient, useBlock };

export const LiskProvider: FC<Props> = ({ endpoint, children }) => (
  <LiskClientProvider endpoint={endpoint}>
    <LiskBlockWhiteLabelProvider>
      <LiskWalletWhiteLabelProvider>{children}</LiskWalletWhiteLabelProvider>
    </LiskBlockWhiteLabelProvider>
  </LiskClientProvider>
);
