import bcrypt from 'bcryptjs';
const saltRounds = parseInt(process.env.HASH_CONFIG_ROUND);

export const toHash = async (plainText) => {
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(plainText, salt);
  return hash;
};
