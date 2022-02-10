import { Controller } from "react-hook-form";
import RemoteSelect, { RemoteSelectProps } from './RemoteSelect';

export default function CountrySelect(RSProps: RemoteSelectProps) {

    return (
        <RemoteSelect
            {...RSProps}
            url='/countries'
            valueField="code"
            labelField="name"
        />
    );
}

export function CountrySelectEx(RSProps: RemoteSelectProps) {
    return (
        <Controller
            render={({ ...ControlProps }) => {
                return (
                    <CountrySelect
                        {...RSProps}
                        errors={ControlProps.formState.errors.country}//Wrong name. zZz
                        inputRef={ControlProps.field.ref}
                        onChange={ControlProps.field.onChange}
                    />);
            }}
            defaultValue={RSProps?.defaultValue ?? null}
            name={RSProps?.name}
        />
    );
}