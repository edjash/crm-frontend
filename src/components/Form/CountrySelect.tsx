import RemoteSelect, { RemoteSelectProps } from './RemoteSelect';

type CountryOption = {
    code: string;
    name: string;
};

interface CountrySelectProps extends RemoteSelectProps {
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