import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { AppBar, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CountrySelect, { CountryType } from '../../components/CountrySelect';
import Overlay from '../../components/Overlay';
import { ChangeEvent, SyntheticEvent, useState } from 'react';
import apiClient from '../apiClient';
import Fieldset from '../Fieldset';
import TextFieldEx from '../TextFieldEx';

type CreateEditProps = DialogProps & {
    type: string,
    onCancel: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onSave: () => void;
};

export default function ContactCreateEdit(props: CreateEditProps) {

    const title = "New Contact";
    const [state, setState] = useState({
        loading: false,
        fieldValues: {

        }
    });

    const onSubmit = (e: SyntheticEvent) => {
        e.preventDefault();

        setState({
            ...state,
            loading: true
        });

        apiClient.post('/contacts', { ...state.fieldValues })
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
                setState({ ...state, loading: false });
                //errorResponse(appContext, error);
            });
    };

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {

        setState({
            ...state,
            fieldValues: {
                ...state.fieldValues,
                [e.target.name]: e.target.value
            },
        });
    };

    const onCountryChange = (event: ChangeEvent<{}>, value: CountryType | null) => {

        setState({
            ...state,
            fieldValues: {
                ...state.fieldValues,
                country_code: (value === null) ? '' : value.code
            }
        });
    }

    return (
        <Dialog
            open={props.open}
            onClose={props.onClose}
            fullScreen={false}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }}>
                {title}
                <IconButton aria-label="close" onClick={props.onCancel} className="closeButton">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <form onSubmit={onSubmit}>
                <DialogContent dividers={true} sx={{
                    display: 'grid',
                    gap: 1,
                    gridTemplateColumns: '2',

                }}>
                    <Fieldset label="Name">
                        <Box sx={{ display: 'grid', gap: 1, gridTemplateColumns: 'repeat(2, 1fr)' }}>
                            <TextFieldEx name="firstname" label="First Name" required onChange={onChange} />
                            <TextFieldEx name="lastname" label="Last Name" onChange={onChange} />
                        </Box>
                    </Fieldset>
                    <Fieldset label="Address">
                        <Box sx={{ display: 'grid' }}>
                            <TextFieldEx name="street" label="Street" onChange={onChange} />
                            <TextFieldEx name="town" label="Town / City" onChange={onChange} />
                            <TextFieldEx name="county" label="County / State" onChange={onChange} />
                            <TextFieldEx name="postcode" label="Zip / Postal Code" onChange={onChange} />
                            <CountrySelect name="country_code" onChange={onCountryChange} />
                        </Box>
                    </Fieldset>
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
