import CloseIcon from '@mui/icons-material/CancelOutlined';
import { Box, IconButton } from '@mui/material';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';
import DialogButton from '../DialogButton';

export type DialogExProps = Omit<DialogProps, 'onExited'> & {
    open: boolean;
    title?: string;
    closeIcon?: boolean;
    onCancel?: () => void;
    onSave?: () => void;
    displayMode?: 'mobile' | 'normal' | string;
};


export default function DialogEx(props: DialogExProps) {
    const mode = props.displayMode ?? 'normal';

    const config = {
        ...props,
        title: props?.title ?? '',
        closeIcon: props?.closeIcon ?? true,
        disableRestoreFocus: props?.disableRestoreFocus ?? true,
        fullScreen: (mode === 'mobile') ? true : false,
    };

    const [state, setState] = useState({
        open: props.open,
    });

    const onCancel = () => {
        setState(state => ({
            ...state,
            open: false,
        }));
        if (props.onCancel) {
            props.onCancel();
        }
    };

    const onSave = () => {
        if (props.onSave) {
            props.onSave();
        }
    };

    return (
        <Dialog
            open={state.open}
            onClose={onCancel}
            disableRestoreFocus={config.disableRestoreFocus}
            fullScreen={config.fullScreen}
            scroll="paper"
            maxWidth="md"
            fullWidth={true}
        >
            {mode === 'normal' && (config.title || config.closeIcon) &&
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <DialogTitle sx={{ flexGrow: 1 }}>
                        {config.title}
                    </DialogTitle>
                    {config.closeIcon &&
                        <IconButton aria-label="close" onClick={onCancel} className="closeButton">
                            <CloseIcon />
                        </IconButton>
                    }
                </Box>
            }
            {mode === 'mobile' && (config.title || config.closeIcon) &&
                <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pr: 2 }}>
                    {config.closeIcon &&
                        <IconButton
                            aria-label="close"
                            onClick={onCancel}
                        >
                            <CloseIcon />
                        </IconButton>
                    }
                    <DialogTitle sx={{ flexGrow: 1 }}>
                        {config.title}
                    </DialogTitle>
                    <DialogButton onClick={onSave}>
                        Save
                    </DialogButton>
                </Box>
            }
            <DialogContent>
                {props.children}
            </DialogContent>
            {mode === 'normal' &&
                <DialogActions>
                    <DialogButton onClick={onCancel}>
                        Cancel
                    </DialogButton>
                    <DialogButton onClick={onSave}>
                        Save
                    </DialogButton>
                </DialogActions>
            }
        </Dialog>
    );
}
