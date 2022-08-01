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
import { AccountList, AuthAsyncBoundary, CardIndicator } from 'components';
import type { ChangeEventHandler, MouseEventHandler } from 'react';
import { useRef } from 'react';
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
              <SearchField />
            </Grid>
            <Divider />
            <AuthAsyncBoundary
              errorFallback={(_) => {
                return null;
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
            </AuthAsyncBoundary>
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
                <Grid item xs={6}>
                  <Typography
                    variant="h5"
                    color="primary"
                    sx={{ fontWeight: 'bold' }}
                  >
                    Edit Account
                  </Typography>
                </Grid>
                <Grid
                  container
                  columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                  justifyContent="end"
                >
                  <Grid item>
                    <Button
                      component={Link}
                      to="/account/add"
                      variant="outlined"
                      startIcon={<AddIcon />}
                    >
                      Add Account
                    </Button>
                  </Grid>
                  <Grid item>
                    <SearchField />
                  </Grid>
                </Grid>
              </Grid>
              <Divider />
              <AuthAsyncBoundary
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
                <AccountList mode="edit" />
              </AuthAsyncBoundary>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

function SearchField() {
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

  const handleSearchIconClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    inputRef.current?.focus();
  };

  return (
    <TextField
      inputRef={inputRef}
      id="accountId"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            {filterValue ? (
              <IconButton sx={{ padding: 0 }} onClick={handleClearIconClick}>
                <CancelIcon />
              </IconButton>
            ) : (
              <IconButton sx={{ padding: 0 }} onClick={handleSearchIconClick}>
                <SearchIcon />
              </IconButton>
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
