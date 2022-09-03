import { fetcher } from 'helper';
import type { AccountModel } from 'model';
import { selectorFamily } from 'recoil';
import type { SelectorMapper } from 'store';
import { accessTokenAtom, selectorTrigger } from 'store';

interface PasswordParam extends Pick<AccountModel, 'aid'> {}

interface passwordSltrTypes
  extends Pick<AccountModel, 'password' | 'authentication'> {}

interface PasswordApiTypes {
  message: string;
  result: passwordSltrTypes;
}

export const passwordSltr = selectorFamily<
  passwordSltrTypes,
  SelectorMapper<PasswordParam>
>({
  key: 'passwordSltr',
  get:
    ({ aid }) =>
    async ({ get }) => {
      get(selectorTrigger('passwordSltr'));
      const { result } = await fetcher.get<PasswordApiTypes>({
        path: `/password/${aid}`,
        accessToken: get(accessTokenAtom),
      });
      return result;
    },
  set:
    () =>
    ({ set }) => {
      set(selectorTrigger('passwordSltr'), (count) => (count += 1));
    },
});
