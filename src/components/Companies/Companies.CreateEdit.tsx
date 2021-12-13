import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CountrySelect, { CountryType } from '../../components/CountrySelect';
import Overlay from '../../components/Overlay';
import { ChangeEvent, FormEvent, FormEventHandler, SyntheticEvent, useState } from 'react';
import apiClient from '../apiClient';
import Fieldset from '../Fieldset';
import TextFieldEx from '../TextFieldEx';
import { errorResponse } from '../../components/FormError';

type CreateEditProps = DialogProps & {
    type: string,
    onCancel: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onSave: () => void;
};

export default function CompanyCreateEdit(props: CreateEditProps) {

    const title = "New Company";
    const [state, setState] = useState({
        loading: false,
        fieldValues: {

        }
    });

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setState({
            ...state,
            loading: true
        });

        apiClient.post('/companies', { ...state.fieldValues })
            .then((response) => {
                setState({ ...state, loading: false });

                if (response.statusText === 'OK') {
                    props.onSave();

                    PubSub.publish('COMPANIES.REFRESH');
                    PubSub.publish('TOAST.SHOW', {
                        message: 'Company Added',
                        autoHide: true,
                    });
                }
            })
            .catch((error) => {
                setState({ ...state, loading: false });
                errorResponse(error);
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
            maxWidth="xs"
            fullWidth
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }}>
                {title}
                <IconButton aria-label="close" onClick={props.onCancel} className="closeButton">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <form onSubmit={onSubmit}>
                <DialogContent dividers={true} sx={{
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                    <Fieldset label="Name">
                        <TextFieldEx fullWidth name="name" label="Company Name" required onChange={onChange} />
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
                    <Button size="small" variant="contained" type="submit" autoFocus>
                        Save
                    </Button>
                </DialogActions>
            </form>
            <Overlay open={state.loading} />
        </Dialog>
    );
}
