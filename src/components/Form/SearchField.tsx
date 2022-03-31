import { SxProps, Theme } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { HTMLAttributes, Ref, SyntheticEvent, useRef, useState } from 'react';
import { Control, Controller, FieldError, FieldValues } from 'react-hook-form';
import apiClient from '../apiClient';
import TextFieldEx from './TextFieldEx';
import { Add as AddIcon } from "@mui/icons-material";


export type SelectOption = {
    value: string;
    label: string;
};

export interface SearchFieldProps {
    name: string;
    url: string;
    label?: string;
    options?: SelectOption[];
    valueField?: string;
    labelField?: string;
    defaultValue?: Record<string, string>;
    helperText?: string;
    errors?: FieldError;
    sx?: SxProps<Theme>;
    control?: Control<FieldValues, object>;
    inputRef?: Ref<HTMLInputElement>;
    remoteDataProperty?: string;
    addNewItemLabel?: string;
    onAddClick?: () => Promise<Record<string, any>>;
    onChange?: (selOption: Record<string, string> | null) => void;
};

interface SearchFieldState {
    dropdownOpen: boolean;
    loading: boolean;
    options: SelectOption[];
    selectedOption: SelectOption | null
}

export default function SearchField(props: SearchFieldProps) {
    return (
        <Controller
            name={props.name}
            render={({ ...controlProps }) => {
                const errorMessage = controlProps.fieldState.error?.message ?? '';
                return (
                    <SearchFieldBase
                        {...props}
                        errors={controlProps.fieldState.error}
                        helperText={errorMessage || props?.helperText}
                        inputRef={controlProps.field.ref}
                        onChange={selOption => controlProps.field.onChange(selOption)}
                        defaultValue={controlProps.field.value}
                    />
                );
            }}
        />
    );
}

const isValidOption = (option: any, valueField: string, labelField: string): boolean => {
    if (!option || typeof (option) !== 'object') {
        return false;
    }
    return (valueField in option && labelField in option);
};

export function SearchFieldBase(props: SearchFieldProps) {
    const valueField: string = props.valueField ?? 'value';
    const labelField: string = props.labelField ?? 'label';
    const timerRef = useRef<NodeJS.Timeout>();
    const inputValueRef = useRef<string>();

    const formChange = (selOption: SelectOption | null) => {
        //pass the selected value back to RHF onChange event in original format
        if (props.onChange) {
            if (selOption) {
                props.onChange({
                    [valueField]: selOption.value,
                    [labelField]: selOption.label,
                });
            } else {
                props.onChange(null);
            }
        }
    };

    const [state, setState] = useState<SearchFieldState>(() => {
        let options: SelectOption[] = props.options ?? [];
        let selectedOption: SelectOption | null = null;
        if (typeof props.defaultValue === 'object' && props.defaultValue) {
            if (!isValidOption(props.defaultValue, valueField, labelField)) {
                throw new Error(`SearchField: The defaultValue object does contain the required keys  ` +
                    `'${labelField}' and '${valueField}'. You can change the required keys by using ` +
                    `the valueField and labelField props.`);
            }

            selectedOption = {
                value: props.defaultValue?.[valueField] ?? '',
                label: props.defaultValue?.[labelField] ?? '',
            };
            options.push(selectedOption);
        }

        formChange(selectedOption);

        return {
            dropdownOpen: false,
            loading: false,
            loadCount: 0,
            options: options,
            selectedOption: selectedOption,
        }
    });

    const fetch = (query: string) => {
        apiClient.get(props.url, { search: query, searchType: 'begin' })
            .then((res) => {
                const options: SelectOption[] = [];
                const data = (props.remoteDataProperty) ? res.data[props.remoteDataProperty] : res.data;
                if (data.length) {
                    if (!isValidOption(data[0], valueField, labelField)) {
                        console.error(`SearchField: The data returned from the server did not contain ` +
                            `the required keys '${labelField}' and '${valueField}'. ` +
                            `You can change the required keys by using the valueField and labelField props.`);
                        return;
                    }
                }
                data.forEach((item: Record<string, string>) => {
                    options.push({
                        value: item[valueField],
                        label: item[labelField],
                    });
                });
                setState(state => ({
                    ...state,
                    loading: false,
                    options: options
                }));
            });
    }

    const onInputChange = (event: SyntheticEvent, inputValue: string) => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        const query = inputValue.trim();
        inputValueRef.current = query;

        if (query.length === 0) {
            return;
        }
        timerRef.current = setTimeout(() => { fetch(query) }, 200);
    }

    const onChange = (event: SyntheticEvent, selOption: SelectOption | null) => {
        formChange(selOption);
        setState(state => ({
            ...state,
            selectedOption: selOption,
        }));
    }

    const setDropdownOpen = (open: boolean) => {
        setState(state => ({
            ...state,
            dropdownOpen: open,
            loading: !!(open && inputValueRef.current),
        }));
    };

    const onAddOptionClick = () => {
        if (props.onAddClick) {
            const create = props.onAddClick();
            create.then((data) => {
                console.log("OK", data);
            });
        }
    }

    return (
        <Autocomplete
            // autoComplete
            // includeInputInList
            // filterSelectedOptions
            //filterOptions={(x) => x}
            //PaperComponent={AutocompletePaperEx}
            filterOptions={(options: SelectOption[]) => {
                options.push({
                    value: "--add-new-item--",
                    label: props.addNewItemLabel ?? "Add New"
                });
                return options;
            }}
            open={state.dropdownOpen}
            onOpen={() => setDropdownOpen(true)}
            onClose={() => setDropdownOpen(false)}
            onChange={onChange}
            onInputChange={onInputChange}
            getOptionLabel={(option) => option.label ?? ''}
            isOptionEqualToValue={(option, value) => {
                //Nescessary until MUI bug is fixed:
                //https://github.com/mui/material-ui/issues/29727#issuecomment-1036226466
                return true;
                //return option.value === value?.value;
            }}
            options={state.options}
            loading={state.loading}
            value={state.selectedOption}
            ref={props.inputRef}
            ListboxProps={{
                style: { paddingBottom: 0 }
            }}
            renderOption={(props: HTMLAttributes<HTMLLIElement>, option: SelectOption) => {
                if (option?.value === '--add-new-item--') {
                    return (
                        <li
                            className={`${props.className} searchFieldAdd`}
                            onClick={onAddOptionClick}
                            key={option.value}
                            style={{ borderTop: '1px dashed', display: 'flex', alignItems: 'center' }}
                        >
                            <AddIcon />
                            {option.label}
                        </li>
                    );
                }
                return (
                    <li {...props}>{option.label}</li>
                );
            }}
            renderInput={(params) => (
                <TextFieldEx
                    {...params}
                    label={props.label}
                    helperText={props?.errors?.message ?? props?.helperText}
                    error={!!props?.errors ?? false}
                    InputProps={{
                        ...params.InputProps,
                    }}
                />
            )}
        />
    );
}

