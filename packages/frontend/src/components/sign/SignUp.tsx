import { yupResolver } from '@hookform/resolvers/yup';
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  CssBaseline,
  FormControlLabel,
  Grid,
  Link as MuiLink,
  TextField,
  Typography,
} from '@mui/material';
import type { AxiosError } from 'axios';
import type { FirebaseError } from 'firebase/app';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { fetcher, isAxiosError, isFirebaseError } from 'helper';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import type { Location } from 'react-router-dom';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { accessTokenAtom } from 'store';
import { signUpSchema } from 'validation';

type CustomLocationTypes = Omit<Location, 'state'> & {
  state?: { from?: { pathname: string } };
};

interface SignUpFormTypes {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  infoAgreement: boolean;
}

function SignUp() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignUpFormTypes>({
    resolver: yupResolver(signUpSchema),
  });
  let navigate = useNavigate();
  let location = useLocation() as CustomLocationTypes;
  const from = location.state?.from?.pathname || '/';

  const setToken = useSetRecoilState(accessTokenAtom);

  const onSubmit: SubmitHandler<SignUpFormTypes> = async (data) => {
    const { name, email, password } = data;
    try {
      const auth = getAuth();
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const accessToken = await user.getIdToken();

      await fetcher.post({
        path: '/sign-up',
        bodyParams: { name, email, password },
        accessToken,
      });
      setToken(accessToken);
      navigate(from);
    } catch (e) {
      const err = e as Error | AxiosError<string> | FirebaseError;
      if (isFirebaseError(err) && err.code === 'auth/email-already-in-use') {
        setError('email', { type: 'custom', message: 'Email already in use.' });
      } else if (isAxiosError<string>(err)) {
        const errMsg = err.response?.data || 'server error.';
        setError('email', { type: 'custom', message: errMsg });
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <Typography>PS</Typography>
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          sx={{ mt: 3 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                name="name"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    required
                    fullWidth
                    id="name"
                    label="Name"
                    autoComplete="name"
                    autoFocus
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    {...field}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="email"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    autoComplete="email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    {...field}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="password"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    required
                    fullWidth
                    id="password"
                    label="Password"
                    type="password"
                    autoComplete="new-password"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    {...field}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="confirmPassword"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    required
                    fullWidth
                    id="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    autoComplete="new-password"
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                    {...field}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Controller
                    name="infoAgreement"
                    control={control}
                    defaultValue={false}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Checkbox color="primary" {...field} />
                    )}
                  />
                }
                label={
                  <Typography
                    color={errors.infoAgreement ? 'error' : 'defalut'}
                  >
                    I want to receive inspiration, marketing promotions and
                    updates via email.
                  </Typography>
                }
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <MuiLink component={Link} to="/" variant="body2">
                Already have an account? Sign in
              </MuiLink>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export { SignUp };
