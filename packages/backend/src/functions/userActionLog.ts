import { formatJSONResponse } from '@libs/api-gateway';
import { authMiddyfy } from '@libs/lambda';
import type { UserActionLogModel } from '@model/userActionLog';
import '@util/firebase';
import { firebaseAdmin } from '@util/firebaseAdmin';
import { query } from '@util/mysql';
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const readFunction = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const { uid } = await firebaseAdmin
    .auth()
    .verifyIdToken(event.headers.Authorization.split(' ')[1]);
  const userInfo: Pick<UserActionLogModel, 'content' | 'created_at'> =
    await query({
      sql: `
      SELECT 
        created_at, content
      FROM user_action_log
      WHERE uid = ?`,
      values: [uid],
    });
  return formatJSONResponse({ message: 'success', result: userInfo });
};

export const readUserActionLog = authMiddyfy({
  handler: readFunction,
});
