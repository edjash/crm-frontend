import { useContext } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { useAppContext } from '../app/AppContext';
import {
  usePopupState,
  bindTrigger,
  bindMenu,
} from 'material-ui-popup-state/hooks';

export default function TopBar() {
  const appContext = useAppContext();

  const popupState = usePopupState({
    variant: 'popover',
    popupId: 'accountMenu',
  });

  const handleMenuClose = () => {};
  const handleLogout = () => {
    popupState.close();
    appContext.setLoginStatus(false, '');
  };

  return (
    <Box className="topBar">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h1" component="div">
            Ed CRM
          </Typography>
          <span />
          <div>
            <Button>Create Contact</Button>

            <div className="accountMenu">
              <IconButton {...bindTrigger(popupState)}>
                <AccountCircle />
              </IconButton>
              <Menu {...bindMenu(popupState)} className="accountMenu">
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                <MenuItem onClick={popupState.close}>My account</MenuItem>
              </Menu>
            </div>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
