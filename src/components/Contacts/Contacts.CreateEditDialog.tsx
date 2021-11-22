import Button from '@material-ui/core/Button';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

type CreateEditProps = Omit<DialogProps, 'onExited'> & {
    title?: string;
    content: string | JSX.Element | JSX.Element[];
    confirmButtonText?: string;
    cancelButtonText?: string;
    onCancel: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onConfirm: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export default function ContactCreateEditDialog(props: CreateEditProps) {

    const title = props.title ?? 'Confirm';
    const confirmButtonText = props.confirmButtonText ?? 'OK';
    const cancelButtonText = props.cancelButtonText ?? 'Cancel';

    return (
        <Dialog open={props.open} onClose={props.onCancel} disableRestoreFocus={true}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>
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
