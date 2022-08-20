import { atomFamily } from 'recoil';

export type SelectorMapper<T> = {
  [P in keyof T]: T[P];
};

export const selectorTrigger = atomFamily({
  key: 'selectorTrigger',
  default: 0,
});
