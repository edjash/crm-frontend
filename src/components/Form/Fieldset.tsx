import { Box, SxProps } from "@mui/material";

type FieldsetProps = {
    children: React.ReactNode;
    legend: string;
    styles?: Record<string, any>;
    boxStyles?: SxProps;
};

export default function Fieldset(props: FieldsetProps) {

    return (
        <fieldset style={{
            position: 'relative',
            borderRadius: '6px',
            ...props.styles
        }}>
            <legend><span>{props.legend}</span></legend>
            <Box sx={{ ...props.boxStyles }}>
                {props.children}
            </Box>
        </fieldset>
    );
}
