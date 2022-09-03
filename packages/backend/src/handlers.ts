import {
  accountCreateSchema,
  accountDeleteSchema,
  accountReadSchema,
  accountUpdateSchema,
  groupCreateSchema,
  groupDeleteSchema,
  groupUpdateSchema,
  signInSchema,
  signUpSchema,
  userUpdateSchema,
} from '@apiSchema';
import { handlerPath } from '@libs/handler-resolver';

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
              'application/json': groupCreateSchema,
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
  updateGroup: {
    handler: `${handlerPath(__dirname)}/functions/group.updateGroup`,
    events: [
      {
        http: {
          method: 'put',
          path: 'group',
          request: {
            schemas: {
              'application/json': groupUpdateSchema,
            },
          },
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
          path: 'group/{gid}',
          request: {
            schemas: {
              'application/json': groupDeleteSchema,
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
            schemas: {
              'application/json': accountReadSchema,
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
  deleteAccount: {
    handler: `${handlerPath(__dirname)}/functions/account.deleteAccount`,
    events: [
      {
        http: {
          method: 'delete',
          path: 'account/{aid}',
          request: {
            schemas: {
              'application/json': accountDeleteSchema,
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
  readUser: {
    handler: `${handlerPath(__dirname)}/functions/user.readUser`,
    events: [
      {
        http: {
          method: 'get',
          path: 'user',
        },
      },
    ],
  },
  updateUser: {
    handler: `${handlerPath(__dirname)}/functions/user.updateUser`,
    events: [
      {
        http: {
          method: 'post',
          path: 'user',
          request: {
            schemas: {
              'application/json': userUpdateSchema,
            },
          },
        },
      },
    ],
  },
  readPassword: {
    handler: `${handlerPath(__dirname)}/functions/password.readPassword`,
    events: [
      {
        http: {
          method: 'get',
          path: 'password/{aid}',
          request: {
            schemas: {
              'application/json': accountReadSchema,
            },
          },
        },
      },
    ],
  },
  tokenValidator: {
    handler: `${handlerPath(__dirname)}/functions/token.validator`,
    events: [
      {
        http: {
          method: 'get',
          path: 'token',
        },
      },
    ],
  },
};
