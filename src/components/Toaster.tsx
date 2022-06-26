import { Alert } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import PubSub from 'pubsub-js';
import { useEffect, useState } from 'react';
import { EVENTS } from '../app/constants';

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
        const s1 = PubSub.subscribe(EVENTS.TOAST, (msg, data) => {
            if (typeof (data) === 'string') {
                data = { message: data };
            }

            setState(state => ({ ...state, ...data, show: true }));
        });

        return () => {
            PubSub.unsubscribe(s1);
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
