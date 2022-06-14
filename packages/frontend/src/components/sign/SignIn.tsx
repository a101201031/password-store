import CloseIcon from '@mui/icons-material/Close';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Checkbox,
  Collapse,
  CssBaseline,
  FormControlLabel,
  Grid,
  IconButton,
  Link,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import type { AxiosError } from 'axios';
import axios from 'axios';
import { fetcher } from 'helper';
import { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import type { Location } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { accessTokenAtom } from 'store';

type CustomLocationTypes = Omit<Location, 'state'> & {
  state?: { from?: { pathname: string } };
};

interface SignInFormTypes {
  email: string;
  password: string;
}
interface AlertStateType {
  open: boolean;
  message?: string;
}

function SignIn() {
  const { control, handleSubmit, resetField } = useForm<SignInFormTypes>();
  const [alertState, setAlertState] = useState<AlertStateType>({
    open: false,
  });
  let navigate = useNavigate();
  let location = useLocation() as CustomLocationTypes;
  const from = location.state?.from?.pathname || '/';

  const [token, setToken] = useRecoilState(accessTokenAtom);

  const onSubmit: SubmitHandler<SignInFormTypes> = async (data) => {
    const { email, password } = data;
    try {
      const { token } = await fetcher.post<{ token: string }>({
        path: '/sign-in',
        bodyParams: { email, password },
      });
      localStorage.setItem('accessToken', token);
      setToken(token);
      navigate(from);
    } catch (e) {
      const err = e as Error | AxiosError<string>;
      if (axios.isAxiosError(err) && err.response) {
        resetField('password');
        const alertMsg = err.response.data || 'Unknown error.';
        setAlertState({ open: true, message: alertMsg });
      }
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
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <p> icon </p>
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
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  autoComplete="email"
                  autoFocus
                  {...field}
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  {...field}
                />
              )}
            />

            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
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
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}

export { SignIn };
