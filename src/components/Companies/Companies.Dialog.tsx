import { Box, DialogTitle, Theme, useMediaQuery } from '@mui/material';
import clsx from 'clsx';
import { uniqueId } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { EVENTS } from '../../app/constants';
import { windowMinimized, windowOpened } from '../../store/reducers/windowSlice';
import { useStoreSelector } from '../../store/store';
import companySchema from '../../validation/companySchema';
import apiClient from '../apiClient';
import DialogEx from '../Dialogs/DialogEx';
import CountrySelect from '../Form/CountrySelect';
import Fieldset from '../Form/Fieldset';
import Form from '../Form/Form';
import IndustrySelect from '../Form/IndustrySelect';
import MultiFieldset from '../Form/MultiFieldset';
import ProfileAvatar from '../Form/ProfileAvatar';
import TextFieldEx from '../Form/TextFieldEx';
import NotesTab from '../NotesTab';
import Overlay from '../Overlay';
import SocialIcon from '../SocialIcon';
import GeneralTab from './GeneralTab';

export interface CompanyDialogData {
    id: number;
    name: string;
    avatar?: string;
};

export interface CompanyDialogProps {
    mode: 'new' | 'edit',
    data?: CompanyDialogData,
    onCancel?: () => void;
    onSave?: (success: boolean, data: Record<string, any>) => void;
    noAnimation?: boolean;
    hideBackdrop?: boolean;
};

interface CompanyDialogState {
    loading: boolean;
    ready: boolean;
    open: boolean;
    mode: 'new' | 'edit',
    contactId?: number;
    minimise: boolean;
    defaultValues: Record<string, any>;
    activeTab: number;
    windowId: string;
}

interface TitleProps extends CompanyDialogProps {
    isDesktop: boolean;
    avatar?: string;
}

const Title = (props: TitleProps) => {

    const isDesktop = props.isDesktop;
    let title = props.data?.name ?? 'Unnamed';
    if (props.mode === 'new') {
        title = 'New Company';
    }

    return (
        <Box display="flex" alignItems="center" gap={isDesktop ? 2 : 1} p={isDesktop ? 2 : 0}>
            {isDesktop &&
                <ProfileAvatar
                    name="avatar"
                    filename={props.avatar}
                    sx={{ justifySelf: "left" }}
                    variant="squircle"
                />
            }
            <DialogTitle>
                {title}
            </DialogTitle>
        </Box>
    );
}

const prepareOutgoingValues = (values: Record<string, any>) => {
    if (values.address) {
        values.address =
            values.address.map((item: Record<string, any>) => {
                if (item.country && typeof item.country === 'object') {
                    item.country = item.country.code;
                }
                return item;
            });
    }

    values.industry_id = values?.industry?.id || null;
    return values;
}

const prepareIncomingValues = (values: Record<string, any>) => {
    values.social_media_url.forEach((item: Record<string, string>) => {
        values[`socialmedia.${item.ident}`] = item.url;
    });
    delete values['social_media_url'];

    values.address =
        values.address.map((addr: Record<string, any>) => {
            if (addr?.country_code && addr?.country_name) {
                addr.country = {
                    code: addr?.country_code,
                    name: addr?.country_name,
                };
            } else {
                addr.country = null;
            }
            return addr;
        });

    return values;
}

export default function CompanyDialog(props: CompanyDialogProps) {

    const [state, setState] = useState<CompanyDialogState>({
        loading: false,
        ready: (props.mode === 'new'),
        open: true,
        mode: props.mode,
        minimise: false,
        defaultValues: {},
        activeTab: 0,
        contactId: props.data?.id,
        windowId: 'company_' + props.data?.id,
    });

    const dispatch = useDispatch();
    const activeWindow = useStoreSelector(state => state.windows.active);
    const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
    const formId = useRef(uniqueId('companyForm'));
    const closeWindow = props.onCancel;

    useEffect(() => {
        if (props.mode === 'edit' && !state.ready) {
            apiClient.get(`/companies/${props.data?.id}`).then((response) => {
                if (!state.open) {
                    return;
                }
                const values = prepareIncomingValues(response.data);

                setState((state) => ({
                    ...state,
                    open: true,
                    defaultValues: values,
                    ready: true,
                }));
            }).catch((error) => {

            });
        }
    }, [
        state.ready,
        state.open,
        props.mode,
        props.data?.id
    ]);

    useEffect(() => {
        if (activeWindow && activeWindow === state.windowId) {
            setState(state => ({
                ...state,
                minimise: false,
            }));
        }
    }, [activeWindow, state.windowId]);

    useEffect(() => {
        if (!state.ready) {
            return;
        }
        const s1 = PubSub.subscribe(EVENTS.WINDOW_RESTORE, (e, data: string) => {
            if (data === state.windowId) {
                setState(state => ({
                    ...state,
                    minimise: false,
                }));
            }
        });

        const s2 = PubSub.subscribe(EVENTS.WINDOW_CLOSE, (e, windowId: string) => {
            if (windowId === state.windowId && state.windowId && closeWindow) {
                closeWindow();
            }
        });

        dispatch(windowOpened({
            image: props.data?.avatar,
            text: props.data?.name,
            windowId: state.windowId,
        }));

        return () => {
            PubSub.unsubscribe(s1);
            PubSub.unsubscribe(s2);
        }

    }, [
        state.ready,
        dispatch,
        closeWindow,
        props.data?.avatar,
        props.data?.name,
        state.windowId
    ]);

    const onSubmit = (data: any) => {

        setState({ ...state, loading: true });

        data = prepareOutgoingValues(data);

        let url = '/companies';
        if (props.mode === 'edit' && props.data?.id) {
            url = `${url}/${props.data.id}`;
        }

        apiClient.post(url, data)
            .then((response) => {
                setState({ ...state, loading: false });
                if (props.onSave) {
                    props.onSave(true, response.data);
                }
                if (props.mode === 'edit') {
                    PubSub.publish(EVENTS.COMPANIES_REFRESH);
                } else {
                    PubSub.publish(EVENTS.TOAST, {
                        message: 'Company Added',
                        autoHide: true,
                    });
                    PubSub.publish(EVENTS.COMPANIES_REFRESH);
                }

            }).catch((response) => {
                setState({ ...state, loading: false });
                if (props.onSave) {
                    props.onSave(false, response);
                }
                // apiClient.showErrors(response, formMethods.setError);
            });
    }

    const onError = (data: any) => {
        console.log("Validation Error", data);
    };

    const onMinimise = () => {
        setState(state => ({
            ...state,
            minimise: true
        }));
        dispatch(windowMinimized(state.windowId));
    }

    let extraProps: Record<string, any> = {};
    if (props.noAnimation) {
        extraProps['transitionDuration'] = 0;
    }
    if (props.hideBackdrop) {
        extraProps['hideBackdrop'] = true;
    }

    const ready = ((props.mode === 'edit' && state.ready) || props.mode === 'new');

    return (
        <Form
            onSubmit={onSubmit}
            onError={onError}
            defaultValues={state.defaultValues}
            validationSchema={companySchema}
            id={formId.current}
        >
            <DialogEx
                id={state.windowId}
                open={state.open}
                onCancel={props.onCancel}
                showMinimize={true}
                onMinimise={onMinimise}
                className={clsx({ skeletons: !ready, windowMinimise: state.minimise })}
                displayMode={isDesktop ? 'normal' : 'mobile'}
                titleComponent={<Title {...props} isDesktop={isDesktop} avatar={props.data?.avatar} />}
                saveButtonProps={{
                    type: 'submit',
                    form: formId.current,
                    disabled: !ready,
                }}
                {...extraProps}
                tabProps={{
                    tabs: [
                        { label: 'General', value: 0 },
                        { label: 'Notes', value: 1, disabled: false },
                        // { label: 'Lead Info', value: 2, disabled: true },
                        // { label: 'Relationships', value: 3, disabled: true },
                        // { label: 'Activity', value: 4, disabled: true },
                    ],
                    activeTab: state.activeTab,
                    orientation: (isDesktop) ? 'vertical' : 'horizontal',
                    onChange: (tab: number) => {
                        setState(state => ({
                            ...state,
                            activeTab: tab
                        }));
                    }
                }}
            >
                <GeneralTab
                    value={0}
                    isActive={(state.activeTab === 0)}
                    isDesktop={isDesktop}
                    data={props.data}
                />
                {state.mode === 'edit' && state.contactId &&
                    <NotesTab
                        value={1}
                        contactId={state.contactId}
                        contactType="company"
                        isActive={(state.activeTab === 1)}
                    />
                }
            </DialogEx>
            <Overlay open={state.loading} />
        </Form>
    );
}
