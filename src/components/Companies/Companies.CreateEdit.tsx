import { Box, Theme, useMediaQuery } from '@mui/material';
import { DialogProps } from '@mui/material/Dialog';
import { uniqueId } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import SocialIcon from '../SocialIcon';
import useOnce from '../../hooks/useOnce';
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

export interface ShowCreateEditProps {
    contactId: number;
    name: string;
};

interface CreateEditState {
    loading: boolean;
    ready: boolean;
    open: boolean;
    defaultValues: Record<string, any>;
}

type CreateEditProps = DialogProps & {
    type: 'new' | 'edit',
    data?: ShowCreateEditProps,
    onCancel: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onSave: () => void;
};

export default function CompanyCreateEdit(props: CreateEditProps) {

    const [state, setState] = useState<CreateEditState>({
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

        apiClient.post(url, data).then((response) => {
            setState({ ...state, loading: false });
            props.onSave();
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

    let title = "New Company";
    if (props.type === 'edit') {
        if (!state.ready) {
            return (<Overlay open={true} showProgress={true} />);
        }
        title = props?.data?.name ?? 'Unnamed';
    }

    return (
        <DialogEx
            open={state.open}
            onClose={props.onClose}
            title={title}
            displayMode={isDesktop ? 'normal' : 'mobile'}
            saveButtonProps={{
                type: 'submit',
                form: formId.current
            }}
        >
            <Form
                onSubmit={onSubmit}
                onError={onError}
                defaultValues={state.defaultValues}
                validationSchema={companySchema}
                id={formId.current}
            >
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: (isDesktop) ? '320px 320px 320px' : 'auto',
                        alignItems: 'start',
                        gap: 2,
                    }}
                >
                    <Box display="grid" gap={2}>
                        <Fieldset legend="Identity">
                            <Box display="grid" gap={1}>
                                <ProfileAvatar
                                    name="avatar"
                                    sx={{ justifySelf: "center" }}
                                />
                                <TextFieldEx
                                    name="name"
                                    label="Name"
                                    required
                                />
                                <IndustrySelect
                                    label="Industry"
                                    name="industry"
                                />
                            </Box>
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
                    <Box sx={{ overflowX: 'hidden', minWidth: 0 }}>
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
                    <Box display="grid" gap={2}>
                        <MultiFieldset
                            legend="Phone Number"
                            baseName="phone_number"
                        >
                            <TextFieldEx name="number" label="Phone Number" />
                        </MultiFieldset>
                        <Fieldset legend="Social Media">
                            {['LinkedIn', 'Twitter', 'Facebook', 'Instagram'].map((network, index) => (
                                <Box sx={{ display: 'flex', alignItems: 'center' }} gap={1} key={network}>
                                    <SocialIcon network={network} />
                                    <TextFieldEx
                                        name={`socialmedia.${network.toLowerCase()}`}
                                        label={network}
                                    />
                                </Box>
                            ))}
                        </Fieldset>
                    </Box>
                </Box>
            </Form>
            <Overlay open={state.loading} />
        </DialogEx>
    );
}
