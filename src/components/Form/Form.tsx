import { yupResolver } from "@hookform/resolvers/yup";
import { ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { AnyObjectSchema } from "yup";
import { DevTool } from "@hookform/devtools";

export interface FormProps {
    id?: string;
    onSubmit: (data: any) => void;
    onError?: (data: any) => void;
    validationSchema?: AnyObjectSchema;
    children?: ReactNode;
    defaultValues?: Record<string, any>;
};

export default function Form(props: FormProps) {

    const formMethods = useForm({
        defaultValues: props.defaultValues,
        resolver: props?.validationSchema ? yupResolver(props.validationSchema) : undefined
    });

    return (
        <FormProvider {...formMethods}>
            <form onSubmit={formMethods.handleSubmit(props.onSubmit)} id={props?.id}>
                {props.children}
            </form>
            <DevTool control={formMethods.control} />
        </FormProvider>
    );
}
