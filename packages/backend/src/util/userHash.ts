import bcrypt from 'bcryptjs';
const saltRounds = parseInt(process.env.HASH_CONFIG_ROUND);

export const toHash = async (plainText: string) => {
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(plainText, salt);
  return hash;
};

export const compareHash = async (
  plainText: string,
  hash: string,
): Promise<Boolean> => {
  return await bcrypt.compare(plainText, hash);
};
