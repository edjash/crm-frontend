import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect, useState } from 'react';
import RemoteSelect, { SelectOption } from '../RemoteSelect';
import apiClient from '../apiClient';
import Fieldset from '../Fieldset';
import * as FormUtil from '../FormUtil';
import MultiFieldset from '../MultiFieldset';
import Overlay from '../Overlay';
import TextFieldEx from '../TextFieldEx';

export interface ShowCreateEditProps {
    id: number;
    fullname: string;
};

interface fieldProps {
    helperText: string;
    error: boolean;
    name: string;
    defaultValue: string;
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

        apiClient.postForm(url, formData,).then((response) => {
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
            let valueData = response.data;
            let addressArray: Record<string, any>[] = valueData.address;

            addressArray.map((addr, index) => {
                if (addr.country && addr.country_name) {
                    addressArray[index].country = {
                        name: addr?.country_name,
                        value: addr?.country
                    };
                } else {
                    addressArray[index].country = null;
                }
            });

            valueData.address = addressArray;
            console.log(valueData);

            setState((state) => ({
                ...state,
                open: true,
                values: valueData,
                ready: true,
            }));
        }).catch((error) => {

        });
    }, []);

    let title = "New Contact";

    if (props.type == 'edit') {
        if (!state.ready) {
            return (<Overlay open={true} />);
        }
        title = `${state.values?.fullname}`;
    }

    return (
        <Dialog
            open={state.open}
            onClose={props.onClose}
            fullScreen={false}
            scroll="paper"
            maxWidth="md"
            fullWidth
        >
            <form onSubmit={onSubmit} onFocus={onFocus}>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    {title}
                    <IconButton aria-label="close" onClick={props.onCancel} className="closeButton">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                        <Box display="grid" gap={2}>
                            <Fieldset label="Name">
                                <Box sx={{ display: 'grid' }}>
                                    <TextFieldEx {...fieldProps('title')} label="Title" sx={{ width: '50%' }} />
                                    <TextFieldEx {...fieldProps('firstname')} label="First Name" required />
                                    <TextFieldEx {...fieldProps('lastname')} label="Last Name" />
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
                                    name="country"
                                />
                            </MultiFieldset>
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
