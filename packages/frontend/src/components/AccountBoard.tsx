import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import SearchIcon from '@mui/icons-material/Search';
import {
  Button,
  Container,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { AccountList, AsyncBoundary, CardIndicator, SignOut } from 'components';
import type { ChangeEventHandler } from 'react';
import { MouseEventHandler, Suspense, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { accountListFilterAtom } from 'store';

function AccountBoard() {
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
                Show Password
              </Typography>
              <SearchFiled />
            </Grid>
            <Divider />
            <AsyncBoundary
              errorFallback={({ error }) => {
                if (
                  axios.isAxiosError(error) &&
                  error.response &&
                  error.response.status === 401
                ) {
                  return <SignOut />;
                }
                return <h1>ERROR</h1>;
              }}
              suspenseFallback={
                <Grid
                  container
                  rowSpacing={1}
                  columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                >
                  <CardIndicator />
                  <CardIndicator />
                </Grid>
              }
            >
              <AccountList />
            </AsyncBoundary>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

function AccountEditBoard() {
  return (
    <>
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
                sx={{ mb: 2, minHeight: '36px', maxHeight: '36px' }}
                wrap="nowrap"
                justifyContent="space-between"
              >
                <Typography
                  variant="h5"
                  color="primary"
                  sx={{ fontWeight: 'bold' }}
                >
                  Edit Account
                </Typography>
                <Grid
                  container
                  xs={6}
                  columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                  justifyContent="end"
                >
                  <Grid item>
                    <SearchFiled />
                  </Grid>
                  <Grid item>
                    <Button
                      component={Link}
                      to="add"
                      variant="outlined"
                      startIcon={<AddIcon />}
                    >
                      Add Account
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
              <Divider />
              <Suspense
                fallback={
                  <Grid
                    container
                    rowSpacing={1}
                    columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                  >
                    <CardIndicator />
                    <CardIndicator />
                  </Grid>
                }
              >
                <AccountList />
              </Suspense>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

function SearchFiled() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [filterValue, setFilterValue] = useRecoilState(accountListFilterAtom);
  const handleChange: ChangeEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  > = (e) => {
    const { value } = e.target;
    setFilterValue(value);
  };

  const handleClearIconClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    setFilterValue('');
  };

  return (
    <TextField
      ref={inputRef}
      id="accountId"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            {filterValue ? (
              <IconButton sx={{ padding: 0 }} onClick={handleClearIconClick}>
                <CancelIcon />
              </IconButton>
            ) : (
              <SearchIcon />
            )}
          </InputAdornment>
        ),
      }}
      variant="standard"
      onChange={handleChange}
      value={filterValue}
    />
  );
}
export { AccountBoard, AccountEditBoard };
