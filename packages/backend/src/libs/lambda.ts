import middy from '@middy/core';
import middyValidator from '@middy/validator';
import middyJsonBodyParser from '@middy/http-json-body-parser';
import middyErrorHandler from '@middy/http-error-handler';
import { authorizer } from '@middleware';

interface MiddfyParams {
  handler: any;
  inputSchema?: object;
}

export const middyfy = ({ handler, inputSchema }: MiddfyParams) => {
  if (inputSchema) {
    return middy(handler)
      .use(middyJsonBodyParser())
      .use(middyValidator({ inputSchema }))
      .use(middyErrorHandler());
  }
  return middy(handler).use(middyJsonBodyParser()).use(middyErrorHandler());
};

export const authMiddyfy = ({ handler, inputSchema }: MiddfyParams) => {
  if (inputSchema) {
    return middy(handler)
      .use(authorizer())
      .use(middyJsonBodyParser())
      .use(middyValidator({ inputSchema }))
      .use(middyErrorHandler());
  }
  return middy(handler)
    .use(authorizer())
    .use(middyJsonBodyParser())
    .use(middyErrorHandler());
};
