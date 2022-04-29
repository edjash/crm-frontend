import { Autocomplete } from "@mui/material";
import { Ref, SyntheticEvent, useEffect, useState } from "react";
import { Controller, FieldError } from "react-hook-form";
import TextFieldEx from "./TextFieldEx";

type SelectOption = {
    value: string;
    label: string;
};
type DefaultValue = string | null;
type ReturnValue = string | null;
type SelectedOption = SelectOption | null;

interface BasicSelectProps {
    name: string;
    options: SelectOption[];
    label?: string;
    disableClearable?: boolean;
    errors?: FieldError;
    inputRef?: Ref<HTMLInputElement>;
    helperText?: string;
    defaultValue?: DefaultValue;
    onChange?: (selValue: any) => void;
}

interface BasicSelectState {
    dropdownOpen: boolean;
    options: SelectOption[];
    selectedOption: SelectedOption;
};

export default function BasicSelect(props: BasicSelectProps) {
    return (
        <Controller
            render={({ ...controlProps }) => {
                const errorMessage = controlProps.fieldState.error?.message ?? '';
                const onChange = (selValue: ReturnValue) => {
                    controlProps.field.onChange(selValue ?? '');
                }

                return (
                    <BasicSelectBase
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

const getSelectedOption = (options: SelectOption[], value?: DefaultValue): SelectedOption => {
    let selectedOption: SelectedOption = null;
    options.forEach((option: SelectOption, index) => {
        if (option.value === value) {
            selectedOption = option;
        }
    });
    return selectedOption;
}

export function BasicSelectBase(props: BasicSelectProps) {

    const [state, setState] = useState<BasicSelectState>({
        dropdownOpen: false,
        options: props.options ?? [],
        selectedOption: null,
    });

    useEffect(() => {
        let options = state.options;
        let selectedOption = getSelectedOption(options, props.defaultValue);
        if (selectedOption === null && props.defaultValue) {
            selectedOption = {
                label: props.defaultValue,
                value: props.defaultValue
            };
            options.push(selectedOption);
        }

        setState(state => ({
            ...state,
            options: options,
            selectedOption: selectedOption,
        }));

    }, [props.name, props.defaultValue, state.options]);

    const onChange = (event: SyntheticEvent, selOption: SelectedOption) => {
        if (props.onChange) {
            props.onChange(selOption?.value);
        }

        setState(state => ({
            ...state,
            selectedOption: selOption,
        }));
    }

    const setDropdownOpen = (open: boolean) => {
        setState(state => ({
            ...state,
            dropdownOpen: open,
        }));
    };

    return (
        <Autocomplete
            className="basicSelect"
            disableClearable={props?.disableClearable}
            open={state.dropdownOpen}
            onOpen={() => setDropdownOpen(true)}
            onClose={() => setDropdownOpen(false)}
            onChange={onChange}
            getOptionLabel={(option) => option.label ?? ''}
            isOptionEqualToValue={(option, value) => {
                return option.value === value.value;
            }}
            options={state.options}
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
                    }}
                />
            )}
        />
    );
}
