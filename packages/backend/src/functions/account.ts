import { accountSchema } from '@apiSchema';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { authMiddyfy } from '@libs/lambda';
import type { UserModel } from '@model';
import { aesEncrypt } from '@util/crypto';
import { firebaseAdmin } from '@util/firebaseAdmin';
import { query, transaction } from '@util/mysql';
import cuid from 'cuid';
import { BadRequest } from 'http-errors';

const createFunction: ValidatedEventAPIGatewayProxyEvent<
  typeof accountSchema.properties.body
> = async (event) => {
  const { gid, serviceName, serviceAccount } = event.body;
  const password = event.body?.password;
  const authentication = event.body?.authentication || 'standalone';
  const { uid } = await firebaseAdmin
    .auth()
    .verifyIdToken(event.headers.Authorization.split(' ')[1]);
  const aid = cuid();

  let result = await query({
    sql: 'SELECT A.service_account FROM account A INNER JOIN account_group AG ON A.gid = AG.gid WHERE AG.uid = ? AND A.service_name = ? AND A.service_account = ? AND A.authentication = ?',
    values: [uid, serviceName, serviceAccount, authentication],
  });
  console.log(result);
  if (result[0]) {
    throw new BadRequest('Account already in use');
  }

  if (authentication === 'standalone') {
    let userHashKey: Pick<UserModel, 'hash_key'>[] = await query({
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
    let result = await query({
      sql: 'SELECT A.aid FROM account A INNER JOIN account_group AG ON A.gid = AG.gid AND AG.uid = ? WHERE A.aid = ?',
      values: [uid, authentication],
    });
    if (!result) {
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

export const createAccount = authMiddyfy({
  handler: createFunction,
  inputSchema: accountSchema,
});
