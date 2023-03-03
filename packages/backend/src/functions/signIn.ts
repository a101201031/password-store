import '@util/firebase';

import { signInSchema } from '@apiSchema';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import type { FirebaseError } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { Unauthorized } from 'http-errors';

const signInFunction: ValidatedEventAPIGatewayProxyEvent<
  typeof signInSchema.properties.body
> = async (event) => {
  const { email, password } = event.body;
  const auth = getAuth();

  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    const token = await user.getIdToken();

    return formatJSONResponse({ token });
  } catch (e) {
    const err = e as FirebaseError;
    if (
      err.code === 'auth/wrong-password' ||
      err.code === 'auth/user-not-found'
    ) {
      throw new Unauthorized('Incorrect email or password.');
    }
  }
};

export const signIn = middyfy({
  handler: signInFunction,
  inputSchema: signInSchema,
});
