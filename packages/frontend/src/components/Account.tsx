import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import SaveIcon from '@mui/icons-material/Save';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
  Breadcrumbs,
  Button,
  Container,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  LinearProgress,
  Link as MuiLink,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { AuthAsyncBoundary, CircularIndicator } from 'components';
import { dateToString, nowDiffDays } from 'helper';
import type { ChangeEvent } from 'react';
import { useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { Controller, useForm } from 'react-hook-form';
import { Link, useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { accountInfoSltr, groupInfoSltr, groupListSltr } from 'store';
import { accountPasswordSchema } from 'validation/account';

function Account() {
  const { aid } = useParams();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container>
        <Grid item xs={12}>
          <Paper
            sx={{
              display: 'grid',
            }}
          >
            <AuthAsyncBoundary suspenseFallback={<CircularIndicator />}>
              {aid ? <AccountInfo aid={aid} /> : <CircularIndicator />}
            </AuthAsyncBoundary>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

interface AccountInfoProps {
  aid: string;
}

function AccountInfo(props: AccountInfoProps) {
  const { aid } = props;
  const accountInfo = useRecoilValue(accountInfoSltr({ aid }));
  const groupList = useRecoilValue(groupListSltr);
  const groupInfo = useRecoilValue(groupInfoSltr({ gid: accountInfo.gid }));

  const { control, handleSubmit } = useForm();
  const [show, setShow] = useState(false);
  const [safetyScore, setSafetyScore] = useState<number>(0);

  const onSubmit: SubmitHandler<any> = (data) => {};

  const handleShowPasswordClick = () => {
    setShow(!show);
  };

  const handlePasswordChange = async (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    try {
      await accountPasswordSchema.validate(e.target.value, {
        abortEarly: false,
      });
      setSafetyScore(100);
    } catch (e) {
      const err = e as { errors: string[] };
      setSafetyScore(100 - err.errors.length * 20);
    }
  };
  // const safetyBarColor =
  const safetyBarColor: () =>
    | 'error'
    | 'warning'
    | 'success'
    | undefined = () => {
    switch (safetyScore / 20) {
      case 0:
      case 2:
      case 1:
        return 'error';
      case 3:
      case 4:
        return 'warning';
      case 5:
        return 'success';
      default:
        return undefined;
    }
  };

  return (
    <>
      <Grid sx={{ height: '30vh' }}>
        <Grid
          container
          sx={{
            height: '100%',
            background:
              'linear-gradient(to bottom, rgba(20, 20, 20, 0.1), rgba(20, 20, 20, 0.25), rgba(20, 20, 20, 0.5)), url(/logo/google_logo.jpeg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <Grid
            item
            xs={12}
            sx={{
              p: 2,
              maxHeight: '64px',
              backgroundColor: 'rgba( 255, 255, 255, 0.3 )',
            }}
          >
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
              <MuiLink
                component={Link}
                variant="h6"
                sx={{ fontWeight: 'bold' }}
                color="inherit"
                to="/accounts"
                underline="hover"
              >
                Edit Account
              </MuiLink>
              <Typography
                variant="h5"
                color="primary"
                sx={{ fontWeight: 'bold' }}
              >
                Edit
              </Typography>
            </Breadcrumbs>
          </Grid>
        </Grid>
      </Grid>

      <Grid
        container
        columnSpacing={{ xs: 1 }}
        sx={{ p: 2, minHeight: '36px' }}
        wrap="nowrap"
        justifyContent="space-between"
      >
        <Grid item>
          <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
            {accountInfo.service_name} account
          </Typography>
        </Grid>
      </Grid>
      <Divider />
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
            Service Account
          </Typography>
          <Controller
            name="accountId"
            control={control}
            defaultValue={accountInfo.service_account}
            render={({ field }) => (
              <TextField
                margin="normal"
                required
                disabled
                fullWidth
                id="accountId"
                autoComplete="accountId"
                {...field}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            Password
          </Typography>
          <Controller
            name="password"
            control={control}
            defaultValue=""
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <TextField
                margin="normal"
                fullWidth
                type={show ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">
                      <IconButton
                        sx={{ padding: 0 }}
                        onClick={handleShowPasswordClick}
                      >
                        {show ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                onChange={(e) => {
                  onChange(e);
                  handlePasswordChange(e);
                }}
                onBlur={onBlur}
                value={value}
                ref={ref}
              />
            )}
          />
          {!!safetyScore && (
            <LinearProgress
              variant="determinate"
              color={safetyBarColor()}
              value={safetyScore}
            />
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            Group Name
          </Typography>
          <Controller
            control={control}
            name="groupId"
            defaultValue={groupInfo.gid}
            render={({ field }) => (
              <Select {...field} fullWidth sx={{ mt: 2, mb: 1 }}>
                {groupList.map((v) => (
                  <MenuItem key={v.gid} value={v.gid}>
                    {v.group_name}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </Grid>
        <Grid item xs={12} sm={7}>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            Password Last Change
          </Typography>
          <Typography
            variant="body1"
            color={
              nowDiffDays(accountInfo.password_last_change) >= 90 ? 'error' : ''
            }
          >
            {dateToString(accountInfo.password_last_change)} :{' '}
            {nowDiffDays(accountInfo.password_last_change)} days ago
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            Created At
          </Typography>
          <Typography variant="body1">
            {dateToString(accountInfo.created_at)}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            Updated At
          </Typography>
          <Typography variant="body1">
            {dateToString(accountInfo.updated_at)}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider />
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
                <Grid item>
                  <Button variant="outlined" startIcon={<CancelIcon />}>
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <Grid
                container
                justifyContent="end"
                columnSpacing={{ xs: 1, sm: 2 }}
              >
                <Grid item>
                  <Button
                    variant="outlined"
                    startIcon={<DeleteIcon />}
                    color="error"
                  >
                    Delete
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export { Account };
