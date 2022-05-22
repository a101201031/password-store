import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import '@util/firebase';
import type { FirebaseError } from 'firebase/app';
import {
  browserSessionPersistence,
  getAuth,
  setPersistence,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { Unauthorized } from 'http-errors';
import schema from './schema';

const signInFunction: ValidatedEventAPIGatewayProxyEvent<typeof schema> =
  async (event) => {
    const { email, password } = event.body;
    const auth = getAuth();
    try {
      await setPersistence(auth, browserSessionPersistence);
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      return formatJSONResponse({ token: await user.getIdToken() });
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

export const signIn = middyfy(signInFunction);
