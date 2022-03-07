import { Alert } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import PubSub from 'pubsub-js';
import { useEffect, useState } from 'react';

export type ToastConfig = {
    show: boolean;
    type?: 'info' | 'error' | 'success' | 'warning';
    list?: string[];
    message?: string;
    autoHide?: boolean;
    marmite?: boolean;
    onClose?: () => void;
}

export default function Toast() {

    const [state, setState] = useState<ToastConfig>({
        show: false,
        type: 'info',
        list: [],
        message: "",
        autoHide: true,
    });

    let ul: JSX.Element = <></>;

    if (state?.list?.length) {
        const li = state.list.map((item, index) => <li key={index}>{item}</li>);
        ul = <ul>{li}</ul>;
    }

    useEffect(() => {
        PubSub.subscribe('TOAST.SHOW', (msg, data) => {
            data.show = true;
            setState(state => ({ ...state, ...data }));
        });

        return () => {
            PubSub.unsubscribe('TOAST');
        }
    }, []);

    const onClose = () => {
        setState({ ...state, show: false });
    }

    return (
        <Snackbar
            open={state.show}
            onClose={onClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            autoHideDuration={state.autoHide ? 3000 : null}
        >
            <Alert elevation={6} variant="filled" severity={state.type}>
                {state.message}
                {ul}
            </Alert>
        </Snackbar>
    );
}
