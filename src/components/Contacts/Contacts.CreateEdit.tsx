import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';
import CountrySelect from '../../components/CountrySelect';
import apiClient from '../apiClient';
import Fieldset from '../Fieldset';
import * as FormUtil from '../FormUtil';
import MultiFieldset from '../MultiFieldset';
import TextFieldEx from '../TextFieldEx';

type CreateEditProps = DialogProps & {
    type: string,
    onCancel: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onSave: () => void;
};

type FormState = {
    loading: boolean;
    errors: FormUtil.ErrorMessages;
};

interface HelperProps {
    helperText: string;
    error: boolean;
};

export default function ContactCreateEdit(props: CreateEditProps) {

    const title = "New Contact";

    const [state, setState] = useState<FormState>({
        loading: false,
        errors: {},
    });

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        let data: FormUtil.FieldValues = FormUtil.getFieldValues(e.currentTarget);

        setState({
            ...state,
            loading: true
        });

        apiClient.post('/contacts', { ...data })
            .then((response) => {
                setState({ ...state, loading: false });

                if (response.statusText === 'OK') {
                    props.onSave();

                    PubSub.publish('CONTACTS.REFRESH');
                    PubSub.publish('TOAST.SHOW', {
                        message: 'Contact Added',
                        autoHide: true,
                    });
                }
            })
            .catch((error) => {
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
                }
            });
    };

    const helperProps = (fieldName: string, defaultText: string = ''): HelperProps => {
        let ob: HelperProps = {
            helperText: state.errors?.[fieldName] || defaultText,
            error: !!(state.errors?.[fieldName]) ?? false,
        };
        return ob;
    };

    const onFocus = (e: React.FormEvent<HTMLFormElement>) => {
        const name = (e.target as HTMLInputElement).name ?? '';
        if (name && state.errors[name]) {
            const errors = { ...state.errors };
            delete errors[name];
            setState({
                ...state,
                errors: errors
            });
        }
    }

    return (
        <Dialog
            open={props.open}
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
                                    <TextFieldEx name="title" label="Title" sx={{ width: '50%' }} />
                                    <TextFieldEx name="firstname" label="First Name" required />
                                    <TextFieldEx name="lastname" label="Last Name" {...helperProps('lastname')} />
                                </Box>
                            </Fieldset>
                            <MultiFieldset
                                legend="Email Address"
                                defaultFieldLabel="Primary"
                                baseName="email"
                            >
                                <TextFieldEx name="email" label="Email Address" />
                            </MultiFieldset>
                        </Box>
                        <Box sx={{ overflowX: 'hidden', minWidth: 0 }}>
                            <MultiFieldset
                                baseName="address"
                                legend="Address"
                                defaultFieldLabel="Home"
                            >
                                <TextFieldEx name="street" label="Street" />
                                <TextFieldEx name="town" label="Town / City" />
                                <TextFieldEx name="county" label="County / State" />
                                <TextFieldEx name="postcode" label="Zip / Postal Code" />
                                <CountrySelect name="country_code" />
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
        </Dialog>
    );
}
