import { formatJSONResponse } from '@libs/api-gateway';
import { authMiddyfy } from '@libs/lambda';
import type { AccountModel } from '@model/account';
import type { AccountGroupModel } from '@model/accountGroup';
import { firebaseAdmin } from '@util/firebaseAdmin';
import { query } from '@util/mysql';
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const readFunction = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  type QueryReturnTypes = Pick<AccountGroupModel, 'gid' | 'group_name'> &
    Omit<
      AccountModel,
      'password' | 'last_password_changed' | 'created_at' | 'updated_at'
    >;

  const { uid } = await firebaseAdmin
    .auth()
    .verifyIdToken(event.headers.Authorization.split(' ')[1]);

  const accountJoinGroup: QueryReturnTypes[] = await query({
    sql: 'SELECT AG.gid, AG.group_name, A.aid, A.service_name, A.service_account, A.authentication FROM account_group AG INNER JOIN account A ON AG.gid = A.gid AND AG.uid = ? ORDER BY AG.gid',
    values: [uid],
  });

  const groupInAccount = [];

  accountJoinGroup.forEach((val) => {
    const groupIdx = groupInAccount.findIndex((v) => v.gid === val.gid);
    const account = {
      aid: val.aid,
      service_name: val.service_name,
      service_account: val.service_account,
      authentication: val.authentication,
    };
    if (groupIdx === -1) {
      groupInAccount.push({
        gid: val.gid,
        group_name: val.group_name,
        accounts: [account],
      });
    } else {
      groupInAccount[groupIdx].accounts.push(account);
    }
  });

  return formatJSONResponse({ message: 'success', result: groupInAccount });
};

export const readAccountList = authMiddyfy({ handler: readFunction });
