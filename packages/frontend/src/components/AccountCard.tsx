import {
  Backdrop,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
} from '@mui/material';
import { AuthAsyncBoundary } from 'components';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { passwordSltr, snackbarAtom } from 'store';

interface AccountCardProps {
  serviceName: string;
  serviceAccount: string;
  aid: string;
}

function AccountCard(props: AccountCardProps) {
  const { serviceName, serviceAccount, aid } = props;
  const [open, setOpen] = useState(false);
  const handleOpenClick = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const AccountDialog = () => {
    const passwordInfo = useRecoilValue(passwordSltr({ aid }));
    const setSnackbar = useSetRecoilState(snackbarAtom);
    const [show, setShow] = useState(false);

    const handleCopyClick = () => {
      if (navigator.clipboard) {
        navigator.clipboard
          .writeText(passwordInfo.password)
          .then(() => {
            setSnackbar({
              open: true,
              level: 'success',
              message: 'Copied to clipboard.',
            });
          })
          .catch(() => {
            setSnackbar({
              open: true,
              level: 'error',
              message: 'Failed to copy.',
            });
          });
      }
    };

    useEffect(() => {
      setTimeout(() => {
        setShow(false);
      }, 5000);
    }, [show]);

    const handleShowClick = () => {
      setShow(true);
    };

    return (
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth={true}>
        <DialogTitle>{serviceName} Account</DialogTitle>
        <DialogContent dividers>
          {passwordInfo.authentication !== 'standalone' && (
            <Typography
              gutterBottom
            >{`Base Auth: ${passwordInfo.authentication}`}</Typography>
          )}
          <Typography gutterBottom>{`Account: ${serviceAccount}`}</Typography>
          <Typography
            gutterBottom
            display="inline-block"
          >{`Password: `}</Typography>
          {show && (
            <Typography gutterBottom display="inline-block">
              {passwordInfo.password}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCopyClick}>
            Copy
          </Button>
          <Button autoFocus onClick={handleShowClick}>
            Show
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Card sx={{ maxWidth: 360 }}>
      <CardActionArea onClick={handleOpenClick}>
        <CardMedia
          component="img"
          height="120px"
          image="/logo/google_logo.jpeg"
        />
        <CardContent>
          <Divider />
          <Typography gutterBottom variant="h5" component="div" color="primary">
            {serviceName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {serviceAccount}
          </Typography>
        </CardContent>
      </CardActionArea>
      <AuthAsyncBoundary
        suspenseFallback={
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open}
          >
            <CircularProgress />
          </Backdrop>
        }
      >
        {open && <AccountDialog />}
      </AuthAsyncBoundary>
    </Card>
  );
}

function AccountEditCard(props: AccountCardProps) {
  const { serviceName, serviceAccount, aid } = props;

  return (
    <Card sx={{ maxWidth: 360 }}>
      <CardActionArea component={Link} to={`/account/${aid}`}>
        <CardMedia
          component="img"
          height="120px"
          image="/logo/google_logo.jpeg"
        />
        <CardContent>
          <Divider />
          <Typography gutterBottom variant="h5" component="div" color="primary">
            {serviceName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {serviceAccount}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export { AccountCard, AccountEditCard };
