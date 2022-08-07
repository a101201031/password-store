/* eslint-disable camelcase */
import { groupCreateSchema, groupSchema } from '@apiSchema';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { authMiddyfy } from '@libs/lambda';
import { firebaseAdmin } from '@util/firebaseAdmin';
import { query, transaction } from '@util/mysql';
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import cuid from 'cuid';
import { BadRequest } from 'http-errors';

const createFunction: ValidatedEventAPIGatewayProxyEvent<
  typeof groupCreateSchema.properties.body
> = async (event) => {
  const idToken = event.headers.Authorization.split(' ')[1];
  const { uid } = await firebaseAdmin.auth().verifyIdToken(idToken);
  const gid = cuid();
  const { group_name } = event.body;

  const groups = await query({
    sql: 'SELECT group_name FROM account_group WHERE uid = ? AND group_name = ?',
    values: [uid, group_name],
  });
  if (groups[0]) {
    throw new BadRequest('Group already in use');
  }

  await transaction()
    .query({
      sql: 'INSERT INTO account_group(uid, gid, group_name) VALUES(?, ?, ?)',
      values: [uid, gid, group_name],
    })
    .commit();
  return formatJSONResponse({ message: 'success' });
};

const readFunction = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const idToken = event.headers.Authorization.split(' ')[1];
  const { uid } = await firebaseAdmin.auth().verifyIdToken(idToken);
  const groups = await query({
    sql: `SELECT AG.gid, AG.group_name, AG.created_at, COUNT(A.aid) accounts FROM account_group AG LEFT OUTER JOIN account A ON AG.gid = A.gid WHERE AG.uid = ? GROUP BY AG.gid, AG.group_name, AG.created_at`,
    values: [uid],
  });
  return formatJSONResponse({ groups, message: 'success' });
};

const deleteFunction: ValidatedEventAPIGatewayProxyEvent<
  typeof groupSchema.properties.body
> = async (event) => {
  const idToken = event.headers.Authorization.split(' ')[1];
  const { uid } = await firebaseAdmin.auth().verifyIdToken(idToken);
  const { gid } = event.body;
  const groups = await query({
    sql: 'SELECT group_name FROM account_group WHERE uid = ? AND gid = ?',
    values: [uid, gid],
  });
  if (!groups[0]) {
    throw new BadRequest('Not found group');
  }
  await transaction()
    .query({
      sql: 'DELETE FROM account_group WHERE uid = ? AND gid = ?',
      values: [uid, gid],
    })
    .commit();
  return formatJSONResponse({ message: 'success' });
};

export const deleteGroup = authMiddyfy({
  handler: deleteFunction,
  inputSchema: groupSchema,
});

export const readGroup = authMiddyfy({
  handler: readFunction,
});

export const createGroup = authMiddyfy({
  handler: createFunction,
  inputSchema: groupCreateSchema,
});
