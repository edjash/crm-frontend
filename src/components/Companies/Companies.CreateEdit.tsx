import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';

type CreateEditProps = DialogProps & {
    type: string,
    onCancel: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onConfirm: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export default function CompaniesCreateEdit(props: CreateEditProps) {

    const title = "New Company";

    return (
        <Dialog
            open={props.open}
            onClose={props.onClose}
        >
            <DialogTitle id="responsive-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Lorem Ipsum
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button autoFocus color="primary" onClick={props.onCancel}>
                    Cancel
                </Button>
                <Button color="primary" autoFocus onClick={props.onConfirm}>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}
