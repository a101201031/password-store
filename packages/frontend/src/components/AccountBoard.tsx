import AddIcon from '@mui/icons-material/Add';
import {
  Button,
  Container,
  Divider,
  Grid,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { AccountList } from 'components';
import { Suspense } from 'react';
import type { ChangeEventHandler } from 'react';
import { Link } from 'react-router-dom';
import { CardIndicator } from './Progress';
import SearchIcon from '@mui/icons-material/Search';

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
              sx={{ mb: 2 }}
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
                sx={{ mb: 1 }}
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
                <Button
                  component={Link}
                  to="add"
                  variant="outlined"
                  startIcon={<AddIcon />}
                >
                  Add Account
                </Button>
              </Grid>
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
  return (
    <TextField
      id="accountId"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
      variant="standard"
    />
  );
}
export { AccountBoard, AccountEditBoard };
