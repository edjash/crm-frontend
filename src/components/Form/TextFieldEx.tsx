import TextField, { TextFieldProps } from "@mui/material/TextField";
import { useFormContext } from "react-hook-form";

type TextFieldExProps = TextFieldProps & {
    name: string;
}

export default function TextFieldEx(props: TextFieldExProps) {
    const { register, formState } = useFormContext();

    let error = formState.errors?.[props.name]?.message;

    return (
        <TextField
            {...props}
            {...register(props.name)}
            error={!!(error)}
            helperText={error || props?.helperText}
            InputProps={{
                required: false,
                ...props.InputProps
            }}
        />
    );
}


