import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface AccountCardProps {
  serviceName: string;
  serviceAccount: string;
  aid: string;
}

function AccountCard(props: AccountCardProps) {
  const { serviceName, serviceAccount } = props;
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleClickCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText('password')
        .then(() => {
          alert('Copied to clipboard.');
        })
        .catch(() => {
          alert('Failed to copy.');
        });
    }
  };

  return (
    <Card sx={{ maxWidth: 360 }}>
      <CardActionArea onClick={handleClickOpen}>
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
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth={true}>
        <DialogTitle>{serviceName} Account</DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>{serviceAccount}</Typography>
          <Typography gutterBottom>Show Password</Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClickCopy}>
            Copy
          </Button>
        </DialogActions>
      </Dialog>
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
