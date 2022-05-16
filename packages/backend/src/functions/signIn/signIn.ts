import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import '@util/firebase';
import {
  browserSessionPersistence,
  getAuth,
  setPersistence,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { BadGateway } from 'http-errors';
import schema from './schema';

const signInFunction: ValidatedEventAPIGatewayProxyEvent<typeof schema> =
  async (event) => {
    const { email, password } = event.body;
    const auth = getAuth();
    try {
      console.log(browserSessionPersistence);
      await setPersistence(auth, browserSessionPersistence);
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      return formatJSONResponse({ token: await user.getIdToken() });
    } catch (e) {
      throw new BadGateway('Authorized error');
    }
  };

export const signIn = middyfy(signInFunction);
