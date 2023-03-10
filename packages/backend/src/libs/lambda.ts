import middy from '@middy/core';
import middyValidator from '@middy/validator';
import { transpileSchema } from '@middy/validator/transpile';
import middyJsonBodyParser from '@middy/http-json-body-parser';
import middyErrorHandler from '@middy/http-error-handler';
import { authorizer } from '@middleware/authorizer';
import middyCors from '@middy/http-cors';

interface MiddfyParams {
  handler: any;
  eventSchema?: object;
}

export const middyfy = ({ handler, eventSchema }: MiddfyParams) => {
  if (eventSchema) {
    return middy(handler)
      .use(
        middyCors({
          origins: [`https://${process.env.FRONTEND_DOMAIN_NAME}`],
        }),
      )
      .use(middyJsonBodyParser())
      .use(middyErrorHandler())
      .use(middyValidator({ eventSchema: transpileSchema(eventSchema) }));
  }
  return middy(handler)
    .use(
      middyCors({
        origins: [`https://${process.env.FRONTEND_DOMAIN_NAME}`],
      }),
    )
    .use(middyJsonBodyParser())
    .use(middyErrorHandler());
};

export const authMiddyfy = ({ handler, eventSchema }: MiddfyParams) => {
  if (eventSchema) {
    return middy(handler)
      .use(
        middyCors({
          origins: [`https://${process.env.FRONTEND_DOMAIN_NAME}`],
        }),
      )
      .use(middyJsonBodyParser())
      .use(middyErrorHandler())
      .use(middyValidator({ eventSchema: transpileSchema(eventSchema) }))
      .use(authorizer());
  }
  return middy(handler)
    .use(
      middyCors({
        origins: [`https://${process.env.FRONTEND_DOMAIN_NAME}`],
      }),
    )
    .use(middyJsonBodyParser())
    .use(middyErrorHandler())
    .use(authorizer());
};
