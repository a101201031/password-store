/* eslint-disable camelcase */
import {
  groupCreateSchema,
  groupDeleteSchema,
  groupUpdateSchema,
} from '@apiSchema';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { authMiddyfy } from '@libs/lambda';
import type { AccountGroupModel, AccountModel } from '@model';
import { firebaseAdmin } from '@util/firebaseAdmin';
import { query, transaction } from '@util/mysql';
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import cuid from 'cuid';
import { BadRequest } from 'http-errors';
import { difference } from 'lodash';

const createFunction: ValidatedEventAPIGatewayProxyEvent<
  typeof groupCreateSchema.properties.body
> = async (event) => {
  const { group_name } = event.body;
  const member = [...(event.body.member as unknown as AccountModel['aid'][])];
  const { uid } = await firebaseAdmin
    .auth()
    .verifyIdToken(event.headers.Authorization.split(' ')[1]);

  const gid = cuid();

  const group = await query({
    sql: `
    SELECT group_name 
    FROM account_group 
    WHERE uid = ? 
      AND group_name = ?`,
    values: [uid, group_name],
  });
  if (group[0]) {
    throw new BadRequest('Group already in use');
  }

  const targetMember: Pick<AccountModel, 'aid'>[] | undefined =
    member.length === 0
      ? undefined
      : await query({
          sql: `
          SELECT A.aid
          FROM account A 
          INNER JOIN account_group AG 
            ON A.gid = AG.gid 
            WHERE AG.uid = ?
              AND A.aid in (?)`,
          values: [uid, member],
        });

  const commonTransaction = transaction().query({
    sql: `
    INSERT INTO account_group
      (uid,
      gid,
      group_name)
    VALUES (?, ?, ?)`,
    values: [uid, gid, group_name],
  });

  if (targetMember) {
    await commonTransaction
      .query({
        sql: `
        UPDATE account A 
        INNER JOIN account_group AG 
          ON A.gid = AG.gid 
        SET A.gid = ? 
        WHERE AG.uid = ? 
          AND A.aid IN (?)`,
        values: [gid, uid, targetMember.map((v) => v.aid)],
      })
      .commit();
  } else {
    await commonTransaction.commit();
  }

  return formatJSONResponse({ message: 'success' });
};

const readFunction = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const { uid } = await firebaseAdmin
    .auth()
    .verifyIdToken(event.headers.Authorization.split(' ')[1]);

  const groups = await query({
    sql: `SELECT AG.gid, AG.group_name, AG.created_at, COUNT(A.aid) accounts FROM account_group AG LEFT OUTER JOIN account A ON AG.gid = A.gid WHERE AG.uid = ? GROUP BY AG.gid, AG.group_name, AG.created_at`,
    values: [uid],
  });
  return formatJSONResponse({ groups, message: 'success' });
};

const updateFunction: ValidatedEventAPIGatewayProxyEvent<
  typeof groupUpdateSchema.properties.body
> = async (event) => {
  const { gid, group_name = undefined, member = undefined } = event.body;

  const { uid } = await firebaseAdmin
    .auth()
    .verifyIdToken(event.headers.Authorization.split(' ')[1]);

  interface OriginGroupTypes
    extends Pick<AccountGroupModel, 'gid' | 'group_name'> {}

  interface ModifyDataTypes
    extends Partial<Pick<AccountGroupModel, 'group_name'>> {
    member?: string[];
  }

  const modify: ModifyDataTypes = {};

  const group: OriginGroupTypes[] = await query({
    sql: `
    SELECT gid, group_name
    FROM account_group 
    WHERE uid = ? 
      AND gid = ?`,
    values: [uid, gid],
  });
  if (!group[0]) {
    throw new BadRequest('Group does not exist');
  }

  const targetGroupDupCheck = await query({
    sql: `
    SELECT gid, group_name 
    FROM account_group 
    WHERE uid = ? 
      AND group_name = ?
      AND gid != ?`,
    values: [uid, group_name, gid],
  });
  if (targetGroupDupCheck[0]) {
    throw new BadRequest('Group already in use');
  }
  const originMember: Pick<AccountModel, 'aid'>[] = await query({
    sql: `
    SELECT A.aid
    FROM account A 
    INNER JOIN account_group AG 
      ON A.gid = AG.gid 
      WHERE AG.uid = ?
        AND A.gid`,
    values: [uid, gid],
  });

  if (group_name && group_name !== group[0].group_name) {
    modify.group_name = group_name;
  }

  if (
    difference(
      [...new Set(member)],
      originMember.map((v) => v.aid),
    ).length !== 0
  ) {
    modify.member = member;
  }

  const commonTransaction = transaction();

  if (Object.keys(modify).length !== 0) {
    if (modify.group_name) {
      commonTransaction.query({
        sql: `
      UPDATE account_group 
      SET group_name = ? 
      WHERE uid = ? 
        AND gid = ?`,
        values: [modify.group_name, uid, gid],
      });
    }

    if (modify.member) {
      const targetMember: Pick<AccountModel, 'aid'>[] = await query({
        sql: `
        SELECT A.aid
        FROM account A 
        INNER JOIN account_group AG 
          ON A.gid = AG.gid 
          WHERE AG.uid = ?
            AND A.aid in (?)`,
        values: [uid, member],
      });
      commonTransaction.query({
        sql: `
        UPDATE account A 
        INNER JOIN account_group AG 
          ON A.gid = AG.gid 
        SET A.gid = ? 
        WHERE AG.uid = ? 
          AND A.aid IN (?)`,
        values: [gid, uid, targetMember.map((v) => v.aid)],
      });
    }
    await commonTransaction.commit();
  }

  return formatJSONResponse({ message: 'success' });
};

const deleteFunction = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const { gid } = event.pathParameters;
  const { uid } = await firebaseAdmin
    .auth()
    .verifyIdToken(event.headers.Authorization.split(' ')[1]);

  const group = await query({
    sql: `
    SELECT group_name 
    FROM account_group 
    WHERE uid = ? 
      AND gid = ?`,
    values: [uid, gid],
  });
  if (!group[0]) {
    throw new BadRequest('Not found group');
  }

  const member: Pick<AccountModel, 'aid'>[] = await query({
    sql: `
    SELECT A.aid
    FROM account A
    INNER JOIN account_group AG
      ON AG.gid = A.gid
      WHERE AG.uid = ?
        AND A.gid = ?`,
    values: [uid, gid],
  });
  if (member.length !== 0) {
    throw new BadRequest('Member exists in a group.');
  }

  await transaction()
    .query({
      sql: `
      DELETE FROM account_group 
      WHERE uid = ? 
        AND gid = ?`,
      values: [uid, gid],
    })
    .commit();

  return formatJSONResponse({ message: 'success' });
};

export const createGroup = authMiddyfy({
  handler: createFunction,
  inputSchema: groupCreateSchema,
});

export const readGroup = authMiddyfy({
  handler: readFunction,
});

export const updateGroup = authMiddyfy({
  handler: updateFunction,
  inputSchema: groupUpdateSchema,
});

export const deleteGroup = authMiddyfy({
  handler: deleteFunction,
  inputSchema: groupDeleteSchema,
});
