import { SxProps, Theme } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import { Ref, useEffect, useState } from 'react';
import { Control, Controller, FieldError, FieldValues } from 'react-hook-form';
import apiClient from '../apiClient';
import TextFieldEx from './TextFieldEx';

export type SelectOption = Record<string, string>;

export interface RemoteSelectProps {
    name: string;
    url?: string;
    valueField?: string;
    labelField?: string;
    defaultValue?: any;
    label?: string;
    options?: SelectOption[];
    helperText?: string;
    errors?: FieldError;
    disableClearable?: boolean;
    sx?: SxProps<Theme>;
    control?: Control<FieldValues, object>;
    inputRef?: Ref<HTMLInputElement>;
    onChange?: (selValue: any) => void;
};

interface RemoteSelectState {
    dropdownOpen: boolean;
    loading: boolean;
    loadCount: number;
    options: SelectOption[];
    selectedOption: SelectOption | null;
    init: boolean;
};

interface SelectConfig {
    options: SelectOption[];
    selectedOption: SelectOption | null;
}

export default function RemoteSelect(props: RemoteSelectProps) {
    return (
        <Controller
            render={({ ...controlProps }) => {
                const errorMessage = controlProps.fieldState.error?.message ?? '';
                return (
                    <RemoteSelectBase
                        {...props}
                        errors={controlProps.fieldState.error}
                        helperText={errorMessage || props?.helperText}
                        inputRef={controlProps.field.ref}
                        onChange={controlProps.field.onChange}
                        defaultValue={controlProps.field.value}
                    />
                );
            }}
            name={props.name}
        />
    );
}

const isValidOption = (option: any, valueField: string, labelField: string): boolean => {
    if (!option || typeof (option) !== 'object') {
        return false;
    }
    return (valueField in option && labelField in option);
};

const getSelectConfig = (
    defaultValue: any,
    valueField: string,
    labelField: string,
    defaultOptions?: SelectOption[],
): SelectConfig => {

    let options: SelectOption[] = defaultOptions ?? [];
    let selectedOption = null;

    if (typeof (defaultValue) === 'object' && defaultValue) {
        if (!isValidOption(defaultValue, valueField, labelField)) {
            console.error(`RemoteSelect: The defaultValue object does contain the required keys  ` +
                `'${labelField}' and '${valueField}'. You can change the required keys by using ` +
                `the valueField and labelField props.`, defaultValue);
            defaultValue = null;
        }
        selectedOption = defaultValue;
    }

    if (defaultValue !== null) {
        options.forEach((item) => {
            if (!isValidOption(item, valueField, labelField)) {
                console.error(`RemoteSelect: The options array returned from the server ` +
                    `does not consist of objects with the required keys '${labelField}' and '${valueField}'. ` +
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

    return {
        options: options,
        selectedOption: selectedOption
    };
}

export function RemoteSelectBase(props: RemoteSelectProps) {

    const defaultValue = props?.defaultValue ?? null;
    const valueField: string = props.valueField ?? 'value';
    const labelField: string = props.labelField ?? 'label';

    const [state, setState] = useState<RemoteSelectState>(() => {
        return {
            dropdownOpen: false,
            loading: false,
            loadCount: 0,
            options: [],
            selectedOption: null,
            init: false
        }
    });

    useEffect(() => {
        const selCfg = getSelectConfig(defaultValue, valueField, labelField, props.options);

        setState(state => ({
            ...state,
            init: true,
            selectedOption: selCfg.selectedOption,
            options: selCfg.options,
        }));
    }, [defaultValue, valueField, labelField, props.options]);

    /** Fetch remote data **/
    useEffect(() => {
        if (!state.loading) {
            return undefined;
        }

        if (props?.url) {
            apiClient
                .get(props.url, {})
                .then((res) => {
                    const options: SelectOption[] = [];
                    if (res.data.length) {
                        if (!isValidOption(res.data[0], valueField, labelField)) {
                            console.error(`RemoteSelect: The data returned from the server did not contain ` +
                                `the required keys '${labelField}' and '${valueField}'. ` +
                                `You can change the required keys by using the valueField and labelField props.`);
                            return;
                        }
                    }

                    res.data.forEach((item: Record<string, string>) => {
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
    }, [
        labelField,
        valueField,
        state.loading,
        props.url,
    ]);

    const onChange = (event: React.SyntheticEvent, selValue: SelectOption | null) => {
        if (props.onChange) {
            props.onChange(selValue);
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
            renderInput={(params) => (
                <TextFieldEx
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

