import { Grid, Typography } from '@mui/material';
import { AccountCard, AccountEditCard } from 'components';
import { useRecoilValue } from 'recoil';
import { filteredAccountListSltr } from 'store';

interface AccountListProps {
  mode?: 'password' | 'edit';
}

function AccountList(props: AccountListProps) {
  const { mode = 'password' } = props;
  const accountList = useRecoilValue(filteredAccountListSltr);
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
            <Typography variant="h5">{v.group_name}</Typography>
          </Grid>
          {v.accounts.map((sv) => (
            <Grid item xs={4} key={sv.aid}>
              {mode === 'password' ? (
                <AccountCard
                  serviceName={sv.service_name}
                  serviceAccount={sv.service_account}
                  aid={sv.aid}
                />
              ) : (
                <AccountEditCard
                  serviceName={sv.service_name}
                  serviceAccount={sv.service_account}
                  aid={sv.aid}
                />
              )}
            </Grid>
          ))}
        </Grid>
      ))}
    </>
  );
}
export { AccountList };
