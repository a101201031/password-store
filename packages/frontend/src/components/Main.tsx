import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MenuIcon from '@mui/icons-material/Menu';
import {
  Box,
  CssBaseline,
  Divider,
  List,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import MuiDrawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import {
  AuthAsyncBoundary,
  CustomSnackbar,
  MainListItems,
  SignOut,
} from 'components';
import type { MouseEvent } from 'react';
import { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userInfoSltr } from 'store';

const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: 'border-box',
    ...(!open && {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

function Main() {
  const [open, setOpen] = useState(
    localStorage.getItem('navigatorOpen') === 'on' ? true : false,
  );

  const toggleDrawer = () => {
    setOpen(!open);
    localStorage.setItem('navigatorOpen', open ? 'off' : 'on');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="absolute" open={open}>
        <Toolbar
          sx={{
            pr: '24px',
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{
              marginRight: '36px',
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="secondary"
            noWrap
            sx={{ flexGrow: 1 }}
          >
            Password Store
          </Typography>
          <UserMenu />
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            px: [1],
          }}
        >
          <IconButton onClick={toggleDrawer}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        <List component="nav">
          <MainListItems />
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <Toolbar />
        <Outlet />
        <CustomSnackbar />
      </Box>
    </Box>
  );
}

function UserMenu() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSignOut, setIsSignOut] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isUserMenuOpen = !!anchorEl;

  const handleUserMenuOpen = (e: MouseEvent<HTMLElement>) => {
    isLoaded && setAnchorEl(e.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOutClick = () => {
    setIsSignOut(true);
  };

  function UserMenuItem() {
    const userInfo = useRecoilValue(userInfoSltr);
    useEffect(() => {
      setIsLoaded(true);
    }, []);
    return (
      <>
        <MenuItem
          sx={{ display: 'block' }}
          component={Link}
          to="/user"
          onClick={handleUserMenuClose}
        >
          <Typography variant="body2">Signed in as</Typography>
          <Typography variant="body1">{userInfo.user_name}</Typography>
        </MenuItem>
        <Divider />
        <MenuItem component={Link} to="/user" onClick={handleUserMenuClose}>
          Profile
        </MenuItem>
        <MenuItem onClick={handleSignOutClick}>Sign Out</MenuItem>
      </>
    );
  }

  return (
    <>
      <IconButton
        color="secondary"
        aria-label="account of current user"
        aria-controls="user-menu"
        aria-haspopup="true"
        onClick={handleUserMenuOpen}
      >
        <AccountCircleIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        id="user_menu"
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={isUserMenuOpen}
        onClose={handleUserMenuClose}
      >
        <AuthAsyncBoundary suspenseFallback={<></>}>
          <UserMenuItem />
        </AuthAsyncBoundary>
      </Menu>
      {isSignOut && <SignOut />}
    </>
  );
}

export { Main };
