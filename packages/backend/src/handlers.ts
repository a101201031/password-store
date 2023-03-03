import {
  accountCreateSchema,
  accountUpdateSchema,
  groupCreateSchema,
  groupUpdateSchema,
  signUpSchema,
  userDeleteSchema,
  userPasswordUpdateSchema,
  userUpdateSchema,
} from '@apiSchema';
import { handlerPath } from '@libs/handler-resolver';

export default {
  hello: {
    handler: `${handlerPath(__dirname)}/functions/hello.hello`,
    events: [
      {
        http: {
          method: 'get',
          path: 'hello',
          cors: true,
        },
      },
    ],
  },
  signUp: {
    handler: `${handlerPath(__dirname)}/functions/signUp.signUp`,
    events: [
      {
        http: {
          method: 'post',
          path: 'sign-up',
          cors: true,
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
          cors: true,
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
          cors: true,
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
          cors: true,
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
          cors: true,
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
          cors: true,
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
          cors: true,
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
          cors: true,
        },
      },
    ],
  },
  updateAccount: {
    handler: `${handlerPath(__dirname)}/functions/account.updateAccount`,
    events: [
      {
        http: {
          method: 'post',
          path: 'account/update',
          cors: true,
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
          cors: true,
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
          cors: true,
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
          cors: true,
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
          path: 'user/update',
          cors: true,
          request: {
            schemas: {
              'application/json': userUpdateSchema,
            },
          },
        },
      },
    ],
  },
  deleteUser: {
    handler: `${handlerPath(__dirname)}/functions/user.deleteUser`,
    events: [
      {
        http: {
          method: 'post',
          path: 'user/delete',
          cors: true,
          request: {
            schemas: {
              'application/json': userDeleteSchema,
            },
          },
        },
      },
    ],
  },
  updateUserPassword: {
    handler: `${handlerPath(__dirname)}/functions/user.updateUserPassword`,
    events: [
      {
        http: {
          method: 'post',
          path: 'user/password',
          cors: true,
          request: {
            schemas: {
              'application/json': userPasswordUpdateSchema,
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
          cors: true,
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
          cors: true,
        },
      },
    ],
  },
};
