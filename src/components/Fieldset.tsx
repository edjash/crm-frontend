

type FieldsetProps = {
    children: React.ReactNode;
    label: string
};

export default function Fieldset(props: FieldsetProps) {

    return (
        <fieldset className="MuiOutlinedInput-notchedOutline fieldSetEx">
            <legend className=""><span>{props.label}</span></legend>
            {props.children}
        </fieldset>
    );
}
