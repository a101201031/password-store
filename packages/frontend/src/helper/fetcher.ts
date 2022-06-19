import axios from 'axios';
import { chain } from 'lodash';
import { ENV } from 'constants/ENV';

const axiosClient = axios.create({
  baseURL: ENV.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

interface PostPutPayload {
  path: string;
  queryParams?: { [key: string]: string };
  bodyParams?: { [key: string]: any };
  accessToken?: string;
}
interface GetDeletePayload {
  path: string;
  queryParams?: { [key: string]: string };
  accessToken?: string;
}

const planeFetcher = axiosClient;

const queryParamsParser = (queryParams: { [key: string]: string } = {}) =>
  chain(queryParams)
    .toPairs()
    .reduce((urlSearchParams, keyValuePair) => {
      urlSearchParams.set(keyValuePair[0], keyValuePair[1]);
      return urlSearchParams;
    }, new URLSearchParams())
    .value()
    .toString();

const get = async <T = any>({
  path,
  queryParams = {},
  accessToken,
}: GetDeletePayload) => {
  const queryString = queryParamsParser(queryParams);
  const { data } = await axiosClient.get<T>(`${path}${queryString}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return data;
};

const post = async <T = any>({
  path,
  queryParams = {},
  bodyParams = {},
  accessToken,
}: PostPutPayload) => {
  const queryString = queryParamsParser(queryParams);
  const { data } = await axiosClient.post<T>(
    `${path}${queryString}`,
    bodyParams,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  return data;
};

const put = async <T = any>({
  path,
  queryParams = {},
  bodyParams = {},
  accessToken,
}: PostPutPayload) => {
  const queryString = queryParamsParser(queryParams);
  const { data } = await axiosClient.post<T>(
    `${path}${queryString}`,
    bodyParams,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  return data;
};

const del = async <T = any>({
  path,
  queryParams = {},
  accessToken,
}: GetDeletePayload) => {
  const queryString = queryParamsParser(queryParams);
  const { data } = await axiosClient.delete<T>(`${path}${queryString}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return data;
};

export const fetcher = { get, post, put, del };
export { planeFetcher };
