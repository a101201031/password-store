import { passwordReadSchema } from '@apiSchema/password';
import { formatJSONResponse } from '@libs/api-gateway';
import { authMiddyfy } from '@libs/lambda';
import type { AccountModel } from '@model/account';
import type { UserModel } from '@model/user';
import { aesDecrypt } from '@util/crypto';
import { firebaseAdmin } from '@util/firebaseAdmin';
import { query } from '@util/mysql';
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { BadRequest } from 'http-errors';

const readFunction = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const { aid } = event.pathParameters;
  const { uid } = await firebaseAdmin
    .auth()
    .verifyIdToken(event.headers.Authorization.split(' ')[1]);

  const targetAccount: Pick<AccountModel, 'authentication' | 'password'>[] =
    await query({
      sql: `
      SELECT A.authentication, A.password
      FROM account A
      INNER JOIN account_group AG
        ON A.gid = AG.gid
      WHERE AG.uid = ?
        AND A.aid = ?`,
      values: [uid, aid],
    });

  if (!targetAccount[0]) {
    throw new BadRequest('Account not found');
  }
  const result = {
    authentication: targetAccount[0].authentication,
    password: targetAccount[0].password,
  };

  if (targetAccount[0].authentication !== 'standalone') {
    const baseAuthAccount: Pick<AccountModel, 'password' | 'service_name'>[] =
      await query({
        sql: `
        SELECT A.password, A.service_name
        FROM account A
        INNER JOIN account_group AG
          ON A.gid = AG.gid
        WHERE AG.uid = ?
          AND A.aid = ?`,
        values: [uid, targetAccount[0].authentication],
      });
    result.password = baseAuthAccount[0].password;
    result.authentication = baseAuthAccount[0].service_name;
  }

  const userHashKey: Pick<UserModel, 'hash_key'>[] = await query({
    sql: `
    SELECT hash_key
    FROM user
    WHERE uid = ?`,
    values: [uid],
  });

  result.password = aesDecrypt(result.password, userHashKey[0].hash_key);
  return formatJSONResponse({ message: 'success', result });
};

export const readPassword = authMiddyfy({
  handler: readFunction,
  eventSchema: passwordReadSchema,
});
