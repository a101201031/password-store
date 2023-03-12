/* eslint-disable camelcase */
import type { AuthorizedAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { authMiddyfy } from '@libs/lambda';
import type { AccountModel } from '@model/account';
import type { AccountGroupModel } from '@model/accountGroup';
import { query } from '@util/mysql';
import type { APIGatewayProxyResult } from 'aws-lambda';
import findIndex from 'lodash/findIndex';

interface AccountListWithGroupTypes
  extends Pick<AccountGroupModel, 'gid' | 'group_name'>,
    Omit<
      AccountModel,
      'password' | 'last_password_changed' | 'created_at' | 'updated_at'
    > {}

const readFunction = async (
  event: AuthorizedAPIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const {
    decodedIdToken: { uid },
  } = event.body;

  const selectAccountWithGroup: AccountListWithGroupTypes[] = await query({
    sql: `
      SELECT 
        AG.gid, 
        AG.group_name, 
        A.aid, 
        A.service_name, 
        A.service_account, 
        A.authentication 
      FROM account_group AG 
      INNER JOIN account A 
        ON AG.gid = A.gid 
          AND AG.uid = ? 
      ORDER BY AG.gid`,
    values: [uid],
  });

  const groupInAccount = [];

  selectAccountWithGroup.forEach((val) => {
    const { aid, gid, service_name, service_account, authentication } = val;
    const groupIdx = findIndex(groupInAccount, { gid });

    const account = {
      aid,
      service_name,
      service_account,
      authentication,
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
