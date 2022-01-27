import TextField, { TextFieldProps } from "@mui/material/TextField";

export default function TextFieldEx(props: TextFieldProps) {

    return (
        <TextField
            {...props}
            variant="filled"
            margin="dense"
            className="textFieldEx"
            fullWidth
            InputLabelProps={{
                shrink: true,
            }}
        />
    );
}
