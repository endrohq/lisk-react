import { cryptography } from '@liskhq/lisk-client';

import { LiskAccount } from 'typings';

import { normalize } from './object.utils';
import { _arrayBufferToString } from './string.utils';
import { fromRawLsk } from './valuta.utils';

export const getAccountByPassphrase = (passphrase: string) => {
  const keys = createKeysByPassphrase(passphrase);

  const { publicKey } =
    cryptography.legacy.getPrivateAndPublicKeyFromPassphrase(keys.privateKey);
  const address = cryptography.address.getLisk32AddressFromPublicKey(publicKey);
  const account: LiskAccount = {
    address,
    passphrase,
    keys,
    sequence: {
      nonce: '0',
    },
    token: {
      balance: '0',
    },
  };
  return account;
};

export const normalizeAccount = (
  input: Record<string, unknown>,
  passphrase?: string,
): LiskAccount => {
  const account = normalize(input) as LiskAccount;
  account.keys = createKeysByPassphrase(passphrase);
  account.token = {
    balance: fromRawLsk(Number(account.token?.balance)),
  };
  if (passphrase) {
    account.passphrase = passphrase;
  }
  return account;
};

export const createKeysByPassphrase = (passphrase = '') => {
  const keys =
    cryptography.legacy.getPrivateAndPublicKeyFromPassphrase(passphrase);
  const publicKey = _arrayBufferToString(keys.publicKey);
  const privateKey = _arrayBufferToString(keys.privateKey);
  return { publicKey, privateKey };
};
