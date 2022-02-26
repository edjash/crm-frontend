import { Box, DialogContentText, Typography } from '@mui/material';
import Dialog, { DialogProps as DialogProps } from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import EnterPassword from '../../routes/Login/EnterPassword';
import apiClient from '../apiClient';

type SessionExpiredProps = Omit<DialogProps, 'onExited'> & {
    open: boolean;
    userInfo: Record<string, string> | null;
};

export default function SesssionExpiredDialog(props: SessionExpiredProps) {

    if (!props.userInfo) {
        console.warn("userInfo prop of SessionExpiredDialog was null");
        // PubSub.publish('AUTH.LOGOUT');
        return <></>;
    }

    const onSubmit = (data: any) => {
        localStorage.removeItem('userInfo');

        apiClient.post('/login', data, false)
            .then((response) => {
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
            open={props.open}
            disableRestoreFocus={true}
            BackdropProps={{
                sx: { backdropFilter: 'blur(5px)' }
            }}
            sx={{ width: 500, margin: '0 auto' }}
        >
            <DialogTitle>Enter Password</DialogTitle>
            <DialogContent>
                <DialogContentText mb={2}>
                    Your session has expired due to inactivity, please enter your password to login.
                </DialogContentText>
                <EnterPassword email={props.userInfo.email} onSubmit={onSubmit} />
            </DialogContent>
        </ Dialog>
    );
}

