import { cryptography } from "@liskhq/lisk-client";
import { _arrayBufferToString } from "./string.utils";
import { normalize } from "./object.utils";
import { LiskAccount } from "@lisk-react/types";
import { fromRawLsk } from "./valuta.utils";

export const getAccountByPassphrase = (passphrase: string) => {
  const keys = createKeysByPassphrase(passphrase);
  // @ts-ignore
  const address = cryptography
    .getAddressFromPassphrase(passphrase)
    .toString("hex");
  const account: LiskAccount = {
    address,
    passphrase: passphrase,
    keys,
    token: {
      balance: "0",
    },
  };
  return account;
};

export const normalizeAccount = (
  input: object,
  passphrase: string
): LiskAccount => {
  const account = normalize(input) as LiskAccount;
  account.keys = createKeysByPassphrase(passphrase);
  account.token = {
    balance: fromRawLsk(Number(account.token?.balance)),
  };
  account.passphrase = passphrase;
  return account;
};

export const createKeysByPassphrase = (passphrase: string = "") => {
  const keys = cryptography.getPrivateAndPublicKeyFromPassphrase(passphrase);
  const publicKey = _arrayBufferToString(keys.publicKey);
  const privateKey = _arrayBufferToString(keys.privateKey);
  return { publicKey, privateKey };
};
