import { Block, ModuleDictionary } from "@lisk-react/types";
import { normalize } from "./object.utils";

export class ConvertedBlock {
  private _moduleDictionary: ModuleDictionary;

  constructor() {
    this._moduleDictionary = new ModuleDictionary();
  }

  process(obj: Record<string, unknown>): Block {
    const parsed = normalize(obj) as Block;
    const block: Block = {
      ...parsed,
      payload: parsed?.payload?.map((tx) => this._moduleDictionary.get(tx)),
    };
    return block;
  }
}
