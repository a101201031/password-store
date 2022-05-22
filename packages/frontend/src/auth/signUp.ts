import type { AxiosError } from 'axios';
import axios from 'axios';
import { fetcher } from 'helper';
import { SignUpInputTypes } from 'model';

type CreateUserTypes = Pick<SignUpInputTypes, 'name' | 'email' | 'password'>;
type SignUpResTypes = {
  token?: string;
  message: string;
};

async function signUpUser({
  name,
  email,
  password,
}: CreateUserTypes): Promise<SignUpResTypes> {
  const data = { name, email, password };
  try {
    const { token } = await fetcher.post<{ token: string }>({
      path: '/sign-up',
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

export { signUpUser };
