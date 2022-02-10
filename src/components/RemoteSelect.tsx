import { SxProps, TextField, Theme } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import { Ref, useEffect, useState } from 'react';
import { Control, FieldError, FieldValues } from 'react-hook-form';
import apiClient from './apiClient';

export type SelectOption = {
    value: string;
    label: string;
};

export interface RemoteSelectProps {
    name: string;
    url?: string;
    label?: string;
    options?: SelectOption[];
    valueField?: string;
    labelField?: string;
    defaultValue?: SelectOption;
    helperText?: string;
    errors?: FieldError;
    disableClearable?: boolean;
    sx?: SxProps<Theme>;
    control?: Control<FieldValues, object>;
    inputRef?: Ref<HTMLInputElement>;
    onChange?: (selValue: SelectOption | null) => void;
};

interface RemoteSelectState {
    dropdownOpen: boolean;
    loading: boolean;
    loadCount: number;
    options: SelectOption[];
    inputValue: string;
    defaultValue: SelectOption | null;
};

export default function RemoteSelect(props: RemoteSelectProps) {

    const [state, setState] = useState<RemoteSelectState>(() => {

        const options: SelectOption[] = props.options ?? [];
        const value = props.defaultValue?.value || '';
        if (!options.find(option => option.value == value)) {
            options.push({
                value: value,
                label: value,
            });
        }

        return {
            dropdownOpen: false,
            loading: false,
            loadCount: 0,
            options: options,
            inputValue: props.defaultValue?.value ?? '',
            defaultValue: props.defaultValue ?? null,
        }
    });

    useEffect(() => {
        if (!state.loading) {
            return undefined;
        }

        if (props.url) {
            apiClient
                .get(props.url, {})
                .then((res) => {
                    const options: SelectOption[] = [];
                    const valueField = props.valueField ?? 'value';
                    const labelField = props.labelField ?? 'label';

                    if (res.data.length) {
                        if (!(labelField in res.data[0]) || !(valueField in res.data[0])) {
                            console.log(`RemoteSelect '${props.name}', valueField or labelField are invalid`);
                            return;
                        }
                    }

                    res.data.map((item: Record<string, string>) => {
                        const value = item[valueField];
                        const label = item[labelField];
                        options.push({
                            value: value,
                            label: label
                        });
                    });

                    setState(state => ({
                        ...state,
                        loading: false,
                        loadCount: state.loadCount + 1,
                        options: options
                    }));
                })
        }
    }, [state.loading]);

    const onChange = (event: React.SyntheticEvent, selValue: SelectOption | null) => {
        setState(state => ({
            ...state,
            inputValue: selValue?.value ?? '',
            defaultValue: selValue
        }));
        if (props.onChange) {
            console.log(selValue);
            props.onChange(selValue);
        }
    }

    const setDropdownOpen = (open: boolean) => {
        setState(state => ({
            ...state,
            dropdownOpen: open,
            loading: (open && state.loadCount === 0),
        }));
    };

    return (
        <Autocomplete
            className="remoteSelect"
            disableClearable={props?.disableClearable}
            open={state.dropdownOpen}
            onOpen={() => setDropdownOpen(true)}
            onClose={() => setDropdownOpen(false)}
            onChange={onChange}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) => {
                return option?.value === value?.value;
            }}
            options={state.options}
            loading={state.loading}
            renderOption={(props, option) => {
                return (
                    <li {...props} key={option.value}>
                        {option.label == '' ?
                            <span> </span>
                            : option.label
                        }
                    </li>
                );
            }}
            value={state.defaultValue || null}
            ref={props.inputRef}
            sx={props.sx}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={props.label}
                    helperText={props?.errors?.message ?? props?.helperText}
                    error={!!props?.errors ?? false}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {state.loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                />
            )}
        />
    );
}
