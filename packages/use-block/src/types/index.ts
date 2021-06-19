import { Block, LiskAccount } from "@lisk-react/types";

export interface NewBlock {
  block: Block;
  accounts: LiskAccount[];
}
