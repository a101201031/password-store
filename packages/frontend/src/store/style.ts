import { atom } from 'recoil';

export const themeModeAtom = atom<'dark' | 'light'>({
  key: 'themeModeAtom',
  default:
    (localStorage.getItem('password-storage-color-mode') as
      | 'dark'
      | 'light'
      | null) ||
    (window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'),
});
