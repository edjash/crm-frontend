import TextFieldEx from './TextFieldEx';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import React, { ChangeEvent, useEffect, useState } from 'react';
import apiClient from './apiClient';
import { TextField } from '@mui/material';

export type CountryType = {
    name: string;
    code: string;
};

export type CountrySelectProps = {
    className?: string;
    name?: string;
    value?: string;
    defaultValue?: CountryType;
    onChange?: (event: ChangeEvent<{}>, value: CountryType | null) => void;
};

export default function CountrySelect(props: CountrySelectProps) {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState<CountryType[]>([]);
    const [selectedCode, setSelected] = useState<string | null>(null);

    const loading = open && options.length === 0;

    useEffect(() => {
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

    useEffect(() => {
        if (!open) {
            setOptions([]);
        }
    }, [open]);

    const onChange = (event: ChangeEvent<{}>, opt: CountryType | null) => {

        const code = opt?.code ?? null;

        setSelected(code);

        if (props.onChange) {
            props.onChange(event, opt);
        }
    }

    return (
        <>
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
                onChange={onChange}
                renderInput={(params) => (
                    <TextFieldEx
                        {...params}
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
            <TextFieldEx name={props.name} value={selectedCode ?? ''} sx={{ display: 'none' }} />
        </>
    );
}