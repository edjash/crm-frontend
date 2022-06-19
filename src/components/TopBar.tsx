import LightModeIcon from '@mui/icons-material/Brightness4';
import DarkModeIcon from '@mui/icons-material/Brightness7';
import MenuIcon from '@mui/icons-material/Menu';
import { SxProps, useTheme } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { EVENTS } from '../app/constants';

interface TopBarProps {
    sx?: SxProps,
    onNavToggleClick?: () => void,
}

export default function TopBar(props: TopBarProps) {
    const theme = useTheme();

    return (
        <AppBar
            position="fixed"
            enableColorOnDark={true}
            elevation={1}
            sx={{
                backgroundColor: 'custom.appBarBackground',
                color: 'custom.appBarText',
                ...props.sx
            }}
        >
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
                    <IconButton
                        onClick={() => {
                            PubSub.publishSync(EVENTS.THEME_TOGGLE);
                        }}
                    >
                        {theme.palette.mode === 'dark'
                            ?
                            <DarkModeIcon />
                            :
                            <LightModeIcon />
                        }
                    </IconButton>
                </div>
            </Toolbar>
        </AppBar>
    );
}
