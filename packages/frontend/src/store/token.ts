import { fetcher } from 'helper';
import { atom, selector } from 'recoil';

export const accessTokenAtom = atom({
  key: 'accessTokenAtom',
  default: localStorage.getItem('accessToken'),
});

export const onSignInSltr = selector({
  key: 'onSignInSltr',
  get: async () => {
    try {
      await fetcher.get({ path: '/token' });
    } catch (e) {
      return false;
    }
    return true;
  },
});
