import { signUpSchema } from '@apiSchema';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import '@util/firebase';
import { query, transaction } from '@util/mysql';
import { toHash } from '@util/userHash';
import cuid from 'cuid';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { BadRequest, InternalServerError } from 'http-errors';

const signUpFunction: ValidatedEventAPIGatewayProxyEvent<
  typeof signUpSchema.properties.body
> = async (event) => {
  const { name, email, password } = event.body;
  let result = await query({
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
    const hash = await toHash(password);
    let result = await transaction()
      .query({
        sql: 'INSERT INTO user(email, uid, user_name, password, last_password_change) VALUES(?, ?, ?, ?, SYSDATE())',
        values: [email, user.uid, name, hash],
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
  inputSchema: signUpSchema,
});
