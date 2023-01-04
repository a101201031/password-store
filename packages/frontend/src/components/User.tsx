import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import type { AxiosError } from 'axios';
import axios from 'axios';
import { AuthAsyncBoundary, CircularIndicator } from 'components';
import { dateToString, fetcher, nowDiffDays } from 'helper';
import { useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { Controller, useForm } from 'react-hook-form';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { accessTokenAtom, snackbarAtom, userInfoSltr } from 'store';
import { changePasswordSchema } from 'validation';

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

function UserProfile() {
  const userInfo = useRecoilValue(userInfoSltr);

  return (
    <Grid
      rowSpacing={2}
      columnSpacing={{ sm: 2 }}
      container
      sx={{ p: 2 }}
      alignItems="center"
    >
      <Grid item xs={12} sm={6}>
        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
          Email
        </Typography>
        <Typography variant="body1">{userInfo.email}</Typography>
      </Grid>
      <Grid item sm={6} />
      <Grid item xs={6}>
        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
          Name
        </Typography>
        <Typography variant="body1">{userInfo.user_name}</Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Button sx={{ mt: 2, mb: 1 }} variant="contained">
          edit
        </Button>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
          Created At
        </Typography>
        <Typography variant="body1">
          {dateToString(userInfo.created_at)}
        </Typography>
      </Grid>
      <Grid item sm={12}>
        <Divider />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography margin="normal" variant="body1" sx={{ fontWeight: 'bold' }}>
          Change Password
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <AuthAsyncBoundary suspenseFallback={<></>}>
          <UserPasswordChange />
        </AuthAsyncBoundary>
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
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <Button variant="outlined" color="error">
          Delete account
        </Button>
      </Grid>
    </Grid>
  );
}

interface UserPasswordFormTypes {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

function UserPasswordChange() {
  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<UserPasswordFormTypes>({
    resolver: yupResolver(changePasswordSchema),
  });

  const [passwordPopupOpen, setPasswordPopupOpen] = useState(false);
  const idToken = useRecoilValue(accessTokenAtom);
  const setSnackbar = useSetRecoilState(snackbarAtom);

  const handleOpenClick = () => {
    setPasswordPopupOpen(true);
  };

  const handleClose = () => {
    setPasswordPopupOpen(false);
  };

  const onSubmit: SubmitHandler<UserPasswordFormTypes> = async (data) => {
    const { currentPassword, newPassword, confirmPassword } = data;
    try {
      await fetcher.post({
        path: '/user/password',
        bodyParams: { currentPassword, newPassword, confirmPassword },
        accessToken: idToken,
      });
      reset();
      handleClose();
      setSnackbar({
        open: true,
        level: 'success',
        message: 'Password has been modified successfully.',
      });
    } catch (e) {
      const err = e as Error | AxiosError<string>;
      if (axios.isAxiosError(err) && err.response) {
        const alertMsg =
          (typeof err.response.data === 'string' && err.response.data) ||
          'Unknown error.';
        setError('currentPassword', { type: 'custom' });
        setSnackbar({ open: true, level: 'error', message: alertMsg });
      }
    }
  };

  return (
    <>
      <Button variant="contained" onClick={handleOpenClick}>
        Change Password
      </Button>
      <Dialog
        open={passwordPopupOpen}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth={true}
      >
        <DialogTitle>Change password</DialogTitle>
        <Box
          component="form"
          id="passwordForm"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <DialogContent dividers>
            <Typography gutterBottom>{`Current password`}</Typography>
            <Controller
              name="currentPassword"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...register('currentPassword', { required: true })}
                  {...field}
                  margin="normal"
                  fullWidth
                  id="currentPassword"
                  type="password"
                  autoComplete="current-password"
                  error={!!errors.currentPassword}
                  helperText={errors.currentPassword?.message}
                />
              )}
            />
            <Typography gutterBottom>{`New password`}</Typography>
            <Controller
              name="newPassword"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...register('newPassword', { required: true })}
                  {...field}
                  margin="normal"
                  fullWidth
                  id="newPassword"
                  type="password"
                  autoComplete="new-password"
                  error={!!errors.newPassword}
                  helperText={errors.newPassword?.message}
                />
              )}
            />
            <Typography gutterBottom>{`Confirm password`}</Typography>
            <Controller
              name="confirmPassword"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...register('confirmPassword', { required: true })}
                  {...field}
                  margin="normal"
                  fullWidth
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                />
              )}
            />
          </DialogContent>
        </Box>
        <DialogActions>
          <Button variant="contained" form="passwordForm" type="submit">
            Save
          </Button>
          <Button onClick={handleClose}>Cancle</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export { User };
