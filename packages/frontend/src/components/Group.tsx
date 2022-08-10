import CancelIcon from '@mui/icons-material/Cancel';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import SaveIcon from '@mui/icons-material/Save';
import {
  Breadcrumbs,
  Button,
  Card,
  CardHeader,
  Checkbox,
  Container,
  Divider,
  Grid,
  Link as MuiLink,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { AuthAsyncBoundary, CircularIndicator } from 'components';
import type { AccountGroupModel, AccountModel } from 'model';
import type { ReactNode } from 'react';
import { Fragment, useCallback, useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { Controller, useForm } from 'react-hook-form';
import { Link, Outlet, useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import type { AccountListTypes } from 'store';
import { accountListSltr, groupInfoSltr } from 'store';

function Group() {
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

function not(a: AccountListTypes[], b: AccountListTypes[]) {
  return a.map((v, i) => ({
    ...v,
    accounts: v.accounts.filter(
      (v2) => !b[i].accounts.find((v3) => v3.aid === v2.aid),
    ),
  }));
}

function intersection(a: AccountListTypes[], b: AccountListTypes[]) {
  return a.map((v, i) => ({
    ...v,
    accounts: v.accounts.filter(
      (v2) => !!b[i].accounts.find((v3) => v3.aid === v2.aid),
    ),
  }));
}

function union(a: AccountListTypes[], b: AccountListTypes[]) {
  const notMember = not(b, a);
  return a.map((v, i) => ({
    ...v,
    accounts: v.accounts.concat(notMember[i].accounts),
  }));
}

interface GroupAddEditFormTypes extends Pick<AccountGroupModel, 'group_name'> {}

function GroupEdit() {
  const { gid } = useParams() as { gid: string };
  const accountList = useRecoilValue(accountListSltr);
  const groupInfo = useRecoilValue(groupInfoSltr({ gid }));
  const { control, handleSubmit } = useForm<GroupAddEditFormTypes>();

  const onSubmit: SubmitHandler<GroupAddEditFormTypes> = (data) => {};

  const [checked, setChecked] = useState<AccountListTypes[]>(
    accountList.map((v) => ({ ...v, accounts: [] })),
  );
  const [left, setLeft] = useState<AccountListTypes[]>(
    accountList.map((v) => ({
      ...v,
      accounts: v.gid !== gid ? v.accounts : [],
    })),
  );
  const [right, setRight] = useState<AccountListTypes[]>(
    accountList.map((v) => ({
      ...v,
      accounts: v.gid === gid ? v.accounts : [],
    })),
  );

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = useCallback(
    (
        check: Pick<
          AccountModel,
          'aid' | 'service_name' | 'service_account' | 'authentication'
        >,
      ) =>
      () => {
        const newChecked = [...checked];

        const currentGid = accountList.find((group) =>
          group.accounts.find((account) => account.aid === check.aid),
        )?.gid;
        const currentIndex = newChecked
          .find((group) => group.gid === currentGid)
          ?.accounts.findIndex((account) => account.aid === check.aid);

        if (currentIndex === -1) {
          newChecked.forEach(
            (group, i, arr) =>
              group.gid === currentGid && arr[i].accounts.push(check),
          );
        } else if (typeof currentIndex === 'number' && currentIndex !== -1) {
          newChecked.forEach(
            (group, i, arr) =>
              group.gid === currentGid &&
              arr[i].accounts.splice(currentIndex, 1),
          );
        }

        setChecked(newChecked);
      },
    [accountList, checked],
  );

  const numberOfChecked = (items: AccountListTypes[]) =>
    intersection(checked, items).reduce((p, c) => p + c.accounts.length, 0);

  const handleToggleAll = (items: AccountListTypes[]) => () => {
    if (
      numberOfChecked(items) ===
      items.reduce((p, c) => p + c.accounts.length, 0)
    ) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    setRight(
      right.map((v, i) => ({
        ...v,
        accounts: v.accounts.concat(leftChecked[i].accounts),
      })),
    );
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(
      left.map((v, i) => ({
        ...v,
        accounts: v.accounts.concat(rightChecked[i].accounts),
      })),
    );
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const customList = (title: ReactNode, itemGroups: AccountListTypes[]) => (
    <Card>
      <CardHeader
        sx={{ px: 2, py: 1 }}
        avatar={
          <Checkbox
            onClick={handleToggleAll(itemGroups)}
            checked={
              numberOfChecked(itemGroups) ===
                itemGroups.reduce((p, c) => p + c.accounts.length, 0) &&
              itemGroups.reduce((p, c) => p + c.accounts.length, 0) !== 0
            }
            indeterminate={
              numberOfChecked(itemGroups) !==
                itemGroups.reduce((p, c) => p + c.accounts.length, 0) &&
              numberOfChecked(itemGroups) !== 0
            }
            disabled={itemGroups.length === 0}
            inputProps={{
              'aria-label': 'all items selected',
            }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(itemGroups)}/${itemGroups.reduce(
          (p, c) => p + c.accounts.length,
          0,
        )} selected`}
      />
      <Divider />
      <List
        sx={{
          width: 340,
          height: 320,
          bgcolor: 'background.paper',
          overflow: 'auto',
        }}
        dense
        component="div"
        role="list"
      >
        {itemGroups.map((items) =>
          items.accounts.length === 0 ? null : (
            <Fragment key={items.gid}>
              <ListSubheader>{items.group_name}</ListSubheader>
              {items.accounts.map((item) => (
                <ListItem
                  key={item.aid}
                  role="listitem"
                  button
                  onClick={handleToggle(item)}
                >
                  <ListItemIcon sx={{ pl: 2 }}>
                    <Checkbox
                      checked={
                        !!checked.find(
                          (group) =>
                            !!group.accounts.find(
                              (account) => account.aid === item.aid,
                            ),
                        )
                      }
                      tabIndex={-1}
                      disableRipple
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.service_account}
                    secondary={item.service_name}
                  />
                </ListItem>
              ))}
            </Fragment>
          ),
        )}

        <ListItem />
      </List>
    </Card>
  );

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
              to="/groups"
              underline="hover"
            >
              Groups
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
      <Divider />
      <Grid
        rowSpacing={2}
        columnSpacing={{ sm: 2 }}
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        container
        sx={{ p: 2 }}
      >
        <Grid item xs={7}>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            Group Name
          </Typography>
          <Controller
            name="group_name"
            defaultValue={`${groupInfo.group_name}`}
            control={control}
            render={({ field }) => <TextField {...field} fullWidth />}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            Member
          </Typography>
          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <Grid item>{customList('Choices', left)}</Grid>
            <Grid item>
              <Grid container direction="column" alignItems="center">
                <Button
                  sx={{ my: 0.5 }}
                  variant="outlined"
                  size="small"
                  onClick={handleCheckedRight}
                  disabled={
                    leftChecked.reduce((p, c) => p + c.accounts.length, 0) === 0
                  }
                  aria-label="move selected right"
                >
                  &gt;
                </Button>
                <Button
                  sx={{ my: 0.5 }}
                  variant="outlined"
                  size="small"
                  onClick={handleCheckedLeft}
                  disabled={
                    rightChecked.reduce((p, c) => p + c.accounts.length, 0) ===
                    0
                  }
                  aria-label="move selected left"
                >
                  &lt;
                </Button>
              </Grid>
            </Grid>
            <Grid item>{customList('Chosen', right)}</Grid>
          </Grid>
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
                    to="/groups"
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

function GroupAdd() {
  const accountList = useRecoilValue(accountListSltr);
  const { control, handleSubmit } = useForm<GroupAddEditFormTypes>();

  const onSubmit: SubmitHandler<GroupAddEditFormTypes> = (data) => {};

  const [checked, setChecked] = useState<AccountListTypes[]>(
    accountList.map((v) => ({ ...v, accounts: [] })),
  );
  const [left, setLeft] = useState<AccountListTypes[]>(accountList);
  const [right, setRight] = useState<AccountListTypes[]>(
    accountList.map((v) => ({ ...v, accounts: [] })),
  );

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = useCallback(
    (
        check: Pick<
          AccountModel,
          'aid' | 'service_name' | 'service_account' | 'authentication'
        >,
      ) =>
      () => {
        const newChecked = [...checked];

        const currentGid = accountList.find((group) =>
          group.accounts.find((account) => account.aid === check.aid),
        )?.gid;
        const currentIndex = newChecked
          .find((group) => group.gid === currentGid)
          ?.accounts.findIndex((account) => account.aid === check.aid);

        if (currentIndex === -1) {
          newChecked.forEach(
            (group, i, arr) =>
              group.gid === currentGid && arr[i].accounts.push(check),
          );
        } else if (typeof currentIndex === 'number' && currentIndex !== -1) {
          newChecked.forEach(
            (group, i, arr) =>
              group.gid === currentGid &&
              arr[i].accounts.splice(currentIndex, 1),
          );
        }

        setChecked(newChecked);
      },
    [accountList, checked],
  );

  const numberOfChecked = (items: AccountListTypes[]) =>
    intersection(checked, items).reduce((p, c) => p + c.accounts.length, 0);

  const handleToggleAll = (items: AccountListTypes[]) => () => {
    if (
      numberOfChecked(items) ===
      items.reduce((p, c) => p + c.accounts.length, 0)
    ) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    setRight(
      right.map((v, i) => ({
        ...v,
        accounts: v.accounts.concat(leftChecked[i].accounts),
      })),
    );
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(
      left.map((v, i) => ({
        ...v,
        accounts: v.accounts.concat(rightChecked[i].accounts),
      })),
    );
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const customList = (title: ReactNode, itemGroups: AccountListTypes[]) => (
    <Card>
      <CardHeader
        sx={{ px: 2, py: 1 }}
        avatar={
          <Checkbox
            onClick={handleToggleAll(itemGroups)}
            checked={
              numberOfChecked(itemGroups) ===
                itemGroups.reduce((p, c) => p + c.accounts.length, 0) &&
              itemGroups.reduce((p, c) => p + c.accounts.length, 0) !== 0
            }
            indeterminate={
              numberOfChecked(itemGroups) !==
                itemGroups.reduce((p, c) => p + c.accounts.length, 0) &&
              numberOfChecked(itemGroups) !== 0
            }
            disabled={itemGroups.length === 0}
            inputProps={{
              'aria-label': 'all items selected',
            }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(itemGroups)}/${itemGroups.reduce(
          (p, c) => p + c.accounts.length,
          0,
        )} selected`}
      />
      <Divider />
      <List
        sx={{
          width: 340,
          height: 320,
          bgcolor: 'background.paper',
          overflow: 'auto',
        }}
        dense
        component="div"
        role="list"
      >
        {itemGroups.map((items) =>
          items.accounts.length === 0 ? null : (
            <Fragment key={items.gid}>
              <ListSubheader>{items.group_name}</ListSubheader>
              {items.accounts.map((item) => (
                <ListItem
                  key={item.aid}
                  role="listitem"
                  button
                  onClick={handleToggle(item)}
                >
                  <ListItemIcon sx={{ pl: 2 }}>
                    <Checkbox
                      checked={
                        !!checked.find(
                          (group) =>
                            !!group.accounts.find(
                              (account) => account.aid === item.aid,
                            ),
                        )
                      }
                      tabIndex={-1}
                      disableRipple
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.service_account}
                    secondary={item.service_name}
                  />
                </ListItem>
              ))}
            </Fragment>
          ),
        )}

        <ListItem />
      </List>
    </Card>
  );

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
              to="/groups"
              underline="hover"
            >
              Groups
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
        <Grid item xs={7}>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            Group Name
          </Typography>
          <Controller
            name="group_name"
            defaultValue=""
            control={control}
            render={({ field }) => <TextField {...field} fullWidth />}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            Member
          </Typography>
          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <Grid item>{customList('Choices', left)}</Grid>
            <Grid item>
              <Grid container direction="column" alignItems="center">
                <Button
                  sx={{ my: 0.5 }}
                  variant="outlined"
                  size="small"
                  onClick={handleCheckedRight}
                  disabled={
                    leftChecked.reduce((p, c) => p + c.accounts.length, 0) === 0
                  }
                  aria-label="move selected right"
                >
                  &gt;
                </Button>
                <Button
                  sx={{ my: 0.5 }}
                  variant="outlined"
                  size="small"
                  onClick={handleCheckedLeft}
                  disabled={
                    rightChecked.reduce((p, c) => p + c.accounts.length, 0) ===
                    0
                  }
                  aria-label="move selected left"
                >
                  &lt;
                </Button>
              </Grid>
            </Grid>
            <Grid item>{customList('Chosen', right)}</Grid>
          </Grid>
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
                    to="/groups"
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

export { Group, GroupAdd, GroupEdit };
