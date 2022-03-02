import { Button, ButtonProps } from "@mui/material";


export default function DialogButton(props: ButtonProps) {

    return (
        <Button size="small" variant="contained" {...props}>
            {props.children}
        </Button>
    );
}