import axios from 'axios';
import type { AxiosError } from 'axios';

function isUnauthorizedError(err: Error | AxiosError | unknown) {
  return axios.isAxiosError(err) && err.response?.status === 401;
}

export { isUnauthorizedError };
