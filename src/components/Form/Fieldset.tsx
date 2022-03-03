import { Box } from "@mui/material";


type FieldsetProps = {
    children: React.ReactNode;
    legend: string;
    width?: string;
};

export default function Fieldset(props: FieldsetProps) {

    return (
        <fieldset style={{ borderRadius: '6px', width: props.width ?? 'auto' }}>
            <legend><span>{props.legend}</span></legend>
            {props.children}
        </fieldset>
    );
}
