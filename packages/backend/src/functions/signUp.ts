import { signUpSchema } from '@apiSchema';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import '@util/firebase';
import { query, transaction } from '@util/mysql';
import { makeUserHash, oneWayEncrypt } from '@util/crypto';
import cuid from 'cuid';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { BadRequest, InternalServerError } from 'http-errors';

const signUpFunction: ValidatedEventAPIGatewayProxyEvent<
  typeof signUpSchema.properties.body
> = async (event) => {
  const { name, email, password } = event.body;
  const result = await query({
    sql: 'SELECT email FROM user WHERE email = ?',
    values: [email],
  });
  if (result[0]) {
    throw new BadRequest('Email already in use');
  }

  const auth = getAuth();
  try {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const enPassword = await oneWayEncrypt(password);
    const hashKey = await makeUserHash(enPassword);
    await transaction()
      .query({
        sql: 'INSERT INTO user(email, uid, user_name, password, hash_key, last_password_changed) VALUES(?, ?, ?, ?, ?, SYSDATE())',
        values: [email, user.uid, name, enPassword, hashKey],
      })
      .query({
        sql: 'INSERT INTO account_group(uid, gid, group_name) VALUES(?, ?, ?)',
        values: [user.uid, cuid(), 'Default Group'],
      })
      .commit();
    return formatJSONResponse({ token: await user.getIdToken() });
  } catch (e) {
    throw new InternalServerError();
  }
};

export const signUp = middyfy({
  handler: signUpFunction,
  eventSchema: signUpSchema,
});
