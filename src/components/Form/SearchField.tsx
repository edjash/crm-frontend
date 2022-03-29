import { Autocomplete, TextFieldProps, Typography } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { Controller } from "react-hook-form";
import apiClient from "../apiClient";
import TextFieldEx from "./TextFieldEx";

type SearchFieldProps = TextFieldProps & {
    endpoint: string;
    name: string;
    valueField?: string;
    labelField?: string;
    dataProperty?: string;
    options?: Record<string, string>[];
    defaultValue?: number;
}

type OptionType = {
    id?: number;
    label?: string;
};

const isValidOption = (option: any, valueField: string, labelField: string): boolean => {
    if (!option || typeof (option) !== 'object') {
        return false;
    }
    return (valueField in option && labelField in option);
};

const parseOptions = (
    options: Record<string, any>[],
    labelField: string,
    valueField: string
): OptionType[] => {
    const newOptions: OptionType[] = [];
    for (const item of options) {
        if (!isValidOption(item, valueField, labelField)) {
            console.error(`SearchField: The data returned from the server ` +
                `does not consist of objects with the required keys '${labelField}' and '${valueField}'. ` +
                `You can change the required keys by using the valueField and labelField props.`);
            break;
        }
        newOptions.push({
            id: item[valueField],
            label: item[labelField],
        });
    }
    return newOptions;
};

export default function SearchField(props: SearchFieldProps) {

    const valueField = props.valueField ?? 'id';
    const labelField = props.labelField ?? 'label';

    const [value, setValue] = useState<OptionType | null>(null);
    const [options, setOptions] = useState<OptionType[]>([]);
    const [inputValue, setInputValue] = useState('');

    const timer = useRef<NodeJS.Timeout>();


    const clearTimer = () => {
        if (timer.current) {
            clearTimeout(timer.current);
        }
    }

    const fetch = useCallback((query: string) => {
        apiClient.get(props.endpoint, { search: query })
            .then((res) => {
                const data = (props.dataProperty) ? res.data[props.dataProperty] : res.data;
                const options: OptionType[] = parseOptions(data, labelField, valueField);
                setOptions(options);
            }).catch((e) => {
                setOptions([]);
            });
    }, [
        props.endpoint,
        props.dataProperty,
        labelField,
        valueField
    ]);

    useEffect(() => {
        if (props.options) {
            const options = parseOptions(props.options, labelField, valueField);
            setOptions(options);
            if (props.defaultValue) {
                let opt = null;
                for (const item of options) {
                    if (item.id === props.defaultValue) {
                        opt = item;
                        break;
                    }

                }

                if (opt) {
                    setValue(opt);
                }
            }
        }
    }, [props, valueField, labelField, value]);

    useEffect(() => {
        clearTimer();
        if (inputValue === '') {
            clearTimer();
            setOptions(value ? [value] : []);
            return undefined;
        }

        timer.current = setTimeout(() => fetch(inputValue), 200);

        return () => {
            clearTimer();
        };
    }, [props.endpoint, value, inputValue, fetch]);

    return (
        <Controller
            name={props.name}
            render={({ ...controlProps }) => {
                const errorMessage = controlProps.fieldState.error?.message ?? '';
                const onChange = (selValue: OptionType | null) => {
                    controlProps.field.onChange(selValue ? selValue.id : null);
                }
                return (
                    <Autocomplete
                        getOptionLabel={(option) =>
                            typeof option === 'string' ? option : (option.label ?? '')
                        }
                        filterOptions={(x) => x}
                        options={options}
                        autoComplete
                        includeInputInList
                        filterSelectedOptions
                        value={value}
                        onChange={(event: any, newValue: OptionType | null) => {
                            setOptions(newValue ? [newValue, ...options] : options);
                            setValue(newValue);
                            onChange(newValue);
                        }}
                        onInputChange={(event, newInputValue) => {
                            setInputValue(newInputValue);
                        }}
                        isOptionEqualToValue={(option, value) => {
                            return (option?.id === value?.id);
                        }}
                        renderInput={(params) => (
                            <TextFieldEx
                                {...params}
                                label={props.label}
                                fullWidth
                                helperText={errorMessage || props?.helperText}
                            />
                        )}
                        renderOption={(props, option) => {
                            return (
                                <li {...props}>
                                    <Typography variant="body2" color="text.secondary">
                                        {option.label}
                                    </Typography>
                                </li>
                            );
                        }}
                    />
                );
            }}
        />
    );
}