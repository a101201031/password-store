import { handlerPath } from '@libs/handler-resolver';
import signInSchema from '@functions/signIn/schema';
import signUpSchema from '@functions/signUp/schema';

export default {
  signUp: {
    handler: `${handlerPath(__dirname)}/functions/signUp/signUp.signUp`,
    events: [
      {
        http: {
          method: 'post',
          path: 'sign-up',
          request: {
            schemas: {
              'application/json': signUpSchema,
            },
          },
        },
      },
    ],
  },
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
