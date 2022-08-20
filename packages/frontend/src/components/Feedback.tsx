import { Alert, Snackbar } from '@mui/material';
import type { SyntheticEvent } from 'react';
import { useRecoilState } from 'recoil';
import { snackbarAtom } from 'store';

function CustomSnackbar() {
  const [barInfo, setBarInfo] = useRecoilState(snackbarAtom);

  const handleClose = (event?: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setBarInfo({ ...barInfo, open: false });
  };

  return (
    <Snackbar open={barInfo.open} autoHideDuration={6000} onClose={handleClose}>
      <Alert
        onClose={handleClose}
        severity={barInfo.level}
        sx={{ width: '100%' }}
        variant="filled"
      >
        {barInfo.message}
      </Alert>
    </Snackbar>
  );
}

export { CustomSnackbar };
