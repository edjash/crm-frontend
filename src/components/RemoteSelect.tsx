import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import React, { useEffect, useRef, useState } from 'react';
import apiClient from './apiClient';
import TextFieldEx from './TextFieldEx';
import { uniqueId } from 'lodash';
import { SxProps, Theme } from '@mui/material';

export type SelectOption = {
    value: string;
    label: string | JSX.Element;
};

export interface RemoteSelectProps {
    url?: string;
    name?: string;
    label?: string;
    options?: SelectOption[];
    valueField?: string;
    labelField?: string;
    defaultValue?: SelectOption;
    helperText?: string;
    error?: boolean;
    clearable?: boolean;
    sx?: SxProps<Theme> | undefined;
};

interface RemoteSelectState {
    dropdownOpen: boolean;
    options: SelectOption[];
    inputValue: string;
    defaultValue: SelectOption | null;
    key: string;
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
            options: props?.options ?? [],
            inputValue: props.defaultValue?.value ?? '',
            defaultValue: props.defaultValue ?? null,
            key: uniqueId('remoteSelect_'),
        }
    });

    const inputRef = useRef<HTMLInputElement>();
    const loading = state.dropdownOpen && state.options.length === 0;

    useEffect(() => {
        if (!loading) {
            return undefined;
        }
        if (props.url) {
            apiClient
                .get(props.url, {})
                .then((res) => {
                    const options: SelectOption[] = [];
                    const valueField = props.valueField ?? 'value';
                    const labelField = props.labelField ?? 'label';

                    res.data.map((item: Record<string, string>) => {
                        const value = item[valueField];
                        const label = item[labelField];
                        options.push({
                            value: value,
                            label: label
                        });
                    });

                    setState({ ...state, options: options });
                })
        }
    }, [loading]);

    useEffect(() => {
        setState(state => ({
            ...state,
            key: uniqueId('remoteSelect_'),//Required because of MUI Autocomplete bug.
            defaultValue: props.defaultValue || null,
            inputValue: props.defaultValue?.value || '',
        }));
    }, [props.defaultValue]);

    const onChange = (event: React.SyntheticEvent, selValue: SelectOption | null) => {
        setState(state => ({ ...state, inputValue: selValue?.value ?? '' }));
    }

    const setDropdownOpen = (open: boolean) => {
        setState(state => ({ ...state, dropdownOpen: open }));
    };

    return (
        <>
            <Autocomplete
                key={state.key}
                className="remoteSelect"
                disablePortal
                disableClearable={!props.clearable}
                open={state.dropdownOpen}
                onOpen={() => setDropdownOpen(true)}
                onClose={() => setDropdownOpen(false)}
                onChange={onChange}
                //getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) => {
                    return option?.value === value?.value;
                }}
                options={state.options}
                loading={loading}
                renderOption={(props, option, state) => (
                    <li {...props}>
                        {option.label == '' ?
                            <span> </span>
                            : option.label
                        }
                    </li>
                )}
                defaultValue={state.defaultValue || null}
                onFocus={() => {
                    if (inputRef) {
                        inputRef?.current?.focus();
                    }
                }}
                sx={props.sx}
                renderInput={(params) => (
                    <TextFieldEx
                        {...params}
                        label={props.label}
                        helperText={props?.helperText}
                        error={props?.error ?? false}
                        inputRef={inputRef}
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
            <input type="hidden" name={props.name} value={state.inputValue} readOnly />
        </>
    );
}
