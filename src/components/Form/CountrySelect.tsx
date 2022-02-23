import { Controller } from "react-hook-form";
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
        <Controller
            render={({ ...controlProps }) => {
                return (
                    <RemoteSelect
                        {...props}
                        url='/countries'
                        valueField="code"
                        labelField="name"
                        errors={controlProps.formState.errors?.[props?.name]}
                        inputRef={controlProps.field.ref}
                        onChange={controlProps.field.onChange}
                        defaultValue={controlProps.field.value ?? null}
                    />);
            }}
            defaultValue={props?.defaultValue ?? null}
            name={props?.name}
        />
    );
}