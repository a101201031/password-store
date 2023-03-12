import { fetcher } from 'helper';
import type { UserModel } from 'model';
import { selector } from 'recoil';
import { accessTokenAtom } from './auth';
import { selectorTrigger } from './selectorControl';

interface UserInfoTypes
  extends Pick<
    UserModel,
    | 'email'
    | 'user_name'
    | 'last_password_changed'
    | 'two_fact_auth_type'
    | 'created_at'
  > {}

interface UserInfoApiTypes {
  message: string;
  result: UserInfoTypes[];
}

export const userInfoSltr = selector<UserInfoTypes>({
  key: 'userInfoSltr',
  get: async ({ get }) => {
    get(selectorTrigger('userInfo'));
    const { result } = await fetcher.get<UserInfoApiTypes>({
      path: '/user',
      accessToken: get(accessTokenAtom),
    });
    return result[0];
  },
  set: ({ set }) => {
    set(selectorTrigger('userInfo'), (count) => count + 1);
  },
});
