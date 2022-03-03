import TextField, { TextFieldProps } from "@mui/material/TextField";
import { Controller, useFormContext } from "react-hook-form";

type TextFieldExProps = TextFieldProps & {
    name: string;
    hidden?: boolean;
}

export default function TextFieldEx(props: TextFieldExProps) {
    const { register, formState, control } = useFormContext();

    let errorMsg = formState.errors?.[props.name]?.message;

    //console.log(props.name, props);
    return (
        <Controller
            render={({ field }) => (
                <TextField
                    {...props}
                    {...field}
                    sx={{
                        display: props.hidden ? 'none' : 'block',
                        ...props.sx
                    }}
                    //{...register(props.name)}
                    value={field.value ?? ''}
                    error={!!props?.error || !!errorMsg}
                    helperText={errorMsg || props?.helperText}
                    InputProps={{
                        required: false,
                        ...props.InputProps
                    }}
                />
            )}
            control={control}
            name={props.name}
            defaultValue={props?.defaultValue ?? ''}
        />
    );
}


