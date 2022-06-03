import bcrypt from 'bcryptjs';
import CJS from 'crypto-js';

const saltRounds = parseInt(process.env.HASH_CONFIG_ROUND);

export const oneWayEncrypt = async (plainText: string): Promise<string> => {
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(plainText, salt);
  return hash;
};

export const compareOneWay = async (
  plainText: string,
  hash: string,
): Promise<Boolean> => {
  return await bcrypt.compare(plainText, hash);
};

export const makeUserHash = (text: string): string =>
  CJS.SHA256(text).toString();

export const aesEncrypt = (password: string, userHash: string): string => {
  const key = CJS.enc.Hex.parse(userHash.slice(0, 32));
  const iv = CJS.enc.Hex.parse(userHash.slice(32, 48));
  return CJS.AES.encrypt(password, key, { iv }).toString();
};

export const aesDecrypt = (encrypted: string, userHash: string): string => {
  const key = CJS.enc.Hex.parse(userHash.slice(0, 32));
  const iv = CJS.enc.Hex.parse(userHash.slice(32, 48));
  return CJS.AES.decrypt(encrypted, key, { iv }).toString(CJS.enc.Utf8);
};
