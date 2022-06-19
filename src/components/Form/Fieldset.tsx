import { Box, SxProps, useTheme } from "@mui/material";

type FieldsetProps = {
    children: React.ReactNode;
    legend: string;
    styles?: Record<string, any>;
    boxStyles?: SxProps;
};

export default function Fieldset(props: FieldsetProps) {

    const theme = useTheme();

    return (
        <fieldset style={{
            position: 'relative',
            borderRadius: '6px',
            borderColor: theme.palette.divider,
            ...props.styles
        }}>
            <legend><span>{props.legend}</span></legend>
            <Box sx={{ ...props.boxStyles }}>
                {props.children}
            </Box>
        </fieldset>
    );
}
