import TextField, { TextFieldProps } from "@mui/material/TextField";

export default function TextFieldEx(props: TextFieldProps) {
    return (
        <TextField {...props} margin="dense" className="textFieldEx" InputLabelProps={{
            shrink: true,
        }} />
    );
}
