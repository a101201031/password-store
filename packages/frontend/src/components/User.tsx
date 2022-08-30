import KeyIcon from '@mui/icons-material/Key';
import SaveIcon from '@mui/icons-material/Save';
import {
  Button,
  Container,
  Divider,
  Grid,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { AuthAsyncBoundary, CircularIndicator } from 'components';
import { dateToString, fetcher, nowDiffDays } from 'helper';
import type { UserModel } from 'model';
import type { SubmitHandler } from 'react-hook-form';
import { Controller, useForm } from 'react-hook-form';
import { useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil';
import { accessTokenAtom, snackbarAtom, userInfoSltr } from 'store';

function User() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container>
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 2,
              display: 'grid',
            }}
          >
            <Grid
              container
              sx={{ mb: 2, minHeight: '36px' }}
              wrap="nowrap"
              justifyContent="space-between"
            >
              <Typography
                variant="h5"
                color="primary"
                sx={{ fontWeight: 'bold' }}
              >
                User Infomation
              </Typography>
            </Grid>
            <Divider />
            <AuthAsyncBoundary suspenseFallback={<CircularIndicator />}>
              <UserProfile />
            </AuthAsyncBoundary>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

interface UserProfileFormTypes extends Pick<UserModel, 'email' | 'user_name'> {}

function UserProfile() {
  const userInfo = useRecoilValue(userInfoSltr);
  const idToken = useRecoilValue(accessTokenAtom);
  const setSnackbar = useSetRecoilState(snackbarAtom);
  const resetUserInfo = useResetRecoilState(userInfoSltr);

  const { control, handleSubmit } = useForm<UserProfileFormTypes>();

  const onSubmit: SubmitHandler<UserProfileFormTypes> = async (data) => {
    const { email, user_name } = data;
    await fetcher.post({
      path: '/user',
      bodyParams: { email, user_name },
      accessToken: idToken,
    });
    setSnackbar({
      open: true,
      level: 'success',
      message: 'User has been modified successfully.',
    });
    resetUserInfo();
  };

  return (
    <Grid
      rowSpacing={2}
      columnSpacing={{ sm: 2 }}
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      container
      sx={{ p: 2 }}
    >
      <Grid item xs={12} sm={6}>
        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
          Email
        </Typography>
        <Controller
          name="email"
          control={control}
          defaultValue={userInfo.email}
          render={({ field }) => (
            <TextField {...field} margin="normal" fullWidth disabled />
          )}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
          Name
        </Typography>
        <Controller
          name="user_name"
          control={control}
          defaultValue={userInfo.user_name}
          render={({ field }) => (
            <TextField {...field} margin="normal" fullWidth />
          )}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography margin="normal" variant="body1" sx={{ fontWeight: 'bold' }}>
          Two-factor Authentication
        </Typography>
        <TextField
          margin="normal"
          fullWidth
          defaultValue={userInfo.two_fact_auth_type || 'unused'}
          disabled
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography margin="normal" variant="body1" sx={{ fontWeight: 'bold' }}>
          Change Password
        </Typography>
        <Button
          sx={{ mt: 2, mb: 1 }}
          variant="contained"
          startIcon={<KeyIcon />}
        >
          Change!
        </Button>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
          Last Password Change
        </Typography>
        <Typography
          variant="body1"
          color={
            nowDiffDays(userInfo.last_password_changed) >= 90 ? 'error' : ''
          }
        >
          {dateToString(userInfo.last_password_changed)} :{' '}
          {nowDiffDays(userInfo.last_password_changed)} days ago
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
          Created At
        </Typography>
        <Typography variant="body1">
          {dateToString(userInfo.created_at)}
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Grid container justifyContent="space-between">
          <Grid item xs={6}>
            <Grid container columnSpacing={{ xs: 1, sm: 2 }}>
              <Grid item>
                <Button
                  variant="contained"
                  type="submit"
                  startIcon={<SaveIcon />}
                >
                  Save
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Grid
              container
              justifyContent="end"
              columnSpacing={{ xs: 1, sm: 2 }}
            ></Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export { User };
