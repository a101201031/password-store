import { SignInInputTypes } from 'model';
import { fetcher } from 'helper';
import type { AxiosError } from 'axios';
import axios from 'axios';

type SignInResTypes = {
  token?: string;
  message: string;
};

async function signInUser({
  email,
  password,
}: SignInInputTypes): Promise<SignInResTypes> {
  const data = { email, password };
  try {
    const { token } = await fetcher.post<{ token: string }>({
      path: '/sign-in',
      bodyParams: data,
    });
    return { token, message: 'success' };
  } catch (e) {
    const err = e as Error | AxiosError;
    if (axios.isAxiosError(err) && err.response) {
      return { message: err.response.data as string };
    }
    return { message: 'Unknown error' };
  }
}

export { signInUser };
