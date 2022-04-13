import { useState } from 'react';
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
} from '@mui/material';

function AccountCard() {
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
    } else {
      if (!document.queryCommandSupported('copy')) {
        return alert('Clipboard is not supported. Please, check your browser.');
      }
    }
  };

  return (
    <Card sx={{ maxWidth: 360 }}>
      <CardActionArea onClick={handleClickOpen}>
        <CardMedia
          component="img"
          height="140"
          image="/logo/google_logo.jpeg"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div" color="primary">
            google
          </Typography>
          <Typography variant="body2" color="text.secondary">
            passwordStore@gmail.com
          </Typography>
        </CardContent>
      </CardActionArea>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="draggable-dialog-title"
        maxWidth="sm"
        fullWidth={true}
      >
        <DialogTitle id="draggable-dialog-title">Google Account</DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>passwordStore@gmail.com</Typography>
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

export { AccountCard };
