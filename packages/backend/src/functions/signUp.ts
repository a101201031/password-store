import { signUpSchema } from '@apiSchema/signUp';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { authMiddyfy } from '@libs/lambda';
import { makeUserHash, oneWayEncrypt } from '@util/crypto';
import { query, transaction } from '@util/mysql';
import cuid from 'cuid';
import { BadRequest, InternalServerError } from 'http-errors';

const signUpFunction: ValidatedEventAPIGatewayProxyEvent<
  typeof signUpSchema.properties.body
> = async (event) => {
  const {
    name,
    email,
    password,
    decodedIdToken: { uid },
  } = event.body;
  const emailDuplicate = await query({
    sql: 'SELECT email FROM user WHERE email = ?',
    values: [email],
  });
  if (emailDuplicate[0]) throw new BadRequest('Email already in use.');

  try {
    const enPassword = await oneWayEncrypt(password);
    const hashKey = makeUserHash(enPassword);
    await transaction()
      .query({
        sql: `
          INSERT INTO
            user(
              email,
              uid,
              user_name,
              password,
              hash_key)
          VALUES(?, ?, ?, ?, ?)`,
        values: [email, uid, name, enPassword, hashKey],
      })
      .query({
        sql: `
          INSERT INTO 
            account_group(
              uid,
              gid,
              group_name) 
          VALUES(?, ?, ?)`,
        values: [uid, cuid(), 'Default Group'],
      })
      .commit();
    return formatJSONResponse({ message: 'success' });
  } catch (e) {
    throw new InternalServerError();
  }
};

export const signUp = authMiddyfy({
  handler: signUpFunction,
  eventSchema: signUpSchema,
});
