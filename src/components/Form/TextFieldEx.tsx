import TextField, { TextFieldProps } from "@mui/material/TextField";
import { useFormContext } from "react-hook-form";

type TextFieldExProps = TextFieldProps & {
    name: string;
    hidden?: boolean;
}

export default function TextFieldEx(props: TextFieldExProps) {
    const { register, formState } = useFormContext();

    let errorMsg = formState.errors?.[props.name]?.message;

    return (
        <TextField
            {...props}
            sx={{
                display: props.hidden ? 'none' : 'block',
                ...props.sx
            }}
            {...register(props.name)}
            error={!!props?.error || !!errorMsg}
            helperText={errorMsg || props?.helperText}
            InputProps={{
                required: false,
                ...props.InputProps
            }}
        />
    );
}


