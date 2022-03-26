import RemoteSelect, { RemoteSelectProps } from './RemoteSelect';

type IndusrtyOption = {
    id: number;
    name: string;
};

interface IndustrySelectProps extends RemoteSelectProps {
    defaultValue?: IndusrtyOption;
};

export default function CountrySelect(props: IndustrySelectProps) {

    return (
        <RemoteSelect
            {...props}
            url='/industries'
            valueField="id"
            labelField="name"
        />
    );
}