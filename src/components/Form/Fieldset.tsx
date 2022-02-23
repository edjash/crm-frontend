import { Box } from "@mui/material";


type FieldsetProps = {
    children: React.ReactNode;
    legend: string
};

export default function Fieldset(props: FieldsetProps) {

    return (
        <fieldset style={{ borderRadius: '6px' }}>
            <legend><span>{props.legend}</span></legend>
            <Box m={0} width={{
                md: 320
            }}>
                {props.children}
            </Box>
        </fieldset>
    );
}
