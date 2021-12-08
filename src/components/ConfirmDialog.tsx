import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

type ConfirmProps = Omit<DialogProps, 'onExited'> & {
  title?: string;
  content: string | JSX.Element | JSX.Element[];
  confirmButtonText?: string;
  cancelButtonText?: string;
  onCancel: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onConfirm: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export default function ConfirmDialog(props: ConfirmProps) {

  const title = props.title ?? 'Confirm';
  const confirmButtonText = props.confirmButtonText ?? 'OK';
  const cancelButtonText = props.cancelButtonText ?? 'Cancel';

  return (
    <Dialog open={props.open} onClose={props.onCancel} disableRestoreFocus={true}>
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {props.content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onCancel} autoFocus>
          {cancelButtonText}
        </Button>
        <Button onClick={props.onConfirm}>
          {confirmButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
