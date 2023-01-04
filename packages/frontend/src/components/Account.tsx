import { yupResolver } from '@hookform/resolvers/yup';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import SaveIcon from '@mui/icons-material/Save';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
  Autocomplete,
  Breadcrumbs,
  Button,
  Container,
  createFilterOptions,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
import { SERVICES } from 'constants/SERVICES';
import { dateToString, fetcher, nowDiffDays } from 'helper';
import { AccountModel } from 'model';
import type { ChangeEvent, MouseEventHandler } from 'react';
import { useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { Controller, useForm } from 'react-hook-form';
import { Link, Outlet, useNavigate, useParams } from 'react-router-dom';
import { useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil';
import {
  accessTokenAtom,
  accountInfoSltr,
  accountListSltr,
  accountOAuthListSltr,
  groupInfoSltr,
  groupListSltr,
  snackbarAtom,
} from 'store';
import { accountAddFromSchema, accountPasswordSchema } from 'validation';

function Account() {
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
              <Outlet />
            </AuthAsyncBoundary>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

interface AccountEditFormTypes
  extends Pick<
    AccountModel,
    'service_account' | 'password' | 'gid' | 'authentication'
  > {}

function AccountEdit() {
  const { aid } = useParams() as { aid: string };
  const navigate = useNavigate();

  const accountInfo = useRecoilValue(accountInfoSltr({ aid }));
  const groupList = useRecoilValue(groupListSltr);
  const groupInfo = useRecoilValue(groupInfoSltr({ gid: accountInfo.gid }));
  const accountOAuthList = useRecoilValue(accountOAuthListSltr);
  const idToken = useRecoilValue(accessTokenAtom);
  const setSnackbar = useSetRecoilState(snackbarAtom);
  const resetAccountInfo = useResetRecoilState(accountInfoSltr({ aid }));
  const resetAccountList = useResetRecoilState(accountListSltr);
  const resetGroupList = useResetRecoilState(groupListSltr);

  const defaultAccountOAuth = accountOAuthList.filter(
    (v) => v.aid === accountInfo.authentication,
  )[0];

  const { control, handleSubmit } = useForm<AccountEditFormTypes>();
  const [showPassword, setShowpassword] = useState(false);
  const [safetyScore, setSafetyScore] = useState<number>(0);
  const [openReminder, setOpenReminder] = useState<boolean>(false);

  const onSubmit: SubmitHandler<AccountEditFormTypes> = async (data) => {
    const { password, gid, authentication } = data;
    await fetcher.put<{ message: string }>({
      path: '/account',
      bodyParams: {
        aid,
        password,
        gid,
        authentication,
      },
      accessToken: idToken,
    });

    resetAccountInfo();
    resetAccountList();
    resetGroupList();
    setSnackbar({
      open: true,
      level: 'success',
      message: 'Account has been modified successfully.',
    });
    navigate('/accounts');
  };

  const handleShowPasswordClick = () => {
    setShowpassword(!showPassword);
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

  const handleReminderOpen: MouseEventHandler<HTMLButtonElement> = () => {
    setOpenReminder(true);
  };

  const handleReminderClose: MouseEventHandler<HTMLButtonElement> = () => {
    setOpenReminder(false);
  };

  const handleDeleteClick: MouseEventHandler<HTMLButtonElement> = async () => {
    await fetcher.del({
      path: `/account/${aid}`,
      accessToken: idToken,
    });
    resetAccountList();
    resetGroupList();
    setSnackbar({
      open: true,
      level: 'success',
      message: 'Account has been deleted successfully.',
    });
    navigate('/accounts');
  };

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

  function DeleteReminder() {
    return (
      <Dialog open={openReminder} onClose={handleReminderClose}>
        <DialogTitle>{`Are you sure you want to delete "${accountInfo.service_account}"?`}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This account will be deleted immediately. You can't undo this
            action.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleReminderClose}>
            Cancle
          </Button>
          <Button color="error" onClick={handleDeleteClick}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

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
                Accounts
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
            name="service_account"
            control={control}
            defaultValue={accountInfo.service_account}
            render={({ field }) => (
              <TextField
                margin="normal"
                disabled
                fullWidth
                id="service_account"
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
            render={({ field: { onChange, ...field } }) => (
              <TextField
                margin="normal"
                fullWidth
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">
                      <IconButton
                        sx={{ padding: 0 }}
                        onClick={handleShowPasswordClick}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                onChange={(e) => {
                  onChange(e);
                  handlePasswordChange(e);
                }}
                {...field}
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
            name="gid"
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
        <Grid item xs={12} sm={6}>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            OAuth Service
          </Typography>
          <Controller
            control={control}
            name="authentication"
            defaultValue={accountInfo.authentication}
            render={({ field: { ref, onChange, ...field } }) => (
              <Autocomplete
                sx={{ mt: 2, mb: 1 }}
                fullWidth
                id="authentication"
                defaultValue={defaultAccountOAuth}
                options={accountOAuthList}
                groupBy={(o) => o.group_name}
                getOptionDisabled={(option) => option.aid === accountInfo.aid}
                getOptionLabel={(o) =>
                  o.aid === 'standalone'
                    ? `standalone`
                    : `${o.service_name} - ${o.service_account}`
                }
                onChange={(_, v) => onChange(v?.aid)}
                renderInput={(params) => (
                  <TextField {...params} {...field} inputRef={ref} />
                )}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={7}>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            Last Password Changed
          </Typography>
          <Typography
            variant="body1"
            color={
              nowDiffDays(accountInfo.last_password_changed) >= 90
                ? 'error'
                : ''
            }
          >
            {dateToString(accountInfo.last_password_changed)} :{' '}
            {nowDiffDays(accountInfo.last_password_changed)} days ago
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
                  <Button
                    component={Link}
                    to="/accounts"
                    variant="outlined"
                    startIcon={<CancelIcon />}
                  >
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
                    onClick={handleReminderOpen}
                  >
                    Delete
                  </Button>
                </Grid>
                <DeleteReminder />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

interface AccountAddFormTypes
  extends Pick<
    AccountModel,
    'service_name' | 'service_account' | 'password' | 'gid' | 'authentication'
  > {}

function AccountAdd() {
  const groupList = useRecoilValue(groupListSltr);
  const accountOAuthList = useRecoilValue(accountOAuthListSltr);
  const idToken = useRecoilValue(accessTokenAtom);
  const setSnackbar = useSetRecoilState(snackbarAtom);
  const resetAccountList = useResetRecoilState(accountListSltr);
  const resetGroupList = useResetRecoilState(groupListSltr);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AccountAddFormTypes>({
    resolver: yupResolver(accountAddFromSchema),
  });
  const [show, setShow] = useState(false);
  const [safetyScore, setSafetyScore] = useState<number>(0);

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<AccountAddFormTypes> = async (data) => {
    const { service_name, service_account, password, gid, authentication } =
      data;
    await fetcher.post<{ message: string }>({
      path: '/account',
      bodyParams: {
        service_name,
        service_account,
        password,
        gid,
        authentication,
      },
      accessToken: idToken,
    });
    resetAccountList();
    resetGroupList();
    setSnackbar({
      open: true,
      level: 'success',
      message: 'Account has been added successfully.',
    });
    navigate('/accounts');
  };

  interface AutocompleteItemTypes extends Pick<AccountModel, 'service_name'> {
    inputValue?: string;
  }
  const muiFilter = createFilterOptions<AutocompleteItemTypes>();

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
      <Grid container>
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
              Accounts
            </MuiLink>
            <Typography
              variant="h5"
              color="primary"
              sx={{ fontWeight: 'bold' }}
            >
              Add
            </Typography>
          </Breadcrumbs>
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
            Service Name
          </Typography>
          <Controller
            name="service_name"
            control={control}
            defaultValue=""
            render={({ field: { value, onChange, ...field } }) => (
              <Autocomplete
                value={value}
                {...field}
                sx={{ mt: 2, mb: 1 }}
                fullWidth
                options={SERVICES as AutocompleteItemTypes[]}
                isOptionEqualToValue={(o, v) => {
                  return typeof v === 'string' && o.service_name === v;
                }}
                selectOnFocus
                clearOnBlur
                getOptionLabel={(o) => {
                  if (typeof o === 'string') {
                    return o;
                  } else if (o.inputValue) {
                    return o.inputValue;
                  }
                  return o.service_name;
                }}
                onChange={(_, v) => {
                  onChange(
                    typeof v === 'string'
                      ? v
                      : v && (v.inputValue || v.service_name),
                  );
                }}
                filterOptions={(options, params) => {
                  const filtered = muiFilter(options, params);
                  const { inputValue } = params;
                  const isExisting = options.some(
                    (o) => inputValue === o.service_name,
                  );
                  if (inputValue !== '' && !isExisting) {
                    filtered.push({
                      inputValue,
                      service_name: `Add "${inputValue}"`,
                    });
                  }
                  return filtered;
                }}
                renderOption={(props, o) => (
                  <li {...props}>{o.service_name}</li>
                )}
                freeSolo
                renderInput={(params) => (
                  <TextField error={!!errors.service_name} {...params} />
                )}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            Service Account
          </Typography>
          <Controller
            name="service_account"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                margin="normal"
                fullWidth
                id="service_account"
                autoComplete="username"
                error={!!errors.service_account}
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
            render={({ field: { onChange, ...field } }) => (
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
                error={!!errors.password}
                {...field}
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
            name="gid"
            defaultValue=""
            render={({ field }) => (
              <Select
                error={!!errors.gid}
                {...field}
                fullWidth
                sx={{ mt: 2, mb: 1 }}
              >
                {groupList.map((v) => (
                  <MenuItem key={v.gid} value={v.gid}>
                    {v.group_name}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            OAuth Service
          </Typography>
          <Controller
            control={control}
            name="authentication"
            defaultValue=""
            render={({ field: { ref, onChange, ...field } }) => (
              <Autocomplete
                sx={{ mt: 2, mb: 1 }}
                fullWidth
                id="authentication"
                options={accountOAuthList}
                defaultValue={accountOAuthList.find(
                  (v) => v.aid === 'standalone',
                )}
                groupBy={(o) => o.group_name}
                getOptionLabel={(o) =>
                  o.aid === 'standalone'
                    ? `standalone`
                    : `${o.service_name} - ${o.service_account}`
                }
                onChange={(_, v) => onChange(v?.aid)}
                renderInput={(params) => (
                  <TextField {...params} {...field} inputRef={ref} />
                )}
              />
            )}
          />
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
                  <Button
                    component={Link}
                    to="/accounts"
                    variant="outlined"
                    startIcon={<CancelIcon />}
                  >
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
              ></Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export { Account, AccountEdit, AccountAdd };
