/* eslint-disable camelcase */
import { userUpdateSchema } from '@apiSchema';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { authMiddyfy } from '@libs/lambda';
import type { UserModel } from '@model';
import { firebaseAdmin } from '@util/firebaseAdmin';
import { query, transaction } from '@util/mysql';
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const readFunction = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const { uid } = await firebaseAdmin
    .auth()
    .verifyIdToken(event.headers.Authorization.split(' ')[1]);
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
  const { email, user_name } = event.body;
  const { uid } = await firebaseAdmin
    .auth()
    .verifyIdToken(event.headers.Authorization.split(' ')[1]);

  interface ModifyDataTypes extends Partial<Pick<UserModel, 'user_name'>> {}

  const modify: ModifyDataTypes = {};

  const originUserName: Pick<UserModel, 'user_name'>[] = await query({
    sql: `
    SELECT user_name
    FROM user
    WHERE UID = ?`,
    values: [uid],
  });

  if (user_name && user_name !== originUserName[0].user_name) {
    modify.user_name = user_name;
  }

  if (Object.keys(modify).length !== 0) {
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

export const readUser = authMiddyfy({
  handler: readFunction,
});

export const updateUser = authMiddyfy({
  handler: updateFunction,
  inputSchema: userUpdateSchema,
});
