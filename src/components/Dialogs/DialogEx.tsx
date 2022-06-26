import CloseIcon from '@mui/icons-material/CancelOutlined';
import MinimiseIcon from '@mui/icons-material/Minimize';
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
    activeTab: number | undefined;
    onChange: (tab: number) => void;
    orientation?: 'horizontal' | 'vertical';
}

export interface DialogExProps {
    open: boolean;
    children?: ReactNode;
    onCancel?: () => void;
    onSave?: () => void;
    onMinimise?: () => void;
    title?: string | JSX.Element;
    titleComponent?: JSX.Element;
    titleProps?: DialogTitleProps;
    hideCancelButton?: boolean;
    hideSaveButton?: boolean;
    hideActionButtons?: boolean;
    disableCancelButton?: boolean;
    disableSaveButton?: boolean;
    showMinimize?: boolean;
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
    className?: string;
    id?: string;
};

interface TabbedDialogContentProps {
    tabProps: DialogTabProps;
    contentProps?: DialogContentProps;
    children?: ReactNode;
}

const TabbedDialogContent = (props: TabbedDialogContentProps) => {
    const orientation = props.tabProps.orientation ?? 'horizontal';
    const tabs = props.tabProps?.tabs ?? [];

    return (
        <div style={{
            display: 'flex',
            flexDirection: (orientation === 'horizontal') ? 'column' : 'row',
            overflow: 'hidden'
        }}>
            <Tabs
                orientation={orientation}
                value={props.tabProps.activeTab}
                variant="scrollable"
                scrollButtons="auto"
                onChange={(e, n) => {
                    if (props.tabProps?.onChange) {
                        props.tabProps.onChange(n);
                    }
                }}
            >
                {tabs.map((tab: TabLabelProps) =>
                    <Tab
                        {...tab}
                        key={`tab${tab.value}`}
                        sx={{
                            textAlign: 'right',
                            alignItems: 'flex-end'
                        }}
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
        setState(state => ({
            open: props.open
        }));
    }, [props.open]);

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
            id={props.id}
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
            className={clsx(props.className, { DialogEx: true, tabbedDialog: (props.tabProps) })}
        >
            {mode === 'normal' &&
                <Box sx={{
                    p: 0,
                    pl: 1,
                    display: 'flex'

                }}>
                    {props.titleComponent
                        ? <div className="customDialogTitle">{props.titleComponent}</div>
                        : <DialogTitle {...props.titleProps}>
                            {config.title}
                        </DialogTitle>
                    }
                    <Box flexGrow={1} display="flex" justifyContent="right" alignItems="baseline">
                        {props.showMinimize &&
                            <IconButton
                                aria-label="minimise"
                                onClick={props.onMinimise}
                                sx={{
                                    //alignSelf: 'flex-start',
                                    m: 0
                                }}
                            >
                                <MinimiseIcon />
                            </IconButton>
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
                                disabled={props.disableCancelButton}
                            >
                                <CloseIcon />
                            </IconButton>
                        }
                    </Box>
                </Box>
            }
            {
                mode === 'mobile' &&
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
                            disabled={props.disableCancelButton}
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
                            <DialogButton
                                onClick={onSave}
                                {...props.saveButtonProps}
                                disabled={props.disableSaveButton}
                            >
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
                    <DialogButton onClick={onCancel} {...props.cancelButtonProps} disabled={props.disableCancelButton}>
                        {props.cancelButtonText ?? 'Cancel'}
                    </DialogButton>
                    {props.saveButtonComponent
                        ? props.saveButtonComponent
                        : <DialogButton onClick={onSave} {...props.saveButtonProps} disabled={props.disableSaveButton}>
                            {props.saveButtonText ?? 'Save'}
                        </DialogButton>
                    }
                </DialogActions>
            }
        </Dialog >
    );
}
