import { yupResolver } from "@hookform/resolvers/yup";
import { Box, BoxProps } from "@mui/material";
import { ReactNode } from "react";
import { FormProvider, useForm, UseFormReturn } from "react-hook-form";
import { AnyObjectSchema } from "yup";

export interface FormProps {
    id?: string;
    onSubmit?: (data: any) => void;
    onError?: (data: any) => void;
    validationSchema?: AnyObjectSchema;
    children?: ReactNode;
    defaultValues?: Record<string, any>;
    boxProps?: BoxProps;
    setFormMethods?: (methods: UseFormReturn) => void;
};

export default function Form(props: FormProps) {

    const formMethods = useForm({
        defaultValues: props.defaultValues,
        resolver: props?.validationSchema ? yupResolver(props.validationSchema) : undefined
    });

    if (props.setFormMethods) {
        props.setFormMethods(formMethods);
    }

    const onSubmit = (data: any) => {
        if (props.onSubmit) {
            props.onSubmit(data);
        }
    }

    const onError = (data: any) => {
        if (props.onError) {
            props.onError(data);
        }
    }

    return (
        <FormProvider {...formMethods}>
            <form onSubmit={formMethods.handleSubmit(onSubmit, onError)} id={props?.id}>
                {props.children}
            </form>
        </FormProvider>
    );
}
