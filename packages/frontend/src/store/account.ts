import { atom, selector, selectorFamily } from 'recoil';
import { fetcher } from 'helper';
import { AccountModel, AccountGroupModel } from 'model';
import { accessTokenAtom } from './token';
import { SelectorMapper } from 'store';

interface AccountListTypes
  extends Pick<AccountGroupModel, 'gid' | 'group_name'> {
  accounts: Pick<AccountModel, 'aid' | 'service_name' | 'service_account'>[];
}

interface AccountListApiTypes {
  message: string;
  result: AccountListTypes[];
}

export const accountListSltr = selector<AccountListTypes[]>({
  key: 'accountListSltr',
  get: async ({ get }) => {
    try {
      const { result } = await fetcher.get<AccountListApiTypes>({
        path: '/accounts',
        accessToken: get(accessTokenAtom),
      });
      return result;
    } catch (e) {
      throw e;
    }
  },
});

export const accountListFilterAtom = atom({
  key: 'accountListFilterAtom',
  default: '',
});

export const filteredAccountListSltr = selector({
  key: 'filteredAccountListSltr',
  get: ({ get }) => {
    const accountList = get(accountListSltr);
    const filterValue = get(accountListFilterAtom);
    if (!filterValue) return accountList;

    const filteredList: AccountListTypes[] = [];

    accountList.forEach((v) => {
      const accounts = v.accounts.filter(
        (v) =>
          v.service_name.includes(filterValue) ||
          v.service_account.includes(filterValue),
      );
      if (accounts[0]) {
        filteredList.push({
          gid: v.gid,
          group_name: v.group_name,
          accounts,
        });
      }
    });

    return filteredList;
  },
});

interface AccountInfoParam {
  aid: string;
}

interface AccountInfoTypes extends Omit<AccountModel, 'password'> {}

interface AccountInfoApiTypes {
  message: string;
  result: AccountInfoTypes;
}

export const accountInfoSltr = selectorFamily<
  Omit<AccountModel, 'password'>,
  SelectorMapper<AccountInfoParam>
>({
  key: 'accountInfoSltr',
  get:
    ({ aid }) =>
    async ({ get }) => {
      const { result } = await fetcher.get<AccountInfoApiTypes>({
        path: `/account/${aid}`,
        accessToken: get(accessTokenAtom),
      });
      return result;
    },
});
