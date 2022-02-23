import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { ChangeEvent, FormEvent, useState } from 'react';
import Overlay from '../../components/Overlay';
import apiClient from '../apiClient';
import Fieldset from '../Form/Fieldset';
import RemoteSelect from '../Form/RemoteSelect';
import TextFieldEx from '../Form/TextFieldEx';

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

    // const onCountryChange = (event: ChangeEvent<{}>, value: CountryType | null) => {

    //     setState({
    //         ...state,
    //         fieldValues: {
    //             ...state.fieldValues,
    //             country_code: (value === null) ? '' : value.code
    //         }
    //     });
    // }

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
                            <RemoteSelect
                                label="Country"
                                url="/countries"
                                valueField="code"
                                labelField="name"
                                name="country"
                                clearable
                            />
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
