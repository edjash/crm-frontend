type FieldsetProps = {
    children: React.ReactNode;
    legend: string;
    styles?: Record<string, any>;
};

export default function Fieldset(props: FieldsetProps) {

    return (
        <fieldset style={{
            position: 'relative',
            borderRadius: '6px',
            ...props.styles
        }}>
            <legend><span>{props.legend}</span></legend>
            {props.children}
        </fieldset>
    );
}
