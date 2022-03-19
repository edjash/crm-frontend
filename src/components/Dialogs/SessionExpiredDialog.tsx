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

    const [open, showDialog] = useState(false);
    const appContext = useAppContext();

    useEffect(() => {
        const sessionTimer = setInterval(() => {
            if (!csrfCookieExists()) {
                if (!appContext.dialogsOpen) {
                    PubSub.publishSync('AUTH.LOGOUT');
                    return;
                } else {
                    showDialog(true);
                }
            }
        }, 1000);

        const s1 = PubSub.subscribe('AUTH.TIMEOUT', () => {
            showDialog(true);
        });

        return () => {
            clearInterval(sessionTimer);
            PubSub.unsubscribe(s1);
        }
    }, [appContext.dialogsOpen]);

    const email = appContext?.userInfo?.email || '';

    const onSubmit = (data: any) => {
        apiClient.post('/login', data, { url: '/login' })
            .then((response) => {
                showDialog(false);
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
            open={open}
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

