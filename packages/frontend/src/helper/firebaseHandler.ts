import type { FirebaseError } from 'firebase/app';
import isObject from 'lodash/isObject';

function isFirebaseError(err: unknown): err is FirebaseError {
  return !!isObject(err) && 'code' in err;
}

export { isFirebaseError };
