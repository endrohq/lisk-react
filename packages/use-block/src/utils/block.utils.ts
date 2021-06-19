import { _arrayBufferToString } from './string.utils';
import { Block, ModuleDictionary } from '@lisk-react/types';

export class ConvertedBlock {
  private _moduleDictionary: ModuleDictionary;

  constructor() {
    this._moduleDictionary = new ModuleDictionary();
  }

  process(obj: Record<string, unknown>): Block {
    const parsed = this.normalize(obj) as Block;
    const block: Block = {
      ...parsed,
      payload: parsed?.payload?.map(tx => this._moduleDictionary.get(tx))
    };
    return block;
  }

  normalize(obj: object) {
    const block = { ...obj };
    for (let property in block) {
      if (block.hasOwnProperty(property)) {
        if (block[property] instanceof Uint8Array) {
          block[property] = _arrayBufferToString(block[property]);
        } else if (typeof block[property] === 'bigint') {
          block[property] = block[property]?.toString();
        } else if (Array.isArray(block[property])) {
          block[property] = block[property];
        } else if (typeof block[property] === 'object') {
          block[property] = this.normalize(block[property]);
        }
      }
    }
    return block;
  }
}
