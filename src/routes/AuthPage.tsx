import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { Container, IconButton, useTheme } from '@mui/material';
import LightModeIcon from '@mui/icons-material/Brightness4';
import DarkModeIcon from '@mui/icons-material/Brightness7';
import { EVENTS } from '../app/constants';

interface AuthPageProps {
    title: string;
    isLoading: boolean;
    children: React.ReactNode;
    onIconClick?: () => void;
}

export default function AuthPage(props: AuthPageProps) {
    const theme = useTheme();

    return (
        <Container sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            width: '100%',
            justifyContent: 'space-around',
            alignItems: 'center'
        }}>
            <Box width="100%" maxWidth={500}>
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', mb: 3 }}>
                    <Avatar onClick={props.onIconClick}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        {props.title}
                    </Typography>
                </Box>
                {props.children}
            </Box>
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
            <Backdrop className="backdrop" open={props.isLoading}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </Container>
    );
}
