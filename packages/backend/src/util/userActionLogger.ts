import { transaction } from '@util/mysql';
import type { UserActionLogModel } from '@model';

interface ContentTypes {
  actionTarget: string;
  action: string;
  actionResult: string;
  message: string;
}

interface LoggerParamsTypes extends Pick<UserActionLogModel, 'uid'> {
  content: ContentTypes;
}

interface LoggerTypes {
  ({ uid, content }: LoggerParamsTypes): Promise<void>;
}

interface LoggerContentTypes {
  [key: string]: {
    [key: string]: {
      success?: ContentTypes;
      fail?: ContentTypes;
    };
  };
}

const loggerContent: LoggerContentTypes = {
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
  },
};

export const userActionlogger: LoggerTypes = async ({ uid, content }) => {
  await transaction()
    .query({
      sql: `
      INSERT INTO user_action_log
        (uid, content)
      VALUES
        (?, ?)
      `,
      values: [uid, JSON.stringify(content)],
    })
    .commit();
};
