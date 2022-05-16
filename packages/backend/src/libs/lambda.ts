import middy from '@middy/core';
import middyJsonBodyParser from '@middy/http-json-body-parser';
import middyErrorHandler from '@middy/http-error-handler';
import { authorizer } from '@middleware/authorizer';

export const middyfy = (handler) => {
  return middy(handler).use(middyJsonBodyParser()).use(middyErrorHandler());
};

export const authMiddyfy = (handler) => {
  return middy(handler)
    .use(authorizer())
    .use(middyJsonBodyParser())
    .use(middyErrorHandler());
};
