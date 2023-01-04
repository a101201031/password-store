/* eslint-disable camelcase */
import { userPasswordUpdateSchema, userUpdateSchema } from '@apiSchema';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { authMiddyfy } from '@libs/lambda';
import type { AccountModel, UserModel } from '@model';
import '@util/firebase';
import { firebaseAdmin } from '@util/firebaseAdmin';
import { query, transaction } from '@util/mysql';
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import type { FirebaseError } from 'firebase-admin';
import {
  getAuth,
  signInWithEmailAndPassword,
  updatePassword,
} from 'firebase/auth';
import { BadRequest, InternalServerError } from 'http-errors';
import {
  makeUserHash,
  oneWayEncrypt,
  aesDecrypt,
  aesEncrypt,
} from '@util/crypto';

const readFunction = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const { uid } = await firebaseAdmin
    .auth()
    .verifyIdToken(event.headers.Authorization.split(' ')[1]);
  const userInfo: Pick<
    UserModel,
    | 'email'
    | 'user_name'
    | 'last_password_changed'
    | 'two_fact_auth_type'
    | 'created_at'
  > = await query({
    sql: `
    SELECT 
      email, user_name, last_password_changed, two_fact_auth_type, created_at
    FROM user
    WHERE uid = ?`,
    values: [uid],
  });
  return formatJSONResponse({ message: 'success', result: userInfo });
};

const updateFunction: ValidatedEventAPIGatewayProxyEvent<
  typeof userUpdateSchema.properties.body
> = async (event) => {
  const { user_name } = event.body;
  const { uid } = await firebaseAdmin
    .auth()
    .verifyIdToken(event.headers.Authorization.split(' ')[1]);

  interface ModifyDataTypes extends Partial<Pick<UserModel, 'user_name'>> {}

  const modify: ModifyDataTypes = {};

  const originUserName: Pick<UserModel, 'user_name'>[] = await query({
    sql: `
    SELECT user_name
    FROM user
    WHERE UID = ?`,
    values: [uid],
  });

  if (user_name && user_name !== originUserName[0].user_name) {
    modify.user_name = user_name;
  }

  if (Object.keys(modify).length !== 0) {
    await transaction()
      .query({
        sql: `
        UPDATE user
        SET user_name = ?
        WHERE uid = ?`,
        values: [modify.user_name, uid],
      })
      .commit();
  }

  return formatJSONResponse({ message: 'success' });
};

const updateUserPasswordFunction: ValidatedEventAPIGatewayProxyEvent<
  typeof userPasswordUpdateSchema.properties.body
> = async (event) => {
  const { uid } = await firebaseAdmin
    .auth()
    .verifyIdToken(event.headers.Authorization.split(' ')[1]);
  const { currentPassword, newPassword, confirmPassword } = event.body;
  if (currentPassword === newPassword) {
    throw new BadRequest(
      'New password must be different from your current password.',
    );
  } else if (newPassword !== confirmPassword) {
    throw new BadRequest('Passwords do not match.');
  }

  const selectEmailHash: Pick<UserModel, 'email' | 'hash_key'>[] = await query({
    sql: `
    SELECT
      email, hash_key
    FROM user
    WHERE uid = ?`,
    values: [uid],
  });
  const { email, hash_key: originHashKey } = selectEmailHash[0];

  const auth = getAuth();
  try {
    await signInWithEmailAndPassword(auth, email, currentPassword);
  } catch (e) {
    const err = e as FirebaseError;
    if (err.code === 'auth/wrong-password') {
      throw new BadRequest('Incorrect current password.');
    } else {
      throw new BadRequest('Unknown error.');
    }
  }

  const enPassword = await oneWayEncrypt(newPassword);
  const newHashKey = await makeUserHash(enPassword);

  const accountPassword: Pick<
    AccountModel,
    'aid' | 'password' | 'updated_at'
  >[] = await query({
    sql: `
      SELECT A.aid, A.password, A.updated_at
      FROM account A
      INNER JOIN account_group AG
        ON A.gid = AG.gid
      WHERE AG.uid = ?
        AND A.authentication = 'standalone'`,
    values: [uid],
  });

  try {
    const hashChangeTransaction = transaction().query({
      sql: `
        UPDATE user
        SET hash_key = ?, last_password_changed = NOW()
        WHERE uid = ?`,
      values: [newHashKey, uid],
    });
    accountPassword.forEach((v) => {
      hashChangeTransaction.query({
        sql: `
          UPDATE account A
          INNER JOIN account_group AG
            ON A.gid = AG.gid
          SET password = ?, updated_at = ?
          WHERE aid = ?
            AND AG.uid = ?`,
        values: [
          aesEncrypt(aesDecrypt(v.password, originHashKey), newHashKey),
          v.updated_at,
          v.aid,
          uid,
        ],
      });
    });
    await hashChangeTransaction.commit();

    await updatePassword(auth.currentUser, newPassword);
  } catch (e) {
    console.log(e);
    throw new InternalServerError();
  }

  return formatJSONResponse({ message: 'success' });
};

export const readUser = authMiddyfy({
  handler: readFunction,
});

export const updateUser = authMiddyfy({
  handler: updateFunction,
  inputSchema: userUpdateSchema,
});

export const updateUserPassword = authMiddyfy({
  handler: updateUserPasswordFunction,
  inputSchema: userPasswordUpdateSchema,
});
