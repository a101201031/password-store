import { Grid, Typography } from '@mui/material';
import { AccountCard } from 'components';
import { useRecoilValue } from 'recoil';
import { accountListSltr } from 'store';

function AccountList() {
  const accountList = useRecoilValue(accountListSltr);
  return (
    <>
      {accountList.map((v) => (
        <Grid
          container
          rowSpacing={1}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          key={v.gid}
        >
          <Grid item xs={12} marginY={2}>
            <Typography variant="h5">{v.groupName}</Typography>
          </Grid>
          {v.accounts.map((sv) => (
            <Grid item xs={4} key={sv.aid}>
              <AccountCard
                serviceName={sv.serviceName}
                serviceAccount={sv.serviceAccount}
              />
            </Grid>
          ))}
        </Grid>
      ))}
    </>
  );
}
export { AccountList };
