import Snackbar from '@material-ui/core/Snackbar';
import Slide from '@material-ui/core/Slide';
import Alert from '@material-ui/lab/Alert';
import { useEffect, useState } from 'react';

export type ToastConfig = {
  show: boolean;
  type?: 'info' | 'error' | 'success' | 'warning';
  list?: string[];
  message?: string;
  autoHide?: boolean;
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

  const onShowToast = (cfg: ToastConfig) => {
    cfg.show = true;
    setState({ ...state, ...cfg });
  };

  useEffect(() => {
    PubSub.subscribe('TOAST.SHOW', (msg, data) => {
      onShowToast(data);
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
      className="toast"
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      TransitionComponent={(props) => <Slide {...props} direction="down" />}
      autoHideDuration={state.autoHide ? 3000 : null}
    >
      <Alert elevation={6} variant="filled" severity={state.type}>
        {state.message}
        {ul}
      </Alert>
    </Snackbar>
  );
}
