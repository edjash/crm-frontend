import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import { Button, SxProps, Theme, useMediaQuery } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { EVENTS } from '../app/constants';
import { logout } from '../store/reducers/auth/authSlice';
import { useStoreDispatch } from '../store/store';

interface TopBarProps {
    sx?: SxProps,
    onNavToggleClick?: () => void,
}

export default function TopBar(props: TopBarProps) {

    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const dispatch = useStoreDispatch();

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <AppBar position="fixed" elevation={1} sx={{ ...props.sx }}>
            <Toolbar disableGutters sx={{ ml: 2, mr: 2 }}>
                <IconButton
                    color="inherit"
                    onClick={() => {
                        PubSub.publishSync(EVENTS.NAV_TOGGLECLICK);
                    }}
                    edge="start"
                    sx={{ mr: 2 }}
                    size="small"
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h5" sx={{ flexGrow: 1 }}>
                    Demo Company
                </Typography>
                <span className="spacer" />
                <div>
                    {!isMobile &&
                        <Button
                            variant="outlined"
                            onClick={handleLogout}
                            startIcon={<LogoutIcon />}>
                            Logout
                        </Button>
                    }
                </div>
            </Toolbar>
        </AppBar>
    );
}
