import { cryptography, passphrase } from '@liskhq/lisk-client';
import { LiskAccount } from 'typings';
import { _arrayBufferToString } from 'utils/string.utils';

const { Mnemonic } = passphrase;

export function createAccount(): LiskAccount {
  const passphrase = Mnemonic.generateMnemonic();
  const keys =
    cryptography.legacy.getPrivateAndPublicKeyFromPassphrase(passphrase);
  const publicKey = _arrayBufferToString(keys.publicKey);
  const privateKey = _arrayBufferToString(keys.privateKey);
  const address = cryptography.address
    .getAddressFromPrivateKey(keys.privateKey)
    .toString('hex');
  return {
    address,
    keys: {
      publicKey,
      privateKey,
    },
    passphrase,
    token: {
      balance: '0',
    },
    dpos: {
      delegate: {
        username: '',
        consecutiveMissedBlocks: 0,
        lastForgedHeight: 0,
        pomHeights: [],
        totalVotesReceived: '',
        isBanned: false,
      },
      unlocking: [],
      sentVotes: [],
    },
  };
}
