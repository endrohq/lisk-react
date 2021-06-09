import React, { FC } from "react";
import { NetworkEndpoint } from "@lisk-react/types";
import { LiskClientProvider, useLiskClient } from "@lisk-react/use-client";
import { LiskWalletProvider, useLiskWallet } from "@lisk-react/use-wallet";

interface Props {
  endpoint?: NetworkEndpoint;
}

export { useLiskWallet, useLiskClient };

export const LiskProvider: FC<Props> = ({ endpoint, children }) => (
  <LiskClientProvider endpoint={endpoint}>
    <LiskWalletProvider endpoint={endpoint}>{children}</LiskWalletProvider>
  </LiskClientProvider>
);
