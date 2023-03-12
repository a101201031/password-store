import type { AxiosError } from 'axios';
import isObject from 'lodash/isObject';

function isUnauthorizedError(err: Error | AxiosError | unknown) {
  return isAxiosError(err) && err.response?.status === 401;
}

function isAxiosError<T extends unknown>(err: unknown): err is AxiosError<T> {
  return !!isObject(err) && 'isAxiosError' in err && err.isAxiosError === true;
}

export { isUnauthorizedError, isAxiosError };
