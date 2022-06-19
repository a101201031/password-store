import AssignmentIcon from '@mui/icons-material/Assignment';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';
import ListIcon from '@mui/icons-material/List';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import PeopleIcon from '@mui/icons-material/People';
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
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
      <ListItemButton>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Customers" />
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon>
          <BarChartIcon />
        </ListItemIcon>
        <ListItemText primary="Reports" />
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon>
          <LayersIcon />
        </ListItemIcon>
        <ListItemText primary="Integrations" />
      </ListItemButton>
    </>
  );
}

export const secondaryListItems = (
  <>
    <ListSubheader component="div" inset />
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Current month" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Last quarter" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="User setting" />
    </ListItemButton>
  </>
);

export { MainListItems };
