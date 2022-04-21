import CloseIcon from '@mui/icons-material/CancelOutlined';
import { Box, IconButton, Tabs, Tab } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { ReactNode, useEffect, useState } from 'react';
import DialogButton from '../DialogButton';
import Form, { FormProps } from '../Form/Form';

interface DialogTabProps {
    tabs: string[];
    activeTab: number;
    onChange: (tab: number) => void;
}

export interface DialogExProps {
    open: boolean;
    title?: string | JSX.Element;
    closeIcon?: boolean;
    onCancel?: () => void;
    onSave?: () => void;
    displayMode?: 'mobile' | 'normal' | string;
    saveButtonProps?: Record<string, any>;
    suppressGlobalCount?: boolean;
    disableRestoreFocus?: boolean;
    hideBackdrop?: boolean;
    transitionDuration?: number;
    children?: ReactNode;
    tabProps?: DialogTabProps;
    formProps?: FormProps;
};

interface TabbedDialogContentProps {
    tabProps: DialogTabProps;
    children?: ReactNode;
}

const TabbedDialogContent = (props: TabbedDialogContentProps) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
        }}>
            <Tabs
                orientation="horizontal"
                value={props.tabProps.activeTab}
                onChange={(e, n) => {
                    if (props.tabProps?.onChange) {
                        props.tabProps.onChange(n);
                    }
                }}
            >
                {props.tabProps?.tabs && props.tabProps.tabs.map((label: string, index: number) =>
                    <Tab label={label} value={index} key={index} />
                )}
            </Tabs>
            <DialogContent sx={{ overflow: 'auto' }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start'
                }}>
                    {props.children}
                </div>
            </DialogContent>
        </div>
    );
}

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

    useEffect(() => {
        if (props.suppressGlobalCount) {
            return;
        }

        if (state.open) {
            PubSub.publishSync('DIALOG.OPEN');
        } else {
            PubSub.publishSync('DIALOG.CLOSE');
        }

    }, [state.open, props.suppressGlobalCount]);

    return (
        <Dialog
            open={state.open}
            onClose={onCancel}
            disableRestoreFocus={config.disableRestoreFocus}
            fullScreen={config.fullScreen}
            scroll="paper"
            maxWidth="xl"
            sx={{
                p: 0,
            }}
            BackdropProps={{
                sx: { backdropFilter: 'blur(1px)' }
            }}
            transitionDuration={props.transitionDuration}
            hideBackdrop={props.hideBackdrop}
        >
            {mode === 'normal' && config.title &&
                <Box sx={{ display: 'flex', alignItems: 'center', pr: 1 }}>
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
            {mode === 'mobile' && config.title &&
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
                    <DialogButton onClick={onSave} {...props.saveButtonProps}>
                        Save
                    </DialogButton>
                </Box>
            }
            {props?.tabProps
                ? <TabbedDialogContent tabProps={props.tabProps}>{props.children}</TabbedDialogContent>
                : <DialogContent>{props.children}</DialogContent>
            }
            {mode === 'normal' &&
                <DialogActions>
                    <DialogButton onClick={onCancel}>
                        Cancel
                    </DialogButton>
                    <DialogButton onClick={onSave} {...props.saveButtonProps}>
                        Save
                    </DialogButton>
                </DialogActions>
            }
        </Dialog>
    );
}
