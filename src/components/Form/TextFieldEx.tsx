import { Skeleton } from "@mui/material";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import { Controller, useFormContext } from "react-hook-form";

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
                <div style={{
                    display: 'inline-block',
                    position: 'relative',
                    width: '100%'
                }} >
                    <Skeleton
                        className="skeletonEx"
                        sx={{
                            display: 'none',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            opacity: 1
                        }}
                    />
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

                </div>
            )}
            control={control}
            name={props.name ?? ''}
            defaultValue={props?.defaultValue ?? ''}
        />
    );
}


