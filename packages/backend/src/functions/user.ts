/* eslint-disable camelcase */
import {
  userDeleteSchema,
  userPasswordUpdateSchema,
  userUpdateSchema,
} from '@apiSchema/user';
import type {
  AuthorizedAPIGatewayProxyEvent,
  ValidatedEventAPIGatewayProxyEvent,
} from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { authMiddyfy } from '@libs/lambda';
import type { AccountModel } from '@model/account';
import type { UserModel } from '@model/user';
import {
  aesDecrypt,
  aesEncrypt,
  makeUserHash,
  oneWayEncrypt,
} from '@util/crypto';
import { query, transaction } from '@util/mysql';
import type { APIGatewayProxyResult } from 'aws-lambda';
import { getAuth } from 'firebase-admin/auth';
import { BadRequest, InternalServerError } from 'http-errors';
import keys from 'lodash/keys';
import forEach from 'lodash/forEach';

interface ModifiableUserTypes extends Pick<UserModel, 'user_name'> {}

const readFunction = async (
  event: AuthorizedAPIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const {
    decodedIdToken: { uid },
  } = event.body;
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
  const {
    user_name,
    decodedIdToken: { uid },
  } = event.body;

  const modify: Partial<ModifiableUserTypes> = {};

  const selectUser: ModifiableUserTypes[] = await query({
    sql: `
    SELECT user_name
    FROM user
    WHERE uid = ?`,
    values: [uid],
  });

  if (user_name && user_name !== selectUser[0].user_name) {
    modify.user_name = user_name;
  }

  if (keys(modify).length !== 0) {
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

const deleteFunction: ValidatedEventAPIGatewayProxyEvent<
  typeof userDeleteSchema.properties.body
> = async (event) => {
  const {
    decodedIdToken: { uid },
  } = event.body;

  try {
    await transaction()
      .query({
        sql: `
          DELETE A, AG
          FROM account A
          INNER JOIN account_group AG
          ON A.gid = AG.gid
          WHERE AG.uid = ?`,
        values: [uid],
      })
      .query({
        sql: `
          DELETE user
          FROM user
          WHERE uid = ?`,
        values: [uid],
      })
      .commit();
    await getAuth().deleteUser(uid);
  } catch (e) {
    throw new InternalServerError('Failed to delete user.');
  }

  return formatJSONResponse({ message: 'success' });
};

const updateUserPasswordFunction: ValidatedEventAPIGatewayProxyEvent<
  typeof userPasswordUpdateSchema.properties.body
> = async (event) => {
  const {
    currentPassword,
    newPassword,
    confirmPassword,
    decodedIdToken: { uid },
  } = event.body;
  if (currentPassword === newPassword) {
    throw new BadRequest(
      'New password must be different from your current password.',
    );
  } else if (newPassword !== confirmPassword) {
    throw new BadRequest('Passwords do not match.');
  }

  const selectHash: Pick<UserModel, 'hash_key'>[] = await query({
    sql: `
    SELECT hash_key
    FROM user
    WHERE uid = ?`,
    values: [uid],
  });
  const { hash_key: originHashKey } = selectHash[0];

  const enPassword = await oneWayEncrypt(newPassword);
  const newHashKey = makeUserHash(enPassword);

  const selectAccountPassword: Pick<
    AccountModel,
    'aid' | 'password' | 'updated_at'
  >[] = await query({
    sql: `
      SELECT 
        A.aid, 
        A.password, 
        A.updated_at
      FROM account A
      INNER JOIN account_group AG
        ON A.gid = AG.gid
          WHERE AG.uid = ?
            AND password IS NOT NULL`,
    values: [uid],
  });

  try {
    const hashChangeTransaction = transaction().query({
      sql: `
        UPDATE user
        SET 
          hash_key = ?, 
          last_password_changed = NOW()
        WHERE uid = ?`,
      values: [newHashKey, uid],
    });
    forEach(selectAccountPassword, (v) => {
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
  } catch (e) {
    throw new InternalServerError();
  }

  return formatJSONResponse({ message: 'success' });
};

export const readUser = authMiddyfy({
  handler: readFunction,
});

export const updateUser = authMiddyfy({
  handler: updateFunction,
  eventSchema: userUpdateSchema,
});

export const deleteUser = authMiddyfy({
  handler: deleteFunction,
  eventSchema: userDeleteSchema,
});

export const updateUserPassword = authMiddyfy({
  handler: updateUserPasswordFunction,
  eventSchema: userPasswordUpdateSchema,
});
