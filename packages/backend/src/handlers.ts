import { handlerPath } from '@libs/handler-resolver';
import {
  signUpSchema,
  signInSchema,
  groupSchema,
  accountCreateSchema,
  accountUpdateSchema,
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
              'application/json': accountCreateSchema,
            },
          },
        },
      },
    ],
  },
  readAccount: {
    handler: `${handlerPath(__dirname)}/functions/account.readAccount`,
    events: [
      {
        http: {
          method: 'get',
          path: 'account/{aid}',
          request: {
            parameters: {
              paths: {
                aid: true,
              },
            },
          },
        },
      },
    ],
  },
  updateAccount: {
    handler: `${handlerPath(__dirname)}/functions/account.updateAccount`,
    events: [
      {
        http: {
          method: 'put',
          path: 'account',
          request: {
            schemas: {
              'application/json': accountUpdateSchema,
            },
          },
        },
      },
    ],
  },
  readAccountList: {
    handler: `${handlerPath(__dirname)}/functions/accountList.readAccountList`,
    events: [
      {
        http: {
          method: 'get',
          path: 'accounts',
        },
      },
    ],
  },
};
