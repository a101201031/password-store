/* eslint-disable camelcase */
import {
  accountCreateSchema,
  accountDeleteSchema,
  accountUpdateSchema,
} from '@apiSchema/account';
import type {
  AuthorizedAPIGatewayProxyEvent,
  ValidatedEventAPIGatewayProxyEvent,
} from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { authMiddyfy } from '@libs/lambda';
import type { AccountModel } from '@model/account';
import type { UserModel } from '@model/user';
import { aesEncrypt } from '@util/crypto';
import { query, transaction } from '@util/mysql';
import type { APIGatewayProxyResult } from 'aws-lambda';
import cuid from 'cuid';
import { BadRequest } from 'http-errors';
import forEach from 'lodash/forEach';
import join from 'lodash/join';
import keys from 'lodash/keys';

interface ModifiableAccountTypes
  extends Pick<
    AccountModel,
    'aid' | 'gid' | 'service_account' | 'authentication' | 'password'
  > {}

const createFunction: ValidatedEventAPIGatewayProxyEvent<
  typeof accountCreateSchema.properties.body
> = async (event) => {
  const {
    gid,
    service_name,
    service_account,
    password = undefined,
    authentication = 'standalone',
    decodedIdToken: { uid },
  } = event.body;
  if (!(gid && service_name && service_account)) {
    throw new BadRequest('Misssing parameter.');
  }
  const aid = cuid();

  const selectGroup = await query({
    sql: `
      SELECT AG.group_name
      FROM account_group AG
      WHERE AG.uid = ?
        AND AG.gid = ?`,
    values: [uid, gid],
  });
  if (!selectGroup[0]) {
    throw new BadRequest('Group not found.');
  }

  const account = await query({
    sql: `
    SELECT A.service_account 
    FROM account A 
    INNER JOIN account_group AG 
      ON A.gid = AG.gid 
        WHERE AG.uid = ? 
          AND A.service_name = ? 
          AND A.service_account = ? 
          AND A.authentication = ?`,
    values: [uid, service_name, service_account, authentication],
  });
  if (account[0]) {
    throw new BadRequest('Account already in use.');
  }

  if (authentication === 'standalone') {
    const selectHashKey: Pick<UserModel, 'hash_key'>[] = await query({
      sql: `
      SELECT hash_key
      FROM user 
      WHERE uid = ?`,
      values: [uid],
    });

    const encrypted = aesEncrypt(password, selectHashKey[0].hash_key);
    await transaction()
      .query({
        sql: `
          INSERT INTO 
            account(
              aid, 
              gid, 
              service_name, 
              service_account, 
              password)
            VALUES(?, ?, ?, ?, ?)`,
        values: [aid, gid, service_name, service_account, encrypted],
      })
      .commit();
  } else {
    const selectOAuth = await query({
      sql: `
        SELECT A.aid 
        FROM account A 
        INNER JOIN account_group AG 
          ON A.gid = AG.gid 
            AND AG.uid = ? 
            WHERE A.aid = ?`,
      values: [uid, authentication],
    });
    if (!selectOAuth[0]) {
      throw new BadRequest('OAuth service not found.');
    }
    await transaction()
      .query({
        sql: `
          INSERT INTO 
            account(
              aid, 
              gid, 
              service_name, 
              authentication, 
              service_account) 
            VALUES(?, ?, ?, ?, ?)`,
        values: [aid, gid, service_name, authentication, service_account],
      })
      .commit();
  }

  return formatJSONResponse({ message: 'success' });
};

const readFunction = async (
  event: AuthorizedAPIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const {
    pathParameters: { aid },
    body: {
      decodedIdToken: { uid },
    },
  } = event;
  const selectAccount = await query({
    sql: `
      SELECT 
        A.aid, 
        A.gid, 
        A.service_name, 
        A.service_account, 
        A.authentication, 
        A.last_password_changed, 
        A.updated_at, 
        A.created_at
      FROM account A 
      INNER JOIN account_group AG 
        ON A.gid = AG.gid 
          AND AG.uid = ? 
          WHERE A.aid = ?`,
    values: [uid, aid],
  });
  if (!selectAccount[0]) {
    throw new BadRequest('Account not found.');
  }

  return formatJSONResponse({ message: 'success', result: selectAccount[0] });
};

const updateFunction: ValidatedEventAPIGatewayProxyEvent<
  typeof accountUpdateSchema.properties.body
> = async (event) => {
  const {
    aid,
    gid,
    authentication = undefined,
    password = undefined,
    decodedIdToken: { uid },
  } = event.body;

  const selectAccount: ModifiableAccountTypes[] = await query({
    sql: `
    SELECT 
      A.aid, 
      A.gid, 
      A.service_account, 
      A.authentication, 
      A.password 
    FROM account a 
    INNER JOIN account_group AG 
      ON AG.gid = A.gid 
        AND AG.uid = ? 
        WHERE A.aid = ?`,
    values: [uid, aid],
  });
  if (!selectAccount[0]) {
    throw new BadRequest('Account not found.');
  }

  const originAccount = selectAccount[0];

  const modify: Partial<ModifiableAccountTypes> = {};
  if (gid && gid !== originAccount.gid) {
    const selectGroup = await query({
      sql: `
        SELECT gid
        FROM account_group 
        WHERE uid = ? 
          AND gid = ?`,
      values: [uid, gid],
    });
    if (!selectGroup[0]) {
      throw new BadRequest('Group not found.');
    }
    modify.gid = gid;
  }
  if (
    authentication &&
    authentication !== originAccount.authentication &&
    authentication !== 'standalone'
  ) {
    const selectOAuth = await query({
      sql: `
        SELECT A.aid 
        FROM account A 
        INNER JOIN account_group AG 
          ON A.gid = AG.gid 
            AND AG.uid = ? 
            WHERE A.aid = ?`,
      values: [uid, authentication],
    });
    if (!selectOAuth[0] || selectOAuth[0].aid === aid) {
      throw new BadRequest('OAuth service invalid.');
    }
    modify.authentication = authentication;
  } else if (
    authentication &&
    authentication !== originAccount.authentication &&
    authentication === 'standalone'
  ) {
    modify.authentication = authentication;
  }

  if (password) {
    const selectHashKey: Pick<UserModel, 'hash_key'>[] = await query({
      sql: `
        SELECT hash_key 
        FROM user 
        WHERE uid = ?`,
      values: [uid],
    });
    const encrypted = aesEncrypt(password, selectHashKey[0].hash_key);
    modify.password = encrypted;
  }

  if (keys(modify).length !== 0) {
    const updateQuery = {
      sql: `
        UPDATE account 
          SET `,
      values: [],
    };
    const columnList = [];
    forEach(modify, (val, key) => {
      columnList.push(`${key} = ? `);
      updateQuery.values.push([val]);
    });
    updateQuery.sql += `${join(columnList, ',')} WHERE aid = ?`;
    updateQuery.values.push(aid);
    await transaction().query(updateQuery).commit();
  }
  return formatJSONResponse({ message: 'success' });
};

const deleteFunction = async (
  event: AuthorizedAPIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const {
    pathParameters: { aid },
    body: {
      decodedIdToken: { uid },
    },
  } = event;
  const selectAccount = await query({
    sql: `
    SELECT A.service_account
    FROM account A 
    INNER JOIN account_group AG 
      ON A.gid = AG.gid 
      WHERE AG.uid = ?
        AND A.aid = ?`,
    values: [uid, aid],
  });
  if (!selectAccount[0]) {
    throw new BadRequest('Account not found.');
  }
  await transaction()
    .query({
      sql: `
        DELETE A 
        FROM account A
        INNER JOIN account_group AG
          ON A.gid = AG.gid
            WHERE AG.uid = ?
              AND A.aid = ?`,
      values: [uid, aid],
    })
    .commit();
  return formatJSONResponse({ message: 'success' });
};

export const createAccount = authMiddyfy({
  handler: createFunction,
  eventSchema: accountCreateSchema,
});

export const readAccount = authMiddyfy({
  handler: readFunction,
});

export const updateAccount = authMiddyfy({
  handler: updateFunction,
  eventSchema: accountUpdateSchema,
});

export const deleteAccount = authMiddyfy({
  handler: deleteFunction,
  eventSchema: accountDeleteSchema,
});
