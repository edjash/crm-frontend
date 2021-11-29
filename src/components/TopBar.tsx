import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Popover from '@material-ui/core/Popover';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import PersonIcon from '@material-ui/icons/Person';
import { useAppContext } from '../app/AppContext';
import {
  usePopupState,
  bindTrigger,
  bindPopover,
} from 'material-ui-popup-state/hooks';
import PubSub from 'pubsub-js'

export default function TopBar() {
  const appContext = useAppContext();

  const accountMenuState = usePopupState({
    variant: 'popover',
    popupId: 'accountMenu',
  });

  const addMenuState = usePopupState({
    variant: 'popover',
    popupId: 'addMenu',
  });

  const handleLogout = () => {
    accountMenuState.close();
    appContext.setLoginStatus(false, '');
  };

  const handleCreateContact = () => {
    PubSub.publish('SHOW_EDIT_CONTACT');
  };

  return (
    <Box className="topBar">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h1" component="div">
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
    </Box>
  );
}
