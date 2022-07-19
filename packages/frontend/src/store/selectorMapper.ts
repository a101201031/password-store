export type SelectorMapper<T> = {
  [P in keyof T]: T[P];
};
