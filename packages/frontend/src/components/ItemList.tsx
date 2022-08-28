import GroupIcon from '@mui/icons-material/Group';
import ListIcon from '@mui/icons-material/List';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SvgIcon,
  Typography,
} from '@mui/material';
import type { LinkProps } from 'react-router-dom';
import { Link, useMatch, useResolvedPath } from 'react-router-dom';
import { theme } from 'theme';

interface CustomLinkProps extends LinkProps {
  primary: string;
}

function CustomLink({ children, to, primary, ...props }: CustomLinkProps) {
  const activatedColor = theme.palette.primary.main;
  const resolved = useResolvedPath(to);
  const match = useMatch({ path: resolved.pathname, end: true });

  return (
    <ListItemButton component={Link} to={to} {...props} selected={!!match}>
      <ListItemIcon>
        <SvgIcon color={match ? 'primary' : 'inherit'}>{children}</SvgIcon>
      </ListItemIcon>
      <ListItemText
        disableTypography
        primary={
          <Typography color={match ? activatedColor : 'inherit'}>
            {primary}
          </Typography>
        }
      />
    </ListItemButton>
  );
}

function MainListItems() {
  return (
    <>
      <CustomLink to="/" primary="Show Password">
        <LockOpenIcon />
      </CustomLink>
      <CustomLink to="/accounts" primary="Account List">
        <ListIcon />
      </CustomLink>
      <CustomLink to="/groups" primary="Group List">
        <GroupIcon />
      </CustomLink>
    </>
  );
}

export { MainListItems };
