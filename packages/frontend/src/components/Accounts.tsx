import { Button, Container, Grid, Paper, Typography } from '@mui/material';
import { AccountCard } from './AccountCard';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';

function Accounts() {
  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container>
          <Paper
            sx={{
              p: 2,
              display: 'grid',
            }}
          >
            <Grid
              container
              sx={{ mb: 4 }}
              wrap="nowrap"
              justifyContent="space-between"
            >
              <Typography component="h1">Edit Account</Typography>
              <Button
                component={Link}
                to="add"
                variant="outlined"
                startIcon={<AddIcon />}
              >
                Add Account
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              >
                <Grid item xs={4}>
                  <AccountCard />
                </Grid>
                <Grid item xs={4}>
                  <AccountCard />
                </Grid>
                <Grid item xs={4}>
                  <AccountCard />
                </Grid>
                <Grid item xs={4}>
                  <AccountCard />
                </Grid>
                <Grid item xs={4}>
                  <AccountCard />
                </Grid>
                <Grid item xs={4}>
                  <AccountCard />
                </Grid>
                <Grid item xs={4}>
                  <AccountCard />
                </Grid>
                <Grid item xs={4}>
                  <AccountCard />
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Container>
    </>
  );
}
export { Accounts };
