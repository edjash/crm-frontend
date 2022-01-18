import AppBar from '@mui/material/AppBar';
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

export default function TopBar() {
  const appContext = useAppContext();

  const accountMenuState = usePopupState({
    variant: 'popover',
    popupId: 'accountMenu',
  });

  const handleLogout = () => {
    accountMenuState.close();
    appContext.setLoginStatus(false, '');
  };

  const onNavBurgerClick = () => {
    PubSub.publishSync('NAV.BURGERCLICK');
  }

  return (
    <AppBar position="fixed" elevation={1}>
      <Toolbar disableGutters sx={{ml:2, mr: 2}}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={onNavBurgerClick}
          edge="start"
          sx={{ mr: 2 }}
          size="small"
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
    </AppBar>
  );
}
