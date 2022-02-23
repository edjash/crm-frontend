import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton } from '@mui/material';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { uniqueId } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { SocialIcon } from 'react-social-icons';
import contactSchema from '../../validation/contactSchema';
import apiClient from '../apiClient';
import DialogButton from '../DialogButton';
import CountrySelect from '../Form/CountrySelect';
import Fieldset from '../Form/Fieldset';
import Form from '../Form/Form';
import MultiFieldset from '../Form/MultiFieldset';
import ProfileAvatar from '../Form/ProfileAvatar';
import RemoteSelect from '../Form/RemoteSelect';
import TextFieldEx from '../Form/TextFieldEx';
import Overlay from '../Overlay';

export interface ShowCreateEditProps {
    contactId: number;
    fullname: string;
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

export default function ContactCreateEdit(props: CreateEditProps) {

    const [state, setState] = useState<CreateEditState>({
        loading: false,
        ready: (props.type === 'new'),
        open: (props.type === 'new'),
        defaultValues: {},
    });

    const formId = useRef(uniqueId('contactForm'));

    const onSubmit = (data: any) => {

        setState({ ...state, loading: true });

        data = prepareOutgoingValues(data);

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
        values.social_media_url.map((item: Record<string, string>) => {
            values[`socialmedia[${item.ident}]`] = item.url;
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

    useEffect(() => {
        apiClient.get(`/contacts/${props.data?.contactId}`).then((response) => {
            const values = prepareIncomingValues(response.data);

            setState((state) => ({
                ...state,
                open: true,
                defaultValues: values,
                ready: true,
            }));
        }).catch((error) => {

        });
    }, []);

    let title = "New Contact";
    let avatarPostUrl = '/contacts/avatar';

    if (props.type == 'edit') {
        if (!state.ready) {
            return (<Overlay open={true} />);
        }
        title = props?.data?.fullname ?? 'Unnamed';
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
                <Form
                    onSubmit={onSubmit}
                    onError={onError}
                    defaultValues={state.defaultValues}
                    validationSchema={contactSchema}
                    id={formId.current}
                >
                    <Box display="grid" gridTemplateColumns="auto auto auto" alignItems="start" gap={2}>
                        <Box display="grid" gap={2}>
                            <Fieldset legend="Personal">
                                <Box display="grid" gap={1}>
                                    <ProfileAvatar
                                        name="avatar"
                                        sx={{ justifySelf: "center" }}
                                        postEndPoint={avatarPostUrl}
                                    />
                                    <Box display="grid" gridTemplateColumns="1fr 1fr" gap={1}>
                                        <RemoteSelect
                                            name="title"
                                            label="Title"
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
                            {/* <MultiFieldset
                                    legend="Phone Number"
                                    baseName="phone"
                                    defaultValues={state.values.phone_number}
                                >
                                    <TextFieldEx name="number" type="text" label="Phone Number" />
                                </MultiFieldset> */}
                            {/* <Fieldset legend="Social Media">
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
                            </Fieldset> */}
                        </Box>
                    </Box>
                </Form>
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
