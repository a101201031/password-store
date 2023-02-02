import { yupResolver } from '@hookform/resolvers/yup';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import type { AxiosError } from 'axios';
import axios from 'axios';
import { AuthAsyncBoundary, CircularIndicator, SignOut } from 'components';
import { dateToString, fetcher, nowDiffDays } from 'helper';
import { useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { Controller, useForm } from 'react-hook-form';
import { useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil';
import { accessTokenAtom, snackbarAtom, userInfoSltr } from 'store';
import { changePasswordSchema, changeUserNameSchema } from 'validation';

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
        <AuthAsyncBoundary suspenseFallback={<></>}>
          <UserNameEdit />
        </AuthAsyncBoundary>
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
        <AuthAsyncBoundary suspenseFallback={<></>}>
          <UserDelete />
        </AuthAsyncBoundary>
      </Grid>
    </Grid>
  );
}

interface UserNameFormTypes {
  userName: string;
}

function UserNameEdit() {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserNameFormTypes>({
    resolver: yupResolver(changeUserNameSchema),
  });
  const [namePopupOpen, setNamePopupOpen] = useState(false);
  const idToken = useRecoilValue(accessTokenAtom);
  const setSnackbar = useSetRecoilState(snackbarAtom);
  const resetUserInfo = useResetRecoilState(userInfoSltr);

  const handleOpenClick = () => {
    setNamePopupOpen(true);
  };

  const handleClose = () => {
    setNamePopupOpen(false);
  };

  const onSubmit: SubmitHandler<UserNameFormTypes> = async (data) => {
    const { userName: user_name } = data;
    try {
      await fetcher.post({
        path: '/user/update',
        bodyParams: { user_name },
        accessToken: idToken,
      });
      reset();
      handleClose();
      resetUserInfo();
    } catch (e) {
      const err = e as Error | AxiosError<string>;
      if (axios.isAxiosError(err) && err.response) {
        const alertMsg =
          (typeof err.response.data === 'string' && err.response.data) ||
          'Unknown error.';
        setSnackbar({ open: true, level: 'error', message: alertMsg });
      }
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        onClick={handleOpenClick}
        sx={{ mt: 2, mb: 1 }}
      >
        Edit
      </Button>
      {namePopupOpen && (
        <Dialog
          open={namePopupOpen}
          onClose={handleClose}
          maxWidth="sm"
          fullWidth={true}
        >
          <Box
            component="form"
            id="deleteForm"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
          >
            <DialogTitle>{`Edit User Name`}</DialogTitle>
            <DialogContent dividers>
              <Typography gutterBottom>{`Name`}</Typography>
              <Controller
                name="userName"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...register('userName', { required: true })}
                    {...field}
                    margin="normal"
                    fullWidth
                    id="userName"
                    type="text"
                    autoComplete="userName"
                    error={!!errors.userName}
                    helperText={errors.userName?.message}
                  />
                )}
              />
            </DialogContent>
            <DialogActions>
              <Button variant="contained" type="submit">
                Save
              </Button>
              <Button onClick={handleClose}>Cancle</Button>
            </DialogActions>
          </Box>
        </Dialog>
      )}
    </>
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
  const [isSubmit, setIsSubmit] = useState(false);
  const idToken = useRecoilValue(accessTokenAtom);
  const setSnackbar = useSetRecoilState(snackbarAtom);
  const resetUserInfo = useResetRecoilState(userInfoSltr);

  const handleOpenClick = () => {
    setPasswordPopupOpen(true);
  };

  const handleClose = () => {
    setPasswordPopupOpen(false);
  };

  const onSubmit: SubmitHandler<UserPasswordFormTypes> = async (data) => {
    const { currentPassword, newPassword, confirmPassword } = data;
    setIsSubmit(true);
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
      resetUserInfo();
      setIsSubmit(false);
    } catch (e) {
      setIsSubmit(false);
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
      {passwordPopupOpen && (
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
            <DialogActions>
              <Button variant="contained" type="submit" disabled={isSubmit}>
                Save
              </Button>
              <Button onClick={handleClose}>Cancle</Button>
            </DialogActions>
          </Box>
        </Dialog>
      )}
    </>
  );
}

interface UserDeleteFormTypes {
  password: string;
}

function UserDelete() {
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<UserDeleteFormTypes>();

  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const idToken = useRecoilValue(accessTokenAtom);
  const setSnackbar = useSetRecoilState(snackbarAtom);

  const handleOpenClick = () => {
    setDeletePopupOpen(true);
  };

  const handleClose = () => {
    setDeletePopupOpen(false);
  };

  const onSubmit: SubmitHandler<UserDeleteFormTypes> = async (data) => {
    const { password } = data;
    try {
      await fetcher.post({
        path: '/user/delete',
        bodyParams: { password },
        accessToken: idToken,
      });
      handleClose();
      setIsDeleted(true);
    } catch (e) {
      const err = e as Error | AxiosError<string>;
      if (axios.isAxiosError(err) && err.response) {
        const alertMsg =
          (typeof err.response.data === 'string' && err.response.data) ||
          'Unknown error.';
        setError('password', { type: 'custom' });
        setSnackbar({ open: true, level: 'error', message: alertMsg });
      }
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<DeleteIcon />}
        color="error"
        onClick={handleOpenClick}
      >
        Delete User
      </Button>
      <Dialog
        open={deletePopupOpen}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth={true}
      >
        <Box
          component="form"
          id="deleteForm"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <DialogTitle>{`Delete User`}</DialogTitle>
          <DialogContent dividers>
            <DialogContentText>
              Are you sure that you want to delete user? This user will be
              deleted immediately. You can't undo this action.
            </DialogContentText>
            <Typography color="error" sx={{ fontWeight: 'bold' }}>
              Warning: Your management accounts will deleted immediately. Please
              backup your management accounts password.
            </Typography>
          </DialogContent>
          <DialogContent dividers>
            <Typography gutterBottom>{`Password`}</Typography>
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
                  id="password"
                  type="password"
                  autoComplete="password"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
              )}
            />
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleClose}>
              Cancle
            </Button>
            <Button
              startIcon={<DeleteIcon />}
              variant="contained"
              color="error"
              type="submit"
            >
              Delete
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
      {isDeleted && <SignOut />}
    </>
  );
}

export { User };
