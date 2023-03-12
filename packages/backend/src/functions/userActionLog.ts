import type { AuthorizedAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { authMiddyfy } from '@libs/lambda';
import type { UserActionLogModel } from '@model/userActionLog';
import { query } from '@util/mysql';
import type { APIGatewayProxyResult } from 'aws-lambda';

const readFunction = async (
  event: AuthorizedAPIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const {
    decodedIdToken: { uid },
  } = event.body;
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
