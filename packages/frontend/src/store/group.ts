import { selector, selectorFamily } from 'recoil';
import { AccountGroupModel } from 'model';
import { fetcher } from 'helper';
import { accessTokenAtom } from './token';
import { SelectorMapper } from 'store';

interface groupListTypes
  extends Pick<AccountGroupModel, 'gid' | 'group_name'> {}

interface groupListApiTypes {
  groups: groupListTypes[];
  message: string;
}

export const groupListSltr = selector<groupListTypes[]>({
  key: 'groupListSltr',
  get: async ({ get }) => {
    const { groups } = await fetcher.get<groupListApiTypes>({
      path: '/group',
      accessToken: get(accessTokenAtom),
    });
    return groups;
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
