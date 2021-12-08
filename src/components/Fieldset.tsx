

type FieldsetProps = {
    children: React.ReactNode;
    label: string
};

export default function Fieldset(props: FieldsetProps) {

    return (
        <fieldset style={{ borderRadius:'6px', }}>
            <legend className=""><span>{props.label}</span></legend>
            {props.children}
        </fieldset>
    );
}
