import { formatJSONResponse } from '@libs/api-gateway';
import { authMiddyfy, middyfy } from '@libs/lambda';
import CryptoJS from 'crypto-js/';
import {
  oneWayEncrypt,
  makeUserHash,
  aesEncrypt,
  aesDecrypt,
} from '@util/crypto';

const handler = async (event) => {
  const myPass = await oneWayEncrypt('Rkskfl12!@');
  const myHash = makeUserHash(myPass);
  // const key = myHash.slice(0, 32).toString();
  // const key = '1234567890abcdef1234567890abcdef';
  // const iv = myHash.slice(32, 48).toString();
  // const iv = '0edcba0987654321';
  // const encrypted = CryptoJS.AES.encrypt('test1', CryptoJS.enc.Hex.parse(key), {
  //   iv: CryptoJS.enc.Hex.parse(iv),
  // });

  // const decrypted = CryptoJS.AES.decrypt(
  //   encrypted.toString(),
  //   CryptoJS.enc.Hex.parse(key),
  //   {
  //     iv: CryptoJS.enc.Hex.parse(iv),
  //   },
  // );
  // const encrypted = CryptoJS.AES.encrypt('test1', key);
  // const decrypted = CryptoJS.AES.decrypt(encryptied.toString(), key);
  const encrypted = aesEncrypt('Rkskfl12!@', myHash);
  const decrypted = aesDecrypt(encrypted, myHash);
  return formatJSONResponse({
    test: 'test',
    myHash,
    encrypted,
    decrypted,
  });
};

export const test = middyfy({ handler });
