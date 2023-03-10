import { transaction } from '@util/mysql';
import type { UserActionLogModel } from '@model/userActionLog';

interface logContentTypes {
  actionTarget: string;
  action: string;
  actionResult: string;
  message: string;
}

interface LoggerParamsTypes extends Pick<UserActionLogModel, 'uid'> {
  logContent: logContentTypes;
}

export const defaultLogContent = {
  user: {
    signIn: {
      success: {
        actionTarget: 'user',
        action: 'sign in',
        actionResult: 'success',
        message: 'you have successfully signed in.',
      },
      fail: {
        actionTarget: 'user',
        action: 'sign in',
        actionResult: 'fail',
        message: 'you failed to sign in.',
      },
    },
    signUp: {
      success: {
        actionTarget: 'user',
        action: 'sign up',
        actionResult: 'success',
        message: 'you have successfully signed up.',
      },
    },
    changePassword: {
      success: {
        actionTarget: 'user',
        action: 'change password',
        actionResult: 'success',
        message: 'you have successfully changed password.',
      },
    },
  },
  account: {
    showPassword: {
      success: {
        actionTarget: 'account',
        action: 'show password',
        actionResult: 'success',
        message: '',
      },
    },
  },
};

export const userActionlogger = async ({
  uid,
  logContent,
}: LoggerParamsTypes): Promise<void> => {
  await transaction()
    .query({
      sql: `
      INSERT INTO user_action_log
        (uid, content)
      VALUES
        (?, ?)
      `,
      values: [uid, JSON.stringify(logContent)],
    })
    .commit();
};
