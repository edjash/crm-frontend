import { Box, DialogTitle, Theme, useMediaQuery } from '@mui/material';
import clsx from 'clsx';
import { uniqueId } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { EVENTS } from '../../app/constants';
import contactSchema from '../../validation/contactSchema';
import apiClient from '../apiClient';
import DialogEx, { DialogExProps } from '../Dialogs/DialogEx';
import Form from '../Form/Form';
import ProfileAvatar from '../Form/ProfileAvatar';
import Overlay from '../Overlay';
import GeneralTab from './GeneralTab';
import NotesTab from './NotesTab';

export interface ContactDialogData {
    id: number;
    fullname: string;
    avatar?: string;
};

interface ContactDialogState {
    loading: boolean;
    ready: boolean;
    open: boolean;
    defaultValues: Record<string, any>;
    activeTab: number;
}

interface ContactDialogProps extends DialogExProps {
    type: 'new' | 'edit',
    contactData?: ContactDialogData,
    onCancel: () => void;
    onSave: () => void;
};

interface TitleProps extends ContactDialogProps {
    isDesktop: boolean;
    avatar?: string;
}

const Title = (props: TitleProps) => {

    const [avatar, setAvatar] = useState(props.avatar);
    const isDesktop = props.isDesktop;
    let title = props.contactData?.fullname ?? 'Unnamed';
    if (props.type === 'new') {
        title = 'New Contact';
    }

    return (
        <Box display="flex" alignItems="center" gap={isDesktop ? 2 : 1} p={isDesktop ? 2 : 0}>
            {isDesktop &&
                <ProfileAvatar
                    name="avatar"
                    filename={avatar}
                    sx={{ justifySelf: "left" }}
                    onChange={(avatar: string) => {
                        setAvatar(avatar);
                    }}
                />
            }
            <DialogTitle>
                {title}
            </DialogTitle>
        </Box>
    );
}

export default function ContactDialog(props: ContactDialogProps) {

    const [state, setState] = useState<ContactDialogState>({
        loading: false,
        ready: (props.type === 'new'),
        open: true,
        defaultValues: {},
        activeTab: 0
    });

    useEffect(() => {
        if (props.type === 'edit' && !state.ready) {
            apiClient.get(`/contacts/${props.contactData?.id}`).then((response) => {
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
    }, [state.ready, state.open, props.type, props.contactData?.id]);

    const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
    const formId = useRef(uniqueId('contactForm'));

    const onSubmit = (data: any) => {

        setState({ ...state, loading: true });
        const postData = prepareOutgoingValues(data);

        let url = '/contacts';
        if (props.type === 'edit' && props.contactData?.id) {
            url = `${url}/${props.contactData.id}`;
        }

        apiClient.post(url, postData).then((response) => {
            setState({ ...state, loading: false });
            props.onSave();
            if (props.type === 'edit') {
                PubSub.publish(EVENTS.CONTACTS_REFRESH);
            } else {
                PubSub.publish(EVENTS.TOAST, {
                    message: 'Contact Added',
                    autoHide: true,
                });
                PubSub.publish(EVENTS.CONTACTS_REFRESH);
            }

        }).catch((response) => {
            setState({ ...state, loading: false });
            // apiClient.showErrors(response, formMethods.setError);
        });
    }

    const onError = (data: any) => {
        console.log("Validation Error", data);
    };

    const prepareOutgoingValues = (values: Record<string, any>) => {
        const pvalues = { ...values };
        if (pvalues.address) {
            pvalues.address =
                pvalues.address.map((item: Record<string, any>) => {
                    if (item.country && typeof item.country === 'object') {
                        item.country = item.country.code;
                    }
                    return item;
                });
        }
        if (pvalues.company && typeof pvalues.company === 'object') {
            pvalues.company = pvalues.company.id;
        }
        return pvalues;
    }

    const prepareIncomingValues = (values: Record<string, any>) => {
        const pvalues = { ...values };
        pvalues.social_media_url.forEach((item: Record<string, string>) => {
            pvalues[`socialmedia.${item.ident}`] = item.url;
        });
        delete pvalues['social_media_url'];

        pvalues.address =
            pvalues.address.map((addr: Record<string, any>) => {
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

        return pvalues;
    }

    const ready = ((props.type === 'edit' && state.ready) || props.type === 'new');

    return (
        <Form
            onSubmit={onSubmit}
            onError={onError}
            defaultValues={state.defaultValues}
            validationSchema={contactSchema}
            id={formId.current}
        >
            <DialogEx
                open={state.open}
                onCancel={props.onCancel}
                className={clsx({ skeletons: !ready })}
                displayMode={isDesktop ? 'normal' : 'mobile'}
                titleComponent={<Title {...props} isDesktop={isDesktop} avatar={props.contactData?.avatar} />}
                saveButtonProps={{
                    type: 'submit',
                    form: formId.current,
                    disabled: !ready,
                }}
                tabProps={{
                    tabs: [
                        { label: 'General', value: 0 },
                        { label: 'Notes', value: 1, disabled: true },
                        { label: 'Lead Info', value: 2, disabled: true },
                        { label: 'Relationships', value: 3, disabled: true },
                        { label: 'Activity', value: 4, disabled: true },
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
                    data={props.contactData}
                />
                <NotesTab
                    value={1}
                    isActive={(state.activeTab === 1)}
                />
            </DialogEx>
            <Overlay open={state.loading} />
        </Form>
    );
}
