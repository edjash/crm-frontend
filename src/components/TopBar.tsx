import AccountCircle from '@mui/icons-material/AccountCircle';
import PersonIcon from '@mui/icons-material/Person';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { SxProps, Theme, useMediaQuery } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Popover from '@mui/material/Popover';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {
  bindPopover, bindTrigger, usePopupState
} from 'material-ui-popup-state/hooks';
import MenuIcon from '@mui/icons-material/Menu';

interface TopBarProps {
  sx?: SxProps,
  onNavToggleClick?: () => void,
}

export default function TopBar(props: TopBarProps) {

  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  const accountMenuState = usePopupState({
    variant: 'popover',
    popupId: 'accountMenu',
  });

  const handleLogout = () => {
    accountMenuState.close();
    PubSub.publish('AUTH.LOGOUT');
  };

  return (
    <AppBar position="relative" elevation={1} sx={{ ...props.sx }}>
      <Toolbar disableGutters sx={{ ml: 2, mr: 2 }}>
        {isMobile &&
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={props.onNavToggleClick}
            edge="start"
            sx={{ mr: 2 }}
            size="small"
          >
            <MenuIcon />
          </IconButton>
        }
        <Typography variant="h5" sx={{ flexGrow: 1 }}>
          Demo Company
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
              <ListItem button onClick={accountMenuState.close} disabled={true}>
                <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
                <ListItemText primary="My Account" />
              </ListItem>
            </List>
          </Popover>
        </div>
      </Toolbar>
    </AppBar>
  );
}
