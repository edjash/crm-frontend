import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { Container } from '@mui/material';

interface AuthPageProps {
    title: string;
    isLoading: boolean;
    children: React.ReactNode;
    onIconClick?: () => void;
}

export default function AuthPage(props: AuthPageProps) {
    return (
        <Container sx={{ display: 'flex', height: '100vh', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <Box sx={{ mt: -20, width: 500 }}>
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
            <Backdrop className="backdrop" open={props.isLoading}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </Container>
    );
}
