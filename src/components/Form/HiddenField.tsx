import { Controller, useFormContext } from "react-hook-form";

interface HiddenFieldProps {
    name: string;
    value: any;
}

export default function HiddenField(props: HiddenFieldProps) {
    const { control } = useFormContext();

    return (
        <Controller
            render={({ field }) => (
                <input
                    type="hidden"
                    {...props}
                    {...field}
                    value={props.value}
                />
            )}
            control={control}
            name={props.name ?? ''}
            defaultValue={props?.value ?? ''}
        />
    );
}
