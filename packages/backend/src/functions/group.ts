/* eslint-disable camelcase */
import {
  groupCreateSchema,
  groupDeleteSchema,
  groupUpdateSchema,
} from '@apiSchema/group';
import type {
  AuthorizedAPIGatewayProxyEvent,
  ValidatedEventAPIGatewayProxyEvent,
} from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { authMiddyfy } from '@libs/lambda';
import type { AccountModel } from '@model/account';
import type { AccountGroupModel } from '@model/accountGroup';
import { query, transaction } from '@util/mysql';
import type { APIGatewayProxyResult } from 'aws-lambda';
import cuid from 'cuid';
import { BadRequest } from 'http-errors';
import difference from 'lodash/difference';
import keys from 'lodash/keys';
import map from 'lodash/map';

interface GroupMemberTypes extends Pick<AccountModel, 'aid'> {}

interface ModifiableGroupTypes
  extends Partial<Pick<AccountGroupModel, 'group_name'>> {
  member?: string[];
}

const createFunction: ValidatedEventAPIGatewayProxyEvent<
  typeof groupCreateSchema.properties.body
> = async (event) => {
  const {
    group_name,
    decodedIdToken: { uid },
  } = event.body;
  const member = [...(event.body.member as unknown as GroupMemberTypes[])];

  const gid = cuid();
  const selectGroup = await query({
    sql: `
      SELECT group_name 
      FROM account_group 
      WHERE uid = ? 
        AND group_name = ?`,
    values: [uid, group_name],
  });
  if (selectGroup[0]) {
    throw new BadRequest('Group already in use.');
  }

  const targetMember: GroupMemberTypes[] | undefined =
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
      INSERT INTO 
        account_group(
          uid,
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
        values: [gid, uid, map(targetMember, (v) => v.aid)],
      })
      .commit();
  } else {
    await commonTransaction.commit();
  }

  return formatJSONResponse({ message: 'success' });
};

const readFunction = async (
  event: AuthorizedAPIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const {
    decodedIdToken: { uid },
  } = event.body;
  const selectGroup = await query({
    sql: `
      SELECT 
        AG.gid, 
        AG.group_name, 
        AG.created_at, 
        COUNT(A.aid) 
        accounts 
      FROM account_group AG 
      LEFT OUTER JOIN account A 
        ON AG.gid = A.gid 
          WHERE AG.uid = ? 
      GROUP BY AG.gid, AG.group_name, AG.created_at`,
    values: [uid],
  });
  return formatJSONResponse({ groups: selectGroup, message: 'success' });
};

const updateFunction: ValidatedEventAPIGatewayProxyEvent<
  typeof groupUpdateSchema.properties.body
> = async (event) => {
  const {
    gid,
    group_name = undefined,
    member = undefined,
    decodedIdToken: { uid },
  } = event.body;

  const modify: ModifiableGroupTypes = {};

  const selectGroup = await query({
    sql: `
      SELECT 
        gid,
        group_name
      FROM account_group 
      WHERE uid = ? 
        AND gid = ?`,
    values: [uid, gid],
  });
  if (!selectGroup[0]) {
    throw new BadRequest('Group does not exist.');
  }

  if (group_name && group_name !== selectGroup[0].group_name) {
    const selectTargetGroup = await query({
      sql: `
        SELECT 
          gid, 
          group_name 
        FROM account_group 
        WHERE uid = ? 
          AND group_name = ?
          AND gid != ?`,
      values: [uid, group_name, gid],
    });
    if (selectTargetGroup[0]) {
      throw new BadRequest('Group already in use.');
    }
    modify.group_name = group_name;
  }

  const selectOriginMember: GroupMemberTypes[] = await query({
    sql: `
      SELECT A.aid
      FROM account A 
      INNER JOIN account_group AG 
        ON A.gid = AG.gid 
        WHERE AG.uid = ?
          AND A.gid = ?`,
    values: [uid, gid],
  });
  if (
    difference(
      [...new Set(member)],
      map(selectOriginMember, (v) => v.aid),
    ).length !== 0
  ) {
    modify.member = member;
  }

  const commonTransaction = transaction();

  if (keys(modify).length !== 0) {
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
      const selectTargetMember: GroupMemberTypes[] = await query({
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
        values: [gid, uid, map(selectTargetMember, (v) => v.aid)],
      });
    }
    await commonTransaction.commit();
  }

  return formatJSONResponse({ message: 'success' });
};

const deleteFunction = async (
  event: AuthorizedAPIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const {
    pathParameters: { gid },
    body: {
      decodedIdToken: { uid },
    },
  } = event;

  const selectGroup = await query({
    sql: `
      SELECT group_name 
      FROM account_group 
      WHERE uid = ? 
        AND gid = ?`,
    values: [uid, gid],
  });
  if (!selectGroup[0]) {
    throw new BadRequest('Group not found.');
  }

  const selectMember: GroupMemberTypes[] = await query({
    sql: `
      SELECT A.aid
      FROM account A
      INNER JOIN account_group AG
        ON AG.gid = A.gid
        WHERE AG.uid = ?
          AND A.gid = ?`,
    values: [uid, gid],
  });
  if (selectMember.length !== 0) {
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
  eventSchema: groupCreateSchema,
});

export const readGroup = authMiddyfy({
  handler: readFunction,
});

export const updateGroup = authMiddyfy({
  handler: updateFunction,
  eventSchema: groupUpdateSchema,
});

export const deleteGroup = authMiddyfy({
  handler: deleteFunction,
  eventSchema: groupDeleteSchema,
});
