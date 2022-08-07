import { accountCreateSchema, accountUpdateSchema } from '@apiSchema';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { authMiddyfy } from '@libs/lambda';
import type { AccountModel, UserModel } from '@model';
import { aesEncrypt } from '@util/crypto';
import { firebaseAdmin } from '@util/firebaseAdmin';
import { query, transaction } from '@util/mysql';
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import cuid from 'cuid';
import { BadRequest } from 'http-errors';

const createFunction: ValidatedEventAPIGatewayProxyEvent<
  typeof accountCreateSchema.properties.body
> = async (event) => {
  const { gid, serviceName, serviceAccount } = event.body;
  const password = event.body?.password;
  const authentication = event.body?.authentication || 'standalone';
  const { uid } = await firebaseAdmin
    .auth()
    .verifyIdToken(event.headers.Authorization.split(' ')[1]);
  const aid = cuid();

  const accounts = await query({
    sql: `SELECT A.service_account 
      FROM account A 
      INNER JOIN account_group AG 
        ON A.gid = AG.gid 
        WHERE AG.uid = ? 
        AND A.service_name = ? 
        AND A.service_account = ? 
        AND A.authentication = ?`,
    values: [uid, serviceName, serviceAccount, authentication],
  });
  if (accounts[0]) {
    throw new BadRequest('Account already in use');
  }

  if (authentication === 'standalone') {
    const userHashKey: Pick<UserModel, 'hash_key'>[] = await query({
      sql: 'SELECT hash_key FROM user WHERE uid = ?',
      values: [uid],
    });

    const encrypted = aesEncrypt(password, userHashKey[0].hash_key);
    await transaction()
      .query({
        sql: 'INSERT INTO account(aid, gid, service_name, service_account, password) VALUES(?, ?, ?, ?, ?)',
        values: [aid, gid, serviceName, serviceAccount, encrypted],
      })
      .commit();
  } else {
    const result = await query({
      sql: 'SELECT A.aid FROM account A INNER JOIN account_group AG ON A.gid = AG.gid AND AG.uid = ? WHERE A.aid = ?',
      values: [uid, authentication],
    });
    if (!result[0]) {
      throw new BadRequest('OAuth service not found');
    }
    await transaction()
      .query({
        sql: 'INSERT INTO account(aid, gid, service_name, authentication, service_account) VALUES(?, ?, ?, ?, ?)',
        values: [aid, gid, serviceName, authentication, serviceAccount],
      })
      .commit();
  }

  return formatJSONResponse({ message: 'success' });
};

const readFunction = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const { uid } = await firebaseAdmin
    .auth()
    .verifyIdToken(event.headers.Authorization.split(' ')[1]);
  const { aid } = event.pathParameters;
  const account = await query({
    sql: 'SELECT A.aid, A.gid, A.service_name, A.service_account, A.authentication, A.password_last_change, A.updated_at, A.created_at FROM account A INNER JOIN account_group AG ON A.gid = AG.gid AND AG.uid = ? WHERE A.aid = ?',
    values: [uid, aid],
  });
  if (!account[0]) {
    throw new BadRequest('Account not found');
  }

  return formatJSONResponse({ message: 'success', result: account[0] });
};

const updateFunction: ValidatedEventAPIGatewayProxyEvent<
  typeof accountUpdateSchema.properties.body
> = async (event) => {
  const { body } = event;
  const { uid } = await firebaseAdmin
    .auth()
    .verifyIdToken(event.headers.Authorization.split(' ')[1]);

  interface OriginAccountTypes
    extends Pick<
      AccountModel,
      'aid' | 'gid' | 'service_account' | 'authentication' | 'password'
    > {}
  const accounts: OriginAccountTypes[] = await query({
    sql: 'SELECT A.aid, A.gid, A.service_account, A.authentication, A.password FROM account a INNER JOIN account_group AG ON AG.gid = A.gid AND AG.uid = ? WHERE A.aid = ?',
    values: [uid, body.aid],
  });
  if (!accounts[0]) {
    throw new BadRequest('Account not found');
  }

  const originAccount = accounts[0];

  const modify: Partial<OriginAccountTypes> = {};
  if (body.gid && body.gid !== originAccount.gid) {
    const result = await query({
      sql: 'SELECT gid FROM account_group WHERE uid = ? AND gid = ?',
      values: [uid, body.gid],
    });
    if (!result[0]) {
      throw new BadRequest('Group not found');
    }
    modify.gid = body.gid;
  }
  if (
    body.authentication &&
    body.authentication !== originAccount.authentication &&
    body.authentication !== 'standalone'
  ) {
    const result = await query({
      sql: 'SELECT A.aid FROM account A INNER JOIN account_group AG ON A.gid = AG.gid AND AG.uid = ? WHERE A.aid = ?',
      values: [uid, body.authentication],
    });
    if (!result[0] || result[0].aid === body.aid) {
      throw new BadRequest('OAuth service invalid');
    }
    modify.authentication = body.authentication;
  } else if (body.authentication && body.authentication === 'standalone') {
    modify.authentication = body.authentication;
  }

  const updateQuery = {
    sql: 'UPDATE account SET ',
    values: [],
  };
  Object.keys(modify).forEach((val, idx, arr) => {
    updateQuery.sql += idx === arr.length - 1 ? `${val} = ? ` : `${val} = ?, `;
    updateQuery.values.push(modify[val]);
  });
  updateQuery.sql += 'WHERE aid = ?';
  updateQuery.values.push(body.aid);

  await transaction().query(updateQuery).commit();

  return formatJSONResponse({ message: 'success', modify });
};

export const createAccount = authMiddyfy({
  handler: createFunction,
  inputSchema: accountCreateSchema,
});

export const readAccount = authMiddyfy({
  handler: readFunction,
});

export const updateAccount = authMiddyfy({
  handler: updateFunction,
  inputSchema: accountUpdateSchema,
});
