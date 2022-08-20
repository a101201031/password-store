import { atom } from 'recoil';

interface SnackbarTypes {
  open: boolean;
  level?: 'error' | 'warning' | 'success' | 'info';
  message?: string;
}

export const snackbarAtom = atom<SnackbarTypes>({
  key: 'snackbarAtom',
  default: {
    open: false,
    level: 'info',
  },
});
