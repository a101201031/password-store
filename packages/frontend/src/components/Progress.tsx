import { Box, CircularProgress, Grid, Skeleton } from '@mui/material';

function CircularIndicator() {
  return (
    <Box my="auto">
      <CircularProgress />
    </Box>
  );
}

interface CardIndicatorProps {
  boxH?: number;
  mainTextH?: number;
  subTextH?: number;
}

function CardIndicator(props: CardIndicatorProps) {
  const { boxH = 100, mainTextH = 24, subTextH = 20 } = props;
  return (
    <>
      <Grid item xs={12}>
        <Skeleton variant="text" width="30%" height={mainTextH} />
      </Grid>
      {Array.from({ length: 3 }, (v, i) => i).map((v, i) => (
        <Grid item xs={4} key={i}>
          <Skeleton variant="rectangular" height={boxH} />
          <Skeleton variant="text" height={mainTextH} />
          <Skeleton variant="text" height={subTextH} />
        </Grid>
      ))}
    </>
  );
}

export { CircularIndicator, CardIndicator };
