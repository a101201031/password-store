import { passwordReadSchema } from '@apiSchema/password';
import type { AuthorizedAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { authMiddyfy } from '@libs/lambda';
import type { AccountModel } from '@model/account';
import type { UserModel } from '@model/user';
import { aesDecrypt } from '@util/crypto';
import { query } from '@util/mysql';
import type { APIGatewayProxyResult } from 'aws-lambda';
import { BadRequest } from 'http-errors';

const readFunction = async (
  event: AuthorizedAPIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const {
    pathParameters: { aid },
    body: {
      decodedIdToken: { uid },
    },
  } = event;

  const selectAccount: Pick<AccountModel, 'authentication' | 'password'>[] =
    await query({
      sql: `
        SELECT
          A.authentication, 
          A.password
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

  const result: Partial<Pick<AccountModel, 'authentication' | 'password'>> = {};
  if (selectAccount[0].authentication !== 'standalone') {
    const baseAuthAccount: Pick<AccountModel, 'password' | 'service_name'>[] =
      await query({
        sql: `
          SELECT A.password, A.service_name
          FROM account A
          INNER JOIN account_group AG
            ON A.gid = AG.gid
          WHERE AG.uid = ?
            AND A.aid = ?`,
        values: [uid, selectAccount[0].authentication],
      });
    result.authentication = baseAuthAccount[0].service_name;
    result.password = baseAuthAccount[0].password;
  } else {
    result.authentication = selectAccount[0].authentication;
    result.password = selectAccount[0].password;
  }

  const selectHashKey: Pick<UserModel, 'hash_key'>[] = await query({
    sql: `
      SELECT hash_key
      FROM user
      WHERE uid = ?`,
    values: [uid],
  });

  result.password = aesDecrypt(result.password, selectHashKey[0].hash_key);
  return formatJSONResponse({ message: 'success', result });
};

export const readPassword = authMiddyfy({
  handler: readFunction,
  eventSchema: passwordReadSchema,
});
