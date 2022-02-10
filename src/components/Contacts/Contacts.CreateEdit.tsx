import { yupResolver } from '@hookform/resolvers/yup';
import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { SocialIcon } from 'react-social-icons';
import apiClient from '../apiClient';
import Fieldset from '../Fieldset';
import MultiFieldset from '../MultiFieldset';
import Overlay from '../Overlay';
import ProfileAvatar from '../ProfileAvatar';
import RemoteSelect from '../RemoteSelect';
import TextFieldEx from '../TextFieldEx';
import contactSchema from '../../validation/contactSchema';
import CountrySelect from '../CountrySelect';
import DialogButton from '../DialogButton';
import { uniqueId } from 'lodash';

export interface ShowCreateEditProps {
    contactId: number;
    fullname: string;
};

interface CreateEditState {
    loading: boolean;
    ready: boolean;
    open: boolean;
    values: Record<string, any>;
}

type CreateEditProps = DialogProps & {
    type: 'new' | 'edit',
    data?: ShowCreateEditProps,
    onCancel: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onSave: () => void;
};

export default function ContactCreateEdit(props: CreateEditProps) {

    const [state, setState] = useState<CreateEditState>({
        loading: false,
        ready: (props.type === 'new'),
        open: (props.type === 'new'),
        values: {},
    });

    const formMethods = useForm({ resolver: yupResolver(contactSchema) });
    const formId = useRef(uniqueId('contactForm'));

    const onSubmit = (data: any) => {

        setState({ ...state, loading: true });

        const formData: FormData = new FormData();
        for (let key in data) {
            formData.append(key, data[key]);
        }

        let url = '/contacts';
        if (props.type === 'edit' && props.data?.contactId) {
            url = `${url}/${props.data.contactId}`;
        }

        apiClient.post(url, data).then((response) => {
            setState({ ...state, loading: false });

            if (response.statusText === 'OK') {
                props.onSave();

                PubSub.publish('CONTACTS.REFRESH');
                PubSub.publish('TOAST.SHOW', {
                    message: 'Contact Added',
                    autoHide: true,
                });
            }
        }).catch((response) => {
            setState({ ...state, loading: false });
            apiClient.showErrors(response, formMethods.setError);
        });
    }

    const onError = (data: any) => {
        console.log("ERROR", data);
    }

    const prepareFieldValues = (fieldValues: Record<string, any>) => {
        const addresses: Record<string, any>[] = fieldValues.address;
        const socialmedia: Record<string, string>[] = fieldValues.social_media_url;
        delete fieldValues['social_media_url'];

        socialmedia.map((item, index) => {
            fieldValues[`socialmedia[${item.ident}]`] = item.url;
        });

        fieldValues.address = addresses.map((addr, index) => {
            if (addr.country && addr.country_name) {
                addr.country = {
                    value: addr?.country,
                    label: addr?.country_name,
                };
            } else {
                addr.country = null;
            }
            return addr;
        });

        if (fieldValues.title) {
            fieldValues.title = {
                value: fieldValues.title,
                label: fieldValues.title,
            };
        }

        if (fieldValues.pronouns) {
            fieldValues.pronouns = {
                value: fieldValues.pronouns,
                label: fieldValues.pronouns,
            }
        }

        return fieldValues;
    }

    useEffect(() => {
        apiClient.get(`/contacts/${props.data?.contactId}`).then((response) => {
            const values = prepareFieldValues(response.data);
            for (let k in values) {
                formMethods.setValue(k, values[k]);

            }
            setState((state) => ({
                ...state,
                open: true,
                // values: prepareFieldValues(response.data),
                ready: true,
            }));
        }).catch((error) => {

        });
    }, []);

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        setState((state) => ({ ...state, [e.target.name]: e.target.value }));
    }

    let title = "New Contact";
    let avatarPostUrl = '/contacts/avatar';

    if (props.type == 'edit') {
        if (!state.ready) {
            return (<Overlay open={true} />);
        }
        title = `${state.values?.fullname}`;
        avatarPostUrl = `${avatarPostUrl}/${props?.data?.contactId}`;
    }

    return (
        <Dialog
            open={state.open}
            onClose={props.onClose}
            fullScreen={false}
            scroll="paper"
            maxWidth="xl"
            fullWidth={false}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }}>
                {title}
                <IconButton aria-label="close" onClick={props.onCancel} className="closeButton">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <FormProvider {...formMethods}>
                    <form onSubmit={formMethods.handleSubmit(onSubmit, onError)} id={formId.current}>
                        <Box display="grid" gridTemplateColumns="auto auto auto" alignItems="start" gap={2}>
                            <Box display="grid" gap={2}>
                                <Fieldset label="Personal">
                                    <Box display="grid" gap={1}>
                                        <ProfileAvatar
                                            sx={{ justifySelf: "center" }}
                                            postEndPoint={avatarPostUrl}
                                            name="avatar"
                                            defaultValue={state.values.avatar}
                                        />
                                        <Box display="grid" gridTemplateColumns="1fr 1fr" gap={1}>
                                            {/* <RemoteSelect
                                            errors={errors.title}
                                            label="Title"
                                            options={[
                                                { value: '', label: '' },
                                                { value: 'Mr', label: 'Mr' },
                                                { value: 'Mrs', label: 'Mrs' },
                                                { value: 'Miss', label: 'Miss' },
                                                { value: 'Ms', label: 'Ms' },
                                                { value: 'Mx', label: 'Mx' },
                                            ]}
                                        />
                                        <RemoteSelect
                                            label="Pronouns"
                                            errors={errors.pronouns}
                                            options={[
                                                { value: '', label: '' },
                                                { value: 'She/Her', label: 'She/Her' },
                                                { value: 'He/Him', label: 'He/Him' },
                                                { value: 'They/Them', label: 'They/Them' },
                                            ]}
                                        /> */}
                                        </Box>
                                    </Box>
                                    <Box sx={{ display: 'grid' }}>
                                        <TextFieldEx
                                            name="firstname"
                                            label="First Name"
                                            required
                                        />
                                        <TextFieldEx
                                            name="lastname"
                                            label="Last Name"
                                        />
                                    </Box>
                                </Fieldset>
                                <MultiFieldset
                                    legend="Email Address"
                                    defaultTabLabel="Primary"
                                    baseName="email"
                                    values={state.values.email_address}
                                >
                                    <TextFieldEx name="address" type="email" label="Email Address" />
                                </MultiFieldset>
                            </Box>
                            <Box sx={{ overflowX: 'hidden', minWidth: 0 }}>
                                <MultiFieldset
                                    baseName="address"
                                    legend="Address"
                                    defaultTabLabel="Home"
                                    values={state.values.address}
                                >
                                    <TextFieldEx name="street" label="Street" />
                                    <TextFieldEx name="town" label="Town / City" />
                                    <TextFieldEx name="county" label="County / State" />
                                    <TextFieldEx name="postcode" label="Zip / Postal Code" />
                                    <CountrySelect
                                        label="Country"
                                        name="country"
                                        url="/countries"
                                    />
                                </MultiFieldset>
                            </Box>
                            <Box display="grid" gap={2}>
                                <MultiFieldset
                                    legend="Phone Number"
                                    defaultTabLabel="Primary"
                                    baseName="phone"
                                    values={state.values.phone_number}
                                >
                                    <TextFieldEx name="number" type="text" label="Phone Number" />
                                </MultiFieldset>
                                <Fieldset label="Social Media">
                                    {['LinkedIn', 'Twitter', 'Facebook', 'Instagram'].map((network, index) => (
                                        <Box sx={{ display: 'flex', alignItems: 'center' }} gap={1} key={network}>
                                            <Box>
                                                <SocialIcon network={network.toLowerCase()} fgColor="white" style={{ height: 25, width: 25 }} />
                                            </Box>
                                            <TextFieldEx
                                                name={`socialmedia[${network.toLowerCase()}]`}
                                                label={network}
                                            />
                                        </Box>
                                    ))}
                                </Fieldset>
                            </Box>
                        </Box>
                    </form>
                </FormProvider>
            </DialogContent>
            <DialogActions>
                <DialogButton onClick={props.onCancel}>Cancel</DialogButton>
                <DialogButton type="submit" form={formId.current}>
                    Save
                </DialogButton>
            </DialogActions>
            <Overlay open={state.loading} />
        </Dialog>
    );
}
