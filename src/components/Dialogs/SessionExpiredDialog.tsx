import { Box, DialogContentText } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect, useState } from 'react';
import { useAppContext } from '../../app/AppContext';
import Link from '../../components/Link';
import EnterPassword from '../../routes/Login/EnterPassword';
import apiClient, { csrfCookieExists } from '../apiClient';

export default function SesssionExpiredDialog() {

    const [sessionExpired, setSessionExpired] = useState(false);
    const appContext = useAppContext();

    useEffect(() => {
        const sessionTimer = setInterval(() => {
            if (!csrfCookieExists()) {
                setSessionExpired(true);
            }
        }, 1000);

        const timeoutToken = PubSub.subscribe('AUTH.TIMEOUT', () => {
            setSessionExpired(true);
        });

        return () => {
            clearInterval(sessionTimer);
            PubSub.unsubscribe(timeoutToken);
        }
    }, []);

    if (!sessionExpired || !appContext.userInfo) {
        return <></>;
    }

    const email = appContext.userInfo.email;

    const onSubmit = (data: any) => {
        apiClient.post('/login', data, { url: '/login' })
            .then((response) => {
                setSessionExpired(false);
                PubSub.publishSync('AUTH.LOGIN', {
                    userInfo: response.data.user,
                });
            })
            .catch((response) => {
                //apiClient.showErrors(response, formMethods.setError);
            });
    };

    return (
        <Dialog
            open={true}
            disableRestoreFocus={true}
            BackdropProps={{
                sx: { backdropFilter: 'blur(5px)' }
            }}
            sx={{ margin: '0 auto' }}
        >
            <DialogTitle>Enter Password</DialogTitle>
            <DialogContent>
                <DialogContentText mb={2}>
                    Your session has expired due to inactivity.
                    <br />Please enter your password to resume your session.
                </DialogContentText>
                <EnterPassword email={email} onSubmit={onSubmit} />
            </DialogContent>
            <Box display="flex" justifyContent="right" m={1}>
                <Link to="/login">
                    Go to main login screen
                </Link>
            </Box>
        </Dialog>
    );
}

