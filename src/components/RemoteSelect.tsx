import { SxProps, TextField, Theme } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import { Ref, useEffect, useState } from 'react';
import { Control, Controller, FieldError, FieldValues } from 'react-hook-form';
import apiClient from './apiClient';

export type SelectOption = Record<string, string>;

export interface RemoteSelectProps {
    name: string;
    url?: string;
    label?: string;
    options?: SelectOption[];
    valueField?: string;
    labelField?: string;
    defaultValue?: any;
    helperText?: string;
    errors?: FieldError;
    disableClearable?: boolean;
    sx?: SxProps<Theme>;
    control?: Control<FieldValues, object>;
    inputRef?: Ref<HTMLInputElement>;
    onChange?: (selValue: string | null) => void;
};

interface RemoteSelectState {
    dropdownOpen: boolean;
    loading: boolean;
    loadCount: number;
    options: SelectOption[];
    selectedOption: SelectOption | null;
};

export default function RemoteSelect(props: RemoteSelectProps) {

    let defaultValue = props?.defaultValue ?? null;
    const valueField: string = props.valueField ?? 'value';
    const labelField: string = props.labelField ?? 'label';

    console.log(props.name, props.defaultValue);

    const isValidOption = (option: any): boolean => {
        if (!option || typeof (option) !== 'object') {
            return false;
        }
        return (valueField in option && labelField in option);
    };

    const [state, setState] = useState<RemoteSelectState>(() => {

        let options: SelectOption[] = props.options ?? [];
        let selectedOption = null;

        if (typeof (defaultValue) === 'object') {
            if (!isValidOption(defaultValue)) {
                console.error(`RemoteSelect: The defaultValue object does contain the required keys  ` +
                    `'${labelField}' and '${valueField}'. You can change the required keys by using ` +
                    `the valueField and labelField props.`);
                defaultValue = null;
            }
            selectedOption = defaultValue;
        }

        if (defaultValue !== null) {

            options.map((item) => {
                if (!isValidOption(item)) {
                    console.error(`RemoteSelect: The options array does not consist of objects ` +
                        `with the required keys '${labelField}' and '${valueField}'. ` +
                        `You can change the required keys by using the valueField and labelField props.`);
                    return;
                }

                if (typeof (defaultValue) === 'object') {
                    if (item[valueField] === defaultValue[valueField]) {
                        selectedOption = item;
                    }
                } else if (item[valueField] === defaultValue) {
                    selectedOption = item;
                }
            });

            if (selectedOption === null && defaultValue !== '') {
                selectedOption = {
                    [valueField]: defaultValue,
                    [labelField]: defaultValue,
                };
                options.push(selectedOption);
            }
        }

        console.log("SEL", selectedOption);

        return {
            dropdownOpen: false,
            loading: false,
            loadCount: 0,
            options: options,
            selectedOption: selectedOption,
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
                    if (res.data.length) {
                        if (!isValidOption(res.data[0])) {
                            console.error(`RemoteSelect: The data returned from the server did not contain ` +
                                `the required keys '${labelField}' and '${valueField}'. ` +
                                `You can change the required keys by using the valueField and labelField props.`);
                            return;
                        }
                    }

                    res.data.map((item: Record<string, string>) => {
                        const value = item[valueField];
                        const label = item[labelField];
                        options.push({
                            [valueField]: value,
                            [labelField]: label,
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
        if (props.onChange) {
            props.onChange(selValue?.[valueField] ?? null);
        }

        setState(state => ({
            ...state,
            selectedOption: selValue,
        }));
    }

    const setDropdownOpen = (open: boolean) => {
        setState(state => ({
            ...state,
            dropdownOpen: open,
            loading: !!(props?.url && open && (state.loadCount === 0)),
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
            getOptionLabel={(option) => option?.[labelField] ?? ''}
            isOptionEqualToValue={(option, value) => {
                return option?.[valueField] === value?.[valueField];
            }}
            options={state.options}
            loading={state.loading}
            value={state.selectedOption}
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

export function RemoteSelectEx(props: RemoteSelectProps) {
    return (
        <Controller
            render={({ ...controlProps }) => {
                const errorMessage = controlProps.fieldState.error?.message ?? '';
                const onChange = (selValue: string | null) => {
                    controlProps.field.onChange(selValue);
                }

                return (
                    <RemoteSelect
                        {...props}
                        errors={controlProps.fieldState.error}
                        helperText={errorMessage || props?.helperText}
                        inputRef={controlProps.field.ref}
                        onChange={onChange}
                        defaultValue={controlProps.field.value}
                    />
                );
            }}
            name={props.name}
        />
    );
}
