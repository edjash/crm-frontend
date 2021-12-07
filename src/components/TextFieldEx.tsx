import TextField, { TextFieldProps } from "@material-ui/core/TextField";

export default function TextFieldEx(props: TextFieldProps) {
    return (
        <TextField {...props} variant="filled" className="textFieldEx" InputLabelProps={{
            shrink: true,
        }} />
    );
}
