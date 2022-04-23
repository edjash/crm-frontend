import { Box, Theme, useMediaQuery } from '@mui/material';
import { uniqueId } from 'lodash';
import { useEffect, useRef, useState } from 'react';
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
import Overlay from '../Overlay';
import SocialIcon from '../SocialIcon';

export interface CompanyDialogData {
    contactId: number;
    name: string;
    avatar?: string;
};

export interface CompanyDialogProps {
    type: 'new' | 'edit',
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
    defaultValues: Record<string, any>;
}

interface TitleProps extends CompanyDialogProps {
    isDesktop: boolean;
}

const Title = (props: TitleProps) => {

    const isDesktop = props.isDesktop;
    let title = props.data?.name ?? 'Unnamed';
    if (props.type === 'new') {
        title = 'New Company';
    }

    return (
        <Box display="flex" alignItems="center" gap={1} p="10px" mb={isDesktop ? '10px' : 'auto'}>
            {isDesktop &&
                <ProfileAvatar
                    name="avatar"
                    src={props.data?.avatar}
                    sx={{ justifySelf: "left" }}
                />
            }
            <div style={{ maxWidth: (isDesktop) ? 'auto' : '200px' }}>
                {title}
            </div>
        </Box>
    );
}

export default function CompanyDialog(props: CompanyDialogProps) {

    const [state, setState] = useState<CompanyDialogState>({
        loading: false,
        ready: (props.type === 'new'),
        open: true,
        defaultValues: {},
    });

    useEffect(() => {
        if (props.type === 'edit' && !state.ready) {
            apiClient.get(`/companies/${props.data?.contactId}`).then((response) => {
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
    }, [props.type, state.ready, props.data?.contactId]);

    const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));

    const formId = useRef(uniqueId('companyForm'));

    const onSubmit = (data: any) => {

        setState({ ...state, loading: true });

        data = prepareOutgoingValues(data);

        let url = '/companies';
        if (props.type === 'edit' && props.data?.contactId) {
            url = `${url}/${props.data.contactId}`;
        }

        apiClient.post(url, data)
            .then((response) => {
                setState({ ...state, loading: false });
                if (props.onSave) {
                    props.onSave(true, response.data);
                }
                if (props.type === 'edit') {
                    PubSub.publish('COMPANIES.REFRESH');
                } else {
                    PubSub.publish('TOAST.SHOW', {
                        message: 'Company Added',
                        autoHide: true,
                    });
                    PubSub.publish('COMPANIES.REFRESH');
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

    const prepareOutgoingValues = (values: Record<string, any>) => {
        if (values.address) {
            values.address =
                values.address.map((item: Record<string, any>) => {
                    if (item.country && typeof item.country == 'object') {
                        item.country = item.country.code;
                    }
                    return item;
                });
        }
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

    if (props.type === 'edit' && !state.ready) {
        return (<Overlay open={true} showProgress={true} />);
    }

    let extraProps: Record<string, any> = {};
    if (props.noAnimation) {
        extraProps['transitionDuration'] = 0;
    }
    if (props.hideBackdrop) {
        extraProps['hideBackdrop'] = true;
    }

    return (
        <Form
            onSubmit={onSubmit}
            onError={onError}
            defaultValues={state.defaultValues}
            validationSchema={companySchema}
            id={formId.current}
        >
            <DialogEx
                open={state.open}
                onCancel={props.onCancel}
                title={<Title {...props} isDesktop={isDesktop} />}
                displayMode={isDesktop ? 'normal' : 'mobile'}
                saveButtonProps={{
                    type: 'submit',
                    form: formId.current
                }}
                {...extraProps}
            >
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: (isDesktop) ? '320px 320px 320px' : 'auto',
                        alignItems: 'start',
                        gap: 1,
                    }}
                >
                    <Box display="grid" gap={1}>
                        <Fieldset legend="Identity">
                            {!isDesktop &&
                                <ProfileAvatar
                                    name="avatar"
                                    sx={{ justifySelf: "center" }}
                                    size={100}
                                />
                            }
                            <TextFieldEx
                                name="name"
                                label="Name"
                                required
                            />
                            <IndustrySelect
                                label="Industry"
                                name="industry"
                            />
                            <TextFieldEx
                                name="description"
                                label="Description"
                                multiline
                                rows={3}
                            />
                        </Fieldset>
                        <MultiFieldset
                            legend="Phone Number"
                            baseName="phone_number"
                        >
                            <TextFieldEx name="number" label="Phone Number" />
                        </MultiFieldset>
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
                    </Box>
                    <Box display="grid" gap={1}>
                        <Fieldset legend="Social Media">
                            {['LinkedIn', 'Twitter', 'Facebook', 'Instagram', 'Teams', 'Skype'].map((network, index) => (
                                <Box display="flex" alignItems="center" gap={1} key={network}>
                                    <SocialIcon network={network} />
                                    < TextFieldEx
                                        name={`socialmedia.${network.toLowerCase()}`}
                                        label={network}
                                    />
                                </Box>
                            ))}
                        </Fieldset>
                    </Box>
                </Box>
            </DialogEx>
            <Overlay open={state.loading} />
        </Form>
    );
}
