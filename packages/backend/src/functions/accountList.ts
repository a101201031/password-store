import { formatJSONResponse } from '@libs/api-gateway';
import { firebaseAdmin } from '@util/firebaseAdmin';
import { query } from '@util/mysql';
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import type { AccountGroupModel, AccountModel } from '@model';
import { authMiddyfy } from '@libs/lambda';

const readFunction = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  type QueryReturnTypes = Pick<AccountGroupModel, 'gid' | 'group_name'> &
    Omit<
      AccountModel,
      | 'password'
      | 'password_last_change'
      | 'created_at'
      | 'updated_at'
      | 'authentication'
    >;

  const { uid } = await firebaseAdmin
    .auth()
    .verifyIdToken(event.headers.Authorization.split(' ')[1]);

  let result: QueryReturnTypes[] = await query({
    sql: 'SELECT AG.gid, AG.group_name, A.aid, A.service_name, A.service_account FROM account_group AG INNER JOIN account A ON AG.gid = A.gid AND AG.uid = ? ORDER BY AG.gid',
    values: [uid],
  });

  const groupInAccount = [];

  result.forEach((val) => {
    const groupIdx = groupInAccount.findIndex((v) => v.gid === val.gid);
    if (groupIdx === -1) {
      groupInAccount.push({
        gid: val.gid,
        groupName: val.group_name,
        accounts: [
          {
            aid: val.aid,
            serviceName: val.service_name,
            serviceAccount: val.service_account,
          },
        ],
      });
    } else {
      groupInAccount[groupIdx].accounts.push({
        aid: val.aid,
        serviceName: val.service_name,
        serviceAccount: val.service_account,
      });
    }
  });

  return formatJSONResponse({ message: 'success', result: groupInAccount });
};

export const readAccountList = authMiddyfy({ handler: readFunction });
