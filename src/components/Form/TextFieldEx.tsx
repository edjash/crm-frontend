import TextField, { TextFieldProps } from "@mui/material/TextField";
import { Controller, useFormContext } from "react-hook-form";
import SkeletonEx from "./SkeletonEx";

type TextFieldExProps = TextFieldProps & {
    name?: string;
    hidden?: boolean;
    skeleton?: boolean;
}

export default function TextFieldEx(props: TextFieldExProps) {
    const { formState, control } = useFormContext();

    let errorMsg = props.name ? formState.errors?.[props.name]?.message : '';

    return (
        <Controller
            render={({ field }) => (
                <SkeletonEx>
                    <TextField
                        {...props}
                        {...field}
                        value={field.value ?? ''}
                        error={!!props?.error || !!errorMsg}
                        helperText={errorMsg || props?.helperText}
                        InputProps={{
                            required: false,
                            ...props.InputProps
                        }}
                        sx={{
                            display: props.hidden ? 'none' : 'inline-block',
                            ...props.sx
                        }}
                    />
                </SkeletonEx>
            )}
            control={control}
            name={props.name ?? ''}
            defaultValue={props?.defaultValue ?? ''}
        />
    );
}


