import { cryptography } from '@liskhq/lisk-client';
import { _arrayBufferToString } from './string.utils';
import { LiskAccount } from '@lisk-react/typings';

export const getAccountByPassphrase = (passphrase: string) => {
  const keys = cryptography.getPrivateAndPublicKeyFromPassphrase(
    passphrase || ''
  );
  const publicKey = _arrayBufferToString(keys.publicKey);
  const privateKey = _arrayBufferToString(keys.privateKey);
  // @ts-ignore
  const address = cryptography
    .getAddressFromPassphrase(passphrase)
    .toString('hex');
  const account: LiskAccount = {
    address,
    passphrase: passphrase,
    keys: {
      publicKey,
      privateKey
    },
    token: {
      balance: '0'
    }
  };
  return account;
};
