import TextFieldEx from './TextFieldEx';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import React, { ChangeEvent, SyntheticEvent } from 'react';
import apiClient from './apiClient';

export type CountryType = {
    name: string;
    code: string;
};

export type CountrySelectProps = {
    className?: string;
    name?: string
    onChange?: (event: ChangeEvent<{}>, value: CountryType | null) => void;
};

export default function CountrySelect(props: CountrySelectProps) {
    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState<CountryType[]>([]);
    const loading = open && options.length === 0;

    React.useEffect(() => {
        if (!loading) {
            return undefined;
        }
        apiClient
            .get('/countries', {})
            .then((res) => {
                const countries = res.data;
                setOptions(countries);
            })
    }, [loading]);

    React.useEffect(() => {
        if (!open) {
            setOptions([]);
        }
    }, [open]);

    return (
        <Autocomplete
            className="countrySelect"
            open={open}
            onOpen={() => {
                setOpen(true);
            }}
            onClose={() => {
                setOpen(false);
            }}
            isOptionEqualToValue={(option, value) => option.name === value.name}
            getOptionLabel={(option) => option.name}
            options={options}
            loading={loading}
            renderInput={(params) => (
                <TextFieldEx
                    {...params}
                    name={props.name}
                    label="Country"
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <React.Fragment>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </React.Fragment>
                        ),
                    }}
                />
            )}
        />
    );
}