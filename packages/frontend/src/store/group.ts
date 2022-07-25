import { dateToString, fetcher } from 'helper';
import { AccountGroupModel } from 'model';
import { selector, selectorFamily } from 'recoil';
import { SelectorMapper } from 'store';
import { accessTokenAtom } from './token';

interface GroupListTypes
  extends Pick<AccountGroupModel, 'gid' | 'group_name' | 'created_at'> {
  accounts: number;
}

interface GroupListApiTypes {
  groups: GroupListTypes[];
  message: string;
}

export const groupListSltr = selector<GroupListTypes[]>({
  key: 'groupListSltr',
  get: async ({ get }) => {
    const { groups } = await fetcher.get<GroupListApiTypes>({
      path: '/group',
      accessToken: get(accessTokenAtom),
    });
    return groups;
  },
});

export interface GroupTableRowTypes
  extends Omit<GroupListTypes, 'gid' | 'created_at'> {
  created_at: string;
}

export const groupTableRowSltr = selector<GroupTableRowTypes[]>({
  key: 'groupTableRowSltr',
  get: ({ get }) => {
    return get(groupListSltr).map((v) => ({
      group_name: v.group_name,
      accounts: v.accounts,
      created_at: dateToString(v.created_at),
    }));
  },
});

interface GroupInfoParam {
  gid: string;
}

export const groupInfoSltr = selectorFamily<
  Pick<AccountGroupModel, 'gid' | 'group_name'>,
  SelectorMapper<GroupInfoParam>
>({
  key: 'groupNameSltr',
  get:
    ({ gid }) =>
    ({ get }) => {
      const groupList = get(groupListSltr);
      return groupList.filter((v) => v.gid === gid)[0];
    },
});
