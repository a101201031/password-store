import { handlerPath } from '@libs/handler-resolver';
import signInSchema from '@functions/signIn/schema';

export default {
  signIn: {
    handler: `${handlerPath(__dirname)}/functions/signIn/signIn.signIn`,
    events: [
      {
        http: {
          method: 'post',
          path: 'sign-in',
          request: {
            schemas: {
              'application/json': signInSchema,
            },
          },
        },
      },
    ],
  },
};
