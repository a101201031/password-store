import { signInSchema } from '@apiSchema/signIn';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { authMiddyfy } from '@libs/lambda';
import { defaultLogContent, userActionlogger } from '@util/userActionLogger';
import { Forbidden, InternalServerError } from 'http-errors';

const signInFunction: ValidatedEventAPIGatewayProxyEvent<
  typeof signInSchema.properties.body
> = async (event) => {
  try {
    const {
      email,
      decodedIdToken: { uid, email: emailInToken },
    } = event.body;
    if (email !== emailInToken) throw new Forbidden('Access is denied.');
    const logContent = defaultLogContent.user.signIn.success;

    userActionlogger({ uid, logContent });
    return formatJSONResponse({ message: 'success' });
  } catch (e) {
    throw new InternalServerError();
  }
};

export const signIn = authMiddyfy({
  handler: signInFunction,
  eventSchema: signInSchema,
});
