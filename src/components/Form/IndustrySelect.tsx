import RemoteSelect from './RemoteSelect';

type IndustryOption = {
    id: number;
    name: string;
};

interface IndustrySelectProps {
    name: string;
    label?: string;
    defaultValue?: IndustryOption;
};

export default function IndustrySelect(props: IndustrySelectProps) {

    return (
        <RemoteSelect
            {...props}
            url='/industries'
            valueField="id"
            labelField="name"
        />
    );
}