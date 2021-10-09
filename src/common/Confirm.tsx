import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export interface IEdDialogButton {
  id: string;
  text: string;
  onClick: () => void;
}

export interface IEdDialog {
  show: boolean;
  title: string;
  content: JSX.Element;
  buttons?: 'OKCANCEL' | 'OK';
  buttonTextOk?: string;
  buttonTextCancel?: string;
  onClose?: () => void;
}

export default function EdDialog(cfg: IEdDialog) {
  const [state, setState] = React.useState<IEdDialog>(cfg);

  const handleClose = () => {
    setState({ ...state, show: false });
  };

  let buttons = [];

  if (cfg.buttons === 'OKCANCEL') {
  }

  return (
    <div>
      <Dialog open={state.show} onClose={handleClose}>
        <DialogTitle id="alert-dialog-title">{cfg.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {cfg.content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Disagree
          </Button>
          <Button onClick={handleClose} color="primary" autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
