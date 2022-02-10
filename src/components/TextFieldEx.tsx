import TextField, { TextFieldProps } from "@mui/material/TextField";
import { ChangeEvent } from "react";
import { Controller } from "react-hook-form";

type TextFieldExProps = TextFieldProps & {
    name: string;
}

export function TextFieldEx(props: TextFieldExProps) {
    return (
        <Controller
            render={({ ...controlProps }) => {
                const errorMessage = controlProps.formState.errors?.[props.name]?.message ?? '';

                const onChange = (e: ChangeEvent<HTMLInputElement>) => {
                    controlProps.field.onChange(e.target.value);
                    if (props.onChange) {
                        props.onChange(e);
                    }
                }

                return (
                    <TextField
                        {...props}
                        error={!!(errorMessage)}
                        helperText={errorMessage || props?.helperText}
                        inputRef={controlProps.field.ref}
                        onChange={onChange}
                        defaultValue={controlProps.field.value}
                        InputProps={{
                            required: false,
                            ...props.InputProps
                        }}
                    />
                );
            }}
            name={props.name}
        />
    );
}
export default TextFieldEx;

