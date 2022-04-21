import { Box, Theme, useMediaQuery } from '@mui/material';
import { uniqueId } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import contactSchema from '../../validation/contactSchema';
import apiClient from '../apiClient';
import DialogEx, { DialogExProps } from '../Dialogs/DialogEx';
import CountrySelect from '../Form/CountrySelect';
import Fieldset from '../Form/Fieldset';
import Form from '../Form/Form';
import MultiFieldset from '../Form/MultiFieldset';
import ProfileAvatar from '../Form/ProfileAvatar';
import RemoteSelect from '../Form/RemoteSelect';
import SearchField from '../Form/SearchField';
import TextFieldEx from '../Form/TextFieldEx';
import Overlay from '../Overlay';
import SocialIcon from '../SocialIcon';
import TabPanel from '../TabPanel';

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
    data?: ContactDialogData,
    onCancel: () => void;
    onSave: () => void;
};

interface TitleProps {
    title: string;
    avatar?: string;
    onAvatarChange: (filename: string) => void;
}

const DialogTitle = (props: TitleProps) => {

    return (
        <Box display="flex" alignItems="center" gap={1}>
            <ProfileAvatar
                name="avatar"
                src={props.avatar}
                sx={{ justifySelf: "left" }}
                onAvatarChange={props.onAvatarChange}
            />
            <div>
                {props.title}
            </div>
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
            apiClient.get(`/contacts/${props.data?.id}`).then((response) => {
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
    }, [state.ready, props.type, props.data?.id]);

    const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));

    const formId = useRef(uniqueId('contactForm'));
    const formMethods = useRef<UseFormReturn>();

    const onSubmit = (data: any) => {

        setState({ ...state, loading: true });
        const postData = prepareOutgoingValues(data);

        let url = '/contacts';
        if (props.type === 'edit' && props.data?.id) {
            url = `${url}/${props.data.id}`;
        }

        apiClient.post(url, postData).then((response) => {
            setState({ ...state, loading: false });
            props.onSave();
            if (props.type === 'edit') {
                PubSub.publish('CONTACTS.REFRESH');
            } else {
                PubSub.publish('TOAST.SHOW', {
                    message: 'Contact Added',
                    autoHide: true,
                });
                PubSub.publish('CONTACTS.REFRESH');
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

    const onAddCompany = (): Promise<Record<string, any>> => {
        return new Promise((resolve, reject) => {
            PubSub.publish('COMPANIES.NEW', {
                onSave: (success: boolean, data: Record<string, any>) => {
                    if (success) {
                        resolve(data.company);
                    } else {
                        reject(data);
                    }
                },
                noAnimation: true,
                hideBackdrop: true,
            })
        });
    }

    let title = 'New Contact';
    if (props.type === 'edit') {
        if (!state.ready) {
            return (<Overlay open={true} showProgress={true} />);
        }
        title = props?.data?.fullname ?? 'Unnamed';
    }

    return (
        <Form
            onSubmit={onSubmit}
            onError={onError}
            defaultValues={state.defaultValues}
            validationSchema={contactSchema}
            id={formId.current}
            setFormMethods={(methods) => formMethods.current = methods}
        >
            <DialogEx
                open={state.open}
                onCancel={props.onCancel}
                displayMode={isDesktop ? 'normal' : 'mobile'}
                title={
                    <DialogTitle
                        title={title}
                        avatar={props.data?.avatar}
                        onAvatarChange={(filename: string) => {
                            if (formMethods.current) {
                                formMethods.current.setValue('avatar', filename);
                            }
                        }}
                    />}
                saveButtonProps={{
                    type: 'submit',
                    form: formId.current
                }}
                tabProps={{
                    tabs: ['General', 'Notes'],
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
                <TabPanel
                    value={0}
                    activeTab={state.activeTab}
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: (isDesktop) ? '320px 320px 320px' : 'auto',
                        alignItems: 'start',
                        overflowY: 'auto',
                        p: 1,
                        gap: 1
                    }}
                >
                    <Box display="grid" gap={1}>
                        <Fieldset legend="Personal">
                            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={1}>
                                <RemoteSelect
                                    name="title"
                                    label="Title"
                                    sx={{ m: 0 }}
                                    options={[
                                        { value: 'Mr', label: 'Mr' },
                                        { value: 'Mrs', label: 'Mrs' },
                                        { value: 'Miss', label: 'Miss' },
                                        { value: 'Ms', label: 'Ms' },
                                        { value: 'Mx', label: 'Mx' },
                                    ]}
                                />
                                <RemoteSelect
                                    label="Pronouns"
                                    name="pronouns"
                                    options={[
                                        { value: 'She/Her', label: 'She/Her' },
                                        { value: 'He/Him', label: 'He/Him' },
                                        { value: 'They/Them', label: 'They/Them' },
                                    ]}
                                />
                            </Box>
                            <Box>
                                <TextFieldEx
                                    name="firstname"
                                    label="First Name"
                                    required
                                />
                                <TextFieldEx
                                    name="lastname"
                                    label="Last Name"
                                />
                                <TextFieldEx
                                    name="nickname"
                                    label="Nick Name"
                                />
                            </Box>
                        </Fieldset>
                        <Fieldset legend="Company">
                            <SearchField
                                url="/companies"
                                labelField="name"
                                valueField="id"
                                name="company"
                                label="Company"
                                remoteDataProperty="data"
                                onAddClick={onAddCompany}
                            />
                            <TextFieldEx
                                name="jobtitle"
                                label="Job Title"
                            />
                        </Fieldset>
                    </Box>
                    <Box display="grid" gap={1}>
                        <MultiFieldset
                            baseName="address"
                            legend="Address"
                        >
                            <TextFieldEx name="street" label="Street" />
                            <TextFieldEx name="town" label="Town / City" />
                            <TextFieldEx name="county" label="County / State" />
                            <TextFieldEx name="postcode" label="Zip / Postal Code" />
                            <CountrySelect
                                label="Country"
                                name="country"
                            />
                        </MultiFieldset>
                        <MultiFieldset
                            legend="Phone Number"
                            baseName="phone_number"
                        >
                            <TextFieldEx name="number" label="Phone Number" />
                        </MultiFieldset>
                    </Box>
                    <Box display="grid" gap={1}>
                        <Fieldset legend="Social Media">
                            {['LinkedIn', 'Twitter', 'Facebook', 'Instagram', 'Teams', 'Skype'].map((network, index) => (
                                <Box display="flex" alignItems="center" gap={1} key={network}>
                                    <SocialIcon network={network} />
                                    <TextFieldEx
                                        name={`socialmedia.${network.toLowerCase()}`}
                                        label={network}
                                    />
                                </Box>
                            ))}
                        </Fieldset>
                        <MultiFieldset
                            legend="Email Address"
                            baseName="email_address"
                        >
                            <TextFieldEx
                                name="address"
                                label="Email Address"
                            />
                        </MultiFieldset>
                    </Box>
                </TabPanel>
                <TabPanel
                    value={1}
                    activeTab={state.activeTab}
                >
                    NOTES AND STUFF
                </TabPanel>
            </DialogEx>
            <Overlay open={state.loading} />
        </Form>
    );
}
