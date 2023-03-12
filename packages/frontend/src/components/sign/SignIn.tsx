import CloseIcon from '@mui/icons-material/Close';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Collapse,
  CssBaseline,
  Grid,
  IconButton,
  Link as MuiLink,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import type { AxiosError } from 'axios';
import { FirebaseError } from 'firebase/app';
import {
  browserSessionPersistence,
  getAuth,
  setPersistence,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { fetcher, isAxiosError, isFirebaseError } from 'helper';
import { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import type { Location } from 'react-router-dom';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { accessTokenAtom, firebaseUserAtom } from 'store';

type CustomLocationTypes = Omit<Location, 'state'> & {
  state?: { from?: { pathname: string } };
};

interface SignInFormTypes {
  email: string;
  password: string;
}
interface AlertStateTypes {
  open: boolean;
  message?: string;
}

function SignIn() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    resetField,
  } = useForm<SignInFormTypes>();
  const [alertState, setAlertState] = useState<AlertStateTypes>({
    open: false,
  });
  const navigate = useNavigate();
  const location = useLocation() as CustomLocationTypes;
  const from = location.state?.from?.pathname || '/';

  const setFirebaseUser = useSetRecoilState(firebaseUserAtom);
  const setAccessToken = useSetRecoilState(accessTokenAtom);

  const onSubmit: SubmitHandler<SignInFormTypes> = async (data) => {
    const { email, password } = data;
    try {
      const auth = getAuth();
      await setPersistence(auth, browserSessionPersistence);

      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const accessToken = await user.getIdToken();
      await fetcher.post({
        path: '/sign-in',
        bodyParams: { email },
        accessToken,
      });
      setAccessToken(accessToken);
      setFirebaseUser(user);
      navigate(from);
    } catch (e) {
      const err = e as Error | AxiosError<string> | FirebaseError;
      if (
        isFirebaseError(err) &&
        (err.code === 'auth/wrong-password' ||
          err.code === 'auth/user-not-found')
      ) {
        setAlertState({ open: true, message: 'Incorrect email or password.' });
      } else if (isAxiosError<string>(err)) {
        const alertMsg = err.response?.data || 'server error.';
        setAlertState({ open: true, message: alertMsg });
      }
      resetField('password');
    }
  };

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: 'url(https://source.unsplash.com/random)',
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) =>
            t.palette.mode === 'light'
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <Typography>PS</Typography>
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Collapse in={alertState.open}>
            <Alert
              action={
                <IconButton
                  aria-label="close"
                  size="small"
                  onClick={() => {
                    setAlertState({ open: false });
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
              sx={{ mb: 2 }}
              severity="error"
            >
              {alertState.message}
            </Alert>
          </Collapse>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            sx={{ mt: 1 }}
          >
            <Controller
              name="email"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...register('email', { required: true })}
                  {...field}
                  margin="normal"
                  fullWidth
                  id="email"
                  label="Email Address"
                  autoComplete="email"
                  autoFocus
                  error={!!errors.email}
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...register('password', { required: true })}
                  {...field}
                  margin="normal"
                  fullWidth
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  error={!!errors.password}
                />
              )}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                <MuiLink component={Link} to="/sign-up" variant="body2">
                  {"Don't have an account? Sign Up"}
                </MuiLink>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}

export { SignIn };
