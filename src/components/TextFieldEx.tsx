import TextField, { TextFieldProps } from "@mui/material/TextField";
import { useEffect, useRef } from "react";

export default function TextFieldEx(props: TextFieldProps) {

    const ref = useRef<HTMLInputElement>();
    
    useEffect(() => {
        if (ref.current) {
            ref.current.value = `${props?.defaultValue}`;
        }
    }, [props.defaultValue]);

    return (
        <TextField
            {...props}
            variant="filled"
            margin="dense"
            fullWidth
            inputRef={ref}
  
        />
    );
}
