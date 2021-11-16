import Snackbar from '@material-ui/core/Snackbar';
import Slide from '@material-ui/core/Slide';
import Alert from '@material-ui/lab/Alert';

export interface ToastConfig {
  show: boolean;
  type?: 'info' | 'error' | 'success' | 'warning';
  list?: string[];
  message?: string;
  autoHide?: boolean;
  onClose?: () => void;
}

export default function Toast(cfg: ToastConfig) {
  let ul: JSX.Element = <></>;

  if (cfg?.list?.length) {
    const li = cfg.list.map((item, index) => <li key={index}>{item}</li>);
    ul = <ul>{li}</ul>;
  }

  return (
    <Snackbar
      open={cfg.show ?? true}
      onClose={cfg.onClose}
      className="toast"
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      TransitionComponent={(props) => <Slide {...props} direction="down" />}
      autoHideDuration={cfg.autoHide ? 3000 : null}
    >
      <Alert elevation={6} variant="filled" severity={cfg.type}>
        {cfg.message}
        {ul}
      </Alert>
    </Snackbar>
  );
}
