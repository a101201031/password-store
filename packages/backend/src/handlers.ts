import { handlerPath } from '@libs/handler-resolver';
import {
  signUpSchema,
  signInSchema,
  groupSchema,
  accountSchema,
} from '@apiSchema';

export default {
  signUp: {
    handler: `${handlerPath(__dirname)}/functions/signUp.signUp`,
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
    handler: `${handlerPath(__dirname)}/functions/signIn.signIn`,
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
  createGroup: {
    handler: `${handlerPath(__dirname)}/functions/group.createGroup`,
    events: [
      {
        http: {
          method: 'post',
          path: 'group',
          request: {
            schemas: {
              'application/json': groupSchema,
            },
          },
        },
      },
    ],
  },
  readGroup: {
    handler: `${handlerPath(__dirname)}/functions/group.readGroup`,
    events: [
      {
        http: {
          method: 'get',
          path: 'group',
        },
      },
    ],
  },
  deleteGroup: {
    handler: `${handlerPath(__dirname)}/functions/group.deleteGroup`,
    events: [
      {
        http: {
          method: 'delete',
          path: 'group',
          request: {
            schemas: {
              'application/json': groupSchema,
            },
          },
        },
      },
    ],
  },
  createAccount: {
    handler: `${handlerPath(__dirname)}/functions/account.createAccount`,
    events: [
      {
        http: {
          method: 'post',
          path: 'account',
          request: {
            schemas: {
              'application/json': accountSchema,
            },
          },
        },
      },
    ],
  },
};
