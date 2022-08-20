import { atom, selector, selectorFamily } from 'recoil';
import { fetcher } from 'helper';
import { AccountModel, AccountGroupModel } from 'model';
import { accessTokenAtom } from './token';
import { SelectorMapper, selectorTrigger } from 'store';
import { concat } from 'lodash';

export interface AccountListTypes
  extends Pick<AccountGroupModel, 'gid' | 'group_name'> {
  accounts: Pick<
    AccountModel,
    'aid' | 'service_name' | 'service_account' | 'authentication'
  >[];
}

interface AccountListApiTypes {
  message: string;
  result: AccountListTypes[];
}

export const accountListSltr = selector<AccountListTypes[]>({
  key: 'accountListSltr',
  get: async ({ get }) => {
    get(selectorTrigger('accountList'));
    const { result } = await fetcher.get<AccountListApiTypes>({
      path: '/accounts',
      accessToken: get(accessTokenAtom),
    });
    return result;
  },
  set: ({ set }) => {
    set(selectorTrigger('accountList'), (count) => count + 1);
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
      get(selectorTrigger('accountInfo'));
      const { result } = await fetcher.get<AccountInfoApiTypes>({
        path: `/account/${aid}`,
        accessToken: get(accessTokenAtom),
      });
      return result;
    },
  set:
    ({ aid }) =>
    ({ set }) => {
      set(selectorTrigger('accountInfo'), (count) => count + 1);
    },
});

interface OAuthListTypes
  extends Pick<AccountModel, 'aid' | 'service_name' | 'service_account'>,
    Pick<AccountGroupModel, 'group_name'> {}

export const accountOAuthListSltr = selector<OAuthListTypes[]>({
  key: 'accountOAuthListSltr',
  get: ({ get }) => {
    const accountList = get(accountListSltr);
    const oAuthList: OAuthListTypes[] = [
      {
        group_name: 'Unset',
        aid: 'standalone',
        service_name: 'Not used',
        service_account: '',
      },
    ];
    accountList.forEach((group) => {
      group.accounts.forEach((account) => {
        if (account.authentication === 'standalone') {
          oAuthList.push({
            ...account,
            group_name: group.group_name,
          });
        }
      });
    });
    return oAuthList;
  },
});

export interface AccountListByGroupTypes
  extends Pick<
    AccountModel,
    'service_name' | 'service_account' | 'authentication'
  > {}

interface AccountListByGroupParam extends Pick<AccountGroupModel, 'gid'> {}

export const accountListByGroupSltr = selectorFamily<
  AccountListByGroupTypes[],
  SelectorMapper<AccountListByGroupParam>
>({
  key: 'accountListByGroupSltr',
  get:
    ({ gid }) =>
    ({ get }) => {
      return get(accountListSltr)
        .filter((v) => v.gid === gid)[0]
        .accounts.map((v) => {
          const oAuthBase = get(oAuthBaseListSltr).find(
            (oAuthV) => oAuthV.aid === v.authentication,
          );
          return {
            service_name: v.service_name,
            service_account: v.service_account,
            authentication: oAuthBase
              ? `${oAuthBase.service_name} - ${oAuthBase.service_account}`
              : v.authentication,
          };
        });
    },
});

interface OAuthBaseListTypes
  extends Pick<AccountModel, 'aid' | 'service_name' | 'service_account'> {}

export const oAuthBaseListSltr = selector<OAuthBaseListTypes[]>({
  key: 'oAuthBaseListSltr',
  get: ({ get }) => {
    return concat(
      ...get(accountListSltr).map((group) =>
        group.accounts
          .filter((account) => account.authentication === 'standalone')
          .map((account) => ({
            aid: account.aid,
            service_name: account.service_name,
            service_account: account.service_account,
          })),
      ),
    );
  },
});
