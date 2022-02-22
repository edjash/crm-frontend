import { Box } from "@mui/material";


type FieldsetProps = {
    children: React.ReactNode;
    label: string
};

export default function Fieldset(props: FieldsetProps) {

    return (
        <fieldset style={{ borderRadius: '6px'}}>
            <legend><span>{props.label}</span></legend>
            <Box m={0} width={{
                md: 320
            }}>
                {props.children}
            </Box>
        </fieldset>
    );
}
