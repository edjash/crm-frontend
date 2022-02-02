import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import React, { useEffect, useRef, useState } from 'react';
import apiClient from './apiClient';
import TextFieldEx from './TextFieldEx';
import { uniqueId } from 'lodash';

export type SelectOption = {
    name: string;
    value: string;
};

export interface RemoteSelectProps {
    url: string;
    name?: string;
    label?: string;
    valueField?: string;
    nameField?: string;
    defaultValue?: SelectOption;
    helperText?: string;
    error?: boolean;
};

interface RemoteSelectState {
    dropdownOpen: boolean;
    options: SelectOption[];
    inputValue: string;
    defaultValue: SelectOption | null;
    key: string;
};

export default function RemoteSelect(props: RemoteSelectProps) {

    const [state, setState] = useState<RemoteSelectState>({
        dropdownOpen: false,
        options: [],
        inputValue: props.defaultValue?.value ?? '',
        defaultValue: props.defaultValue ?? null,
        key: 'dssdf'
    });

    const inputRef = useRef<HTMLInputElement>();
    const loading = state.dropdownOpen && state.options.length === 0;

    useEffect(() => {
        if (!loading) {
            return undefined;
        }
        apiClient
            .get(props.url, {})
            .then((res) => {
                const options: SelectOption[] = [];
                const valueField = props.valueField ?? 'value';
                const nameField = props.nameField ?? 'name';

                res.data.map((item: Record<string, string>) => {
                    const name = item[nameField];
                    const value = item[valueField];
                    options.push({
                        name: name,
                        value: value,
                    });
                });

                setState({ ...state, options: options });
            })
    }, [loading]);

    useEffect(() => {
        setState(state => ({
            ...state,
            key: `${uniqueId('remoteSelect_')}`,//Required because of MUI Autocomplete bug.
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
                open={state.dropdownOpen}
                onOpen={() => setDropdownOpen(true)}
                onClose={() => setDropdownOpen(false)}
                onChange={onChange}
                isOptionEqualToValue={(option, value) => {
                    return option?.value === value?.value;
                }}
                getOptionLabel={(option) => option?.name ?? ''}
                options={state.options}
                loading={loading}
                defaultValue={state.defaultValue || null}
                onFocus={() => {
                    if (inputRef) {
                        inputRef?.current?.focus();
                    }
                }}
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
