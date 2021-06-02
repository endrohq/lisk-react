import { LiskAccount } from '@lisk-react/types';
import { cryptography } from '@liskhq/lisk-client';
import * as passphrase from '@liskhq/lisk-passphrase';
import {_arrayBufferToString} from "../utils/string.utils";

const { Mnemonic } = passphrase;

const createAccount = (): LiskAccount => {
  const passphrase = Mnemonic.generateMnemonic();
  const keys = cryptography.getPrivateAndPublicKeyFromPassphrase(passphrase);
  const publicKey = _arrayBufferToString(keys.publicKey);
  const privateKey = _arrayBufferToString(keys.privateKey);
  const address = cryptography
    .getAddressFromPassphrase(passphrase)
    .toString('hex');
  return {
    address,
    keys: {
      publicKey,
      privateKey
    },
    passphrase,
    token: {
      balance: '0'
    },
    dpos: {
      delegate: {
        username: '',
        consecutiveMissedBlocks: 0,
        lastForgedHeight: 0,
        pomHeights: [],
        totalVotesReceived: '',
        isBanned: false
      },
      unlocking: [],
      sentVotes: []
    }
  };
};

export default {
  create: createAccount
};
