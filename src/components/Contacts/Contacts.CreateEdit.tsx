import CloseIcon from '@mui/icons-material/Close';
import { Autocomplete, Avatar, Box, IconButton, InputAdornment } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { ChangeEvent, useEffect, useState } from 'react';
import RemoteSelect, { SelectOption } from '../RemoteSelect';
import apiClient from '../apiClient';
import Fieldset from '../Fieldset';
import * as FormUtil from '../FormUtil';
import MultiFieldset from '../MultiFieldset';
import Overlay from '../Overlay';
import TextFieldEx from '../TextFieldEx';
import { SocialIcon } from 'react-social-icons';
import ProfileAvatar from '../ProfileAvatar';

export interface ShowCreateEditProps {
    id: number;
    fullname: string;
};

interface fieldProps {
    helperText: string;
    error: boolean;
    name: string;
    defaultValue: any;
};

interface CreateEditState {
    loading: boolean;
    ready: boolean;
    open: boolean;
    errors: FormUtil.ErrorMessages;
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
        errors: {},
        values: {},
    });

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setState({
            ...state,
            loading: false
        });

        const formData: FormData = new FormData(e.currentTarget);

        let url = '/contacts';
        if (props.type === 'edit' && props.data?.id) {
            url = `${url}/${props.data.id}`;
        }

        apiClient.postForm(url, formData).then((response) => {
            setState({ ...state, loading: false });

            if (response.statusText === 'OK') {
                props.onSave();

                PubSub.publish('CONTACTS.REFRESH');
                PubSub.publish('TOAST.SHOW', {
                    message: 'Contact Added',
                    autoHide: true,
                });
            }
        }).catch((error) => {
            if (FormUtil.isValidationError(error)) {
                setState({
                    ...state,
                    errors: FormUtil.getErrorMessages(error),
                    loading: false
                });
            } else {
                PubSub.publish('TOAST.SHOW', {
                    autoHide: false,
                    message: 'An unexpected server error occured.',
                    type: 'error',
                });
                setState({
                    ...state,
                    loading: false
                });
            }
        });
    };

    const fieldProps = (fieldName: string, defaultText: string = ''): fieldProps => {
        let ob: fieldProps = {
            name: fieldName,
            helperText: state.errors?.[fieldName] || defaultText,
            error: !!(state.errors?.[fieldName]) ?? false,
            defaultValue: state.values?.[fieldName] ?? ''
        };
        return ob;
    };

    const onFocus = (e: React.FormEvent<HTMLFormElement>) => {
        const name = (e.target as HTMLInputElement).name ?? '';
        if (name && state.errors[name]) {
            const errors = { ...state.errors };
            delete errors[name];
            setState((state) => ({
                ...state,
                errors: errors
            }));
        }
    }

    useEffect(() => {
        apiClient.get(`/contacts/${props.data?.id}`).then((response) => {
            const valueData = response.data;
            const addresses: Record<string, any>[] = valueData.address;
            const socialmedia: Record<string, string>[] = valueData.social_media_url;
            delete valueData['social_media_url'];

            socialmedia.map((item, index) => {
                valueData[`socialmedia[${item.ident}]`] = item.url;
            });

            valueData.address = addresses.map((addr, index) => {
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

            if (valueData.title) {
                valueData.title = {
                    value: valueData.title,
                    label: valueData.title,
                };
            }

            if (valueData.pronouns) {
                valueData.pronouns = {
                    value: valueData.pronouns,
                    label: valueData.pronouns,
                }
            }

            setState((state) => ({
                ...state,
                open: true,
                values: valueData,
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
        avatarPostUrl = `${avatarPostUrl}/${props?.data?.id}`;
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
            <form onSubmit={onSubmit} onFocus={onFocus}>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    {title}
                    <IconButton aria-label="close" onClick={props.onCancel} className="closeButton">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
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
                                        <RemoteSelect
                                            {...fieldProps('title')}
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
                                            {...fieldProps('pronouns')}
                                            label="Pronouns"
                                            options={[
                                                { value: '', label: '' },
                                                { value: 'She/Her', label: 'She/Her' },
                                                { value: 'He/Him', label: 'He/Him' },
                                                { value: 'They/Them', label: 'They/Them' },
                                            ]}
                                        />
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'grid' }}>
                                    <TextFieldEx {...fieldProps('firstname')} label="First Name" onChange={onChange} required />
                                    <TextFieldEx {...fieldProps('lastname')} label="Last Name" onChange={onChange} />
                                </Box>
                            </Fieldset>
                            <MultiFieldset
                                legend="Email Address"
                                defaultTabLabel="Primary"
                                baseName="email"
                                errors={state.errors}
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
                                errors={state.errors}
                                values={state.values.address}
                            >
                                <TextFieldEx name="street" label="Street" />
                                <TextFieldEx name="town" label="Town / City" />
                                <TextFieldEx name="county" label="County / State" />
                                <TextFieldEx name="postcode" label="Zip / Postal Code" />
                                <RemoteSelect
                                    label="Country"
                                    url="/countries"
                                    valueField="code"
                                    labelField="name"
                                    name="country"
                                    clearable
                                />
                            </MultiFieldset>
                        </Box>
                        <Box display="grid" gap={2}>
                            <MultiFieldset
                                legend="Phone Number"
                                defaultTabLabel="Primary"
                                baseName="phone"
                                errors={state.errors}
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
                                        <TextFieldEx {...fieldProps(`socialmedia[${network.toLowerCase()}]`)} label={network} />
                                    </Box>
                                ))}
                            </Fieldset>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button size="small" variant="contained" onClick={props.onCancel}>
                        Cancel
                    </Button>
                    <Button size="small" variant="contained" type="submit" disableElevation autoFocus>
                        Save
                    </Button>
                </DialogActions>
            </form>
            <Overlay open={state.loading} />
        </Dialog>
    );
}
