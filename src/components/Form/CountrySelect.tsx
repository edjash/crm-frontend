import RemoteSelect from './RemoteSelect';

type CountryOption = {
    code: string;
    name: string;
};

interface CountrySelectProps {
    name: string;
    label?: string;
    defaultValue?: CountryOption;
};

export default function CountrySelect(props: CountrySelectProps) {

    return (
        <RemoteSelect
            {...props}
            url='/countries'
            valueField="code"
            labelField="name"
        />
    );
}