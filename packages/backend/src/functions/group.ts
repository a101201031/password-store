import { groupSchema } from '@apiSchema';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { authMiddyfy } from '@libs/lambda';
import { firebaseAdmin } from '@util/firebaseAdmin';
import { query, transaction } from '@util/mysql';
import cuid from 'cuid';
import { BadRequest } from 'http-errors';

const createFunction: ValidatedEventAPIGatewayProxyEvent<
  typeof groupSchema.properties.body
> = async (event) => {
  const idToken = event.headers.Authorization.split(' ')[1];
  const { uid } = await firebaseAdmin.auth().verifyIdToken(idToken);
  const gid = cuid();
  const { groupName } = event.body;

  let result = await query({
    sql: 'SELECT group_name FROM account_group WHERE uid = ? AND group_name = ?',
    values: [uid, groupName],
  });
  if (result[0]) {
    throw new BadRequest('Group already in use');
  }

  await transaction()
    .query({
      sql: 'INSERT INTO account_group(uid, gid, group_name) VALUES(?, ?, ?)',
      values: [uid, gid, groupName],
    })
    .commit();
  return formatJSONResponse({ message: 'success' });
};

const deleteFunction: ValidatedEventAPIGatewayProxyEvent<
  typeof groupSchema.properties.body
> = async (event) => {
  const idToken = event.headers.Authorization.split(' ')[1];
  const { uid } = await firebaseAdmin.auth().verifyIdToken(idToken);
  const { groupName } = event.body;
  let result = await query({
    sql: 'SELECT group_name FROM account_group WHERE uid = ? AND group_name = ?',
    values: [uid, groupName],
  });
  if (!result[0]) {
    throw new BadRequest('Not found group');
  }
  await transaction()
    .query({
      sql: 'DELETE FROM account_group WHERE uid = ? AND group_name = ?',
      values: [uid, groupName],
    })
    .commit();
  return formatJSONResponse({ message: 'success' });
};

export const deleteGroup = authMiddyfy({
  handler: deleteFunction,
  inputSchema: groupSchema,
});

export const createGroup = authMiddyfy({
  handler: createFunction,
  inputSchema: groupSchema,
});
