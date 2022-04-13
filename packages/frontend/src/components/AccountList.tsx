import { Container, Grid, Paper, Typography } from '@mui/material';
import { AccountCard } from './AccountCard';

function AccountList() {
  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Grid container>
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 2,
              display: 'grid',
            }}
          >
            <Typography component="h1">Edit Account</Typography>
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
          </Paper>
        </Grid>
      </Grid>
      {/* <Copyright sx={{ pt: 4 }} /> */}
    </Container>
  );
}
export { AccountList };
