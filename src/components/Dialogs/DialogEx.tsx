import CloseIcon from '@mui/icons-material/CancelOutlined';
import { Box, ButtonProps, IconButton, Tab, Tabs } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent, { DialogContentProps } from '@mui/material/DialogContent';
import DialogTitle, { DialogTitleProps } from '@mui/material/DialogTitle';
import clsx from 'clsx';
import { ReactNode, useEffect, useState } from 'react';
import { EVENTS } from '../../app/constants';
import DialogButton from '../DialogButton';
import { FormProps } from '../Form/Form';
import { TabLabelProps } from '../TabPanel';

interface DialogTabProps {
    tabs: TabLabelProps[];
    activeTab: number;
    onChange: (tab: number) => void;
    orientation?: 'horizontal' | 'vertical';
}

export interface DialogExProps {
    open: boolean;
    children?: ReactNode;
    onCancel?: () => void;
    onSave?: () => void;
    title?: string | JSX.Element;
    titleComponent?: JSX.Element;
    titleProps?: DialogTitleProps;
    hideCancelButton?: boolean;
    hideSaveButton?: boolean;
    hideActionButtons?: boolean;
    saveButtonText?: string;
    cancelButtonText?: string;
    displayMode?: 'mobile' | 'normal' | string;
    justifyActionButtons?:
    'flex-start' | 'flex-end' | 'center' |
    'space-between' | 'space-around' | 'space-evenly';
    actionButtonGap?: number;
    suppressGlobalCount?: boolean;
    disableRestoreFocus?: boolean;
    hideBackdrop?: boolean;
    transitionDuration?: number;
    tabProps?: DialogTabProps;
    formProps?: FormProps;
    contentProps?: DialogContentProps;
    saveButtonProps?: ButtonProps;
    cancelButtonProps?: ButtonProps;
    saveButtonComponent?: JSX.Element;
};

interface TabbedDialogContentProps {
    tabProps: DialogTabProps;
    contentProps?: DialogContentProps;
    children?: ReactNode;
}

const TabbedDialogContent = (props: TabbedDialogContentProps) => {
    const orientation = props.tabProps.orientation ?? 'horizontal';
    return (
        <div style={{
            display: 'flex',
            flexDirection: (orientation === 'horizontal') ? 'column' : 'row',
            overflow: 'hidden'
        }}>
            <Tabs
                orientation={orientation}
                value={props.tabProps.activeTab}
                onChange={(e, n) => {
                    if (props.tabProps?.onChange) {
                        props.tabProps.onChange(n);
                    }
                }}
            >
                {props.tabProps?.tabs && props.tabProps.tabs.map((tab: TabLabelProps) =>
                    <Tab
                        {...tab}
                        key={`tab${tab.value}`}
                    />
                )}
            </Tabs>
            <DialogContent
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    overflow: 'hidden',
                    p: 0
                }}
                {...props.contentProps}
            >
                {props.children}
            </DialogContent>
        </div>
    );
}

export default function DialogEx(props: DialogExProps) {
    const mode = props.displayMode ?? 'normal';
    const config = {
        ...props,
        title: props?.title ?? '',
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
            PubSub.publishSync(EVENTS.DIALOG_OPEN);
        } else {
            PubSub.publishSync(EVENTS.DIALOG_CLOSE);
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
            sx={{ p: 0 }}
            BackdropProps={{
                sx: { backdropFilter: 'blur(1px)' }
            }}
            transitionDuration={props.transitionDuration}
            hideBackdrop={props.hideBackdrop}
            className={clsx({ DialogEx: true, tabbedDialog: (props.tabProps) })}
        >
            {mode === 'normal' &&
                <Box sx={{
                    p: 0,
                    pl: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    {props.titleComponent
                        ? <div className="customDialogTitle">{props.titleComponent}</div>
                        : <DialogTitle {...props.titleProps}>
                            {config.title}
                        </DialogTitle>
                    }
                    {!props.hideCancelButton &&
                        <IconButton
                            aria-label="close"
                            onClick={onCancel}
                            className="closeButton"
                            sx={{
                                alignSelf: 'flex-start',
                                m: 0
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    }
                </Box>
            }
            {mode === 'mobile' &&
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
                >
                    {!props.hideCancelButton &&
                        <IconButton
                            aria-label="close"
                            onClick={onCancel}
                            sx={{
                                //alignSelf: 'flex-start',
                                m: 0
                            }}
                        >
                            <CloseIcon />
                        </IconButton>

                    }
                    {props.titleComponent
                        ? <div className="customDialogTitle">{props.titleComponent}</div>
                        : <DialogTitle {...props.titleProps}>
                            {config.title}
                        </DialogTitle>
                    }
                    <Box sx={{ pr: 1 }}>
                        {!props.hideSaveButton &&
                            <DialogButton onClick={onSave} {...props.saveButtonProps}>
                                Save
                            </DialogButton>
                        }
                    </Box>
                </Box>
            }
            {
                props?.tabProps
                    ? <TabbedDialogContent
                        contentProps={props.contentProps}
                        tabProps={props.tabProps}
                    >
                        {props.children}
                    </TabbedDialogContent>
                    : <DialogContent
                        sx={{ p: 1 }}
                        {...props.contentProps}
                    >
                        {props.children}
                    </DialogContent>
            }
            {
                mode === 'normal' && !props.hideActionButtons &&
                <DialogActions
                    sx={{
                        display: 'flex',
                        justifyContent: props.justifyActionButtons ?? 'flex-end',
                        gap: props.actionButtonGap ?? 0,
                    }}
                >
                    <DialogButton onClick={onCancel} {...props.cancelButtonProps}>
                        {props.cancelButtonText ?? 'Cancel'}
                    </DialogButton>
                    {props.saveButtonComponent
                        ? props.saveButtonComponent
                        : <DialogButton onClick={onSave} {...props.saveButtonProps}>
                            {props.saveButtonText ?? 'Save'}
                        </DialogButton>
                    }
                </DialogActions>
            }
        </Dialog >
    );
}
