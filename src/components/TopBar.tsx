import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Popover from '@mui/material/Popover';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import PersonIcon from '@mui/icons-material/Person';
import { useAppContext } from '../app/AppContext';
import {
  usePopupState,
  bindTrigger,
  bindPopover,
} from 'material-ui-popup-state/hooks';
import { styled } from '@mui/material';

export const navWidth = 240;

export type TopBarProps = {
  navOpen: boolean;
  onNavBurgerClick: () => void;
};

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
    marginLeft: navWidth,
    width: `calc(100% - ${navWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default function TopBar(props: TopBarProps) {
  const appContext = useAppContext();

  const accountMenuState = usePopupState({
    variant: 'popover',
    popupId: 'accountMenu',
  });

  const handleLogout = () => {
    accountMenuState.close();
    appContext.setLoginStatus(false, '');
  };

  return (
    <MuiAppBar position="fixed" elevation={1}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={props.onNavBurgerClick}
          edge="start"
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h5" sx={{ flexGrow: 1 }}>
          Ed CRM
        </Typography>
        <span className="spacer" />
        <div>
          <IconButton {...bindTrigger(accountMenuState)}>
            <AccountCircle />
          </IconButton>
          <Popover
            {...bindPopover(accountMenuState)}
            anchorOrigin={{ vertical: 'center', horizontal: 'right', }}
            transformOrigin={{ vertical: 'top', horizontal: 'right', }}
          >
            <List dense={true} className="menuList">
              <ListItem button onClick={handleLogout}>
                <ListItemIcon><PowerSettingsNewIcon fontSize="small" /></ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItem>
              <ListItem button onClick={accountMenuState.close}>
                <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
                <ListItemText primary="My Account" />
              </ListItem>
            </List>
          </Popover>
        </div>
      </Toolbar>
    </MuiAppBar>
  );
}
