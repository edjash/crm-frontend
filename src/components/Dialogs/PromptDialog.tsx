import * as React from 'react';
import Button from '@mui/material/Button';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { ChangeEvent, useState } from 'react';

export type PromptProps = Omit<DialogProps, 'onExited'> & {
    open: boolean;
    title?: string;
    content?: string | JSX.Element | JSX.Element[];
    inputLabel?: string;
    inputValue?: string;
    inputProps?: TextFieldProps;
    confirmButtonText?: string;
    cancelButtonText?: string;
    onCancel?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onConfirm?: (inputValue: string) => void;
};


export default function PromptDialog(props: PromptProps) {
    const [state, setState] = useState({
        inputValue: props.inputValue ?? ''
    });

    const confirmButtonText = props.confirmButtonText ?? 'OK';
    const cancelButtonText = props.cancelButtonText ?? 'Cancel';

    const onConfirm = () => {
        if (props.onConfirm) {
            props.onConfirm(state.inputValue.trim());
        }
    }

    const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setState({
            ...state,
            inputValue: e.target.value
        });
    }

    return (
        <Dialog open={props.open} onClose={props.onCancel} disableRestoreFocus={true}>
            <DialogTitle>{props.title}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {props.content}
                </DialogContentText>
                <TextField
                    onChange={onInputChange}
                    {...props.inputProps}
                    label={props.inputLabel}
                    name="prompt"
                    defaultValue={props.inputValue}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onCancel} autoFocus>
                    {cancelButtonText}
                </Button>
                <Button onClick={onConfirm}>
                    {confirmButtonText}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
