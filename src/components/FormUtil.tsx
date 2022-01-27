import { AxiosResponse } from 'axios';

export type FieldValues = {
    [index: string]: string;
};

export type ErrorMessages = {
    [index: string]: string;
};

const iterateFormControls = (nodes: HTMLCollection, data: FieldValues) => {

    const inputTags = ['INPUT'];

    for (let i = 0; i <= nodes.length; i++) {
        const node = nodes[i];

        if (node?.children?.length) {
            let ob = iterateFormControls(node.children, data);
            data = { ...data, ...ob };
        }

        const tagName = node?.nodeName?.toUpperCase();

        if (inputTags.indexOf(tagName) < 0) {
            continue;
        }

        const input = node as HTMLInputElement;

        const name = input?.name ?? '';
        if (!name) {
            continue;
        }
        const value = input?.value ?? '';
        data[name] = value;
    }

    return data;
}

export function getFieldValues(form: HTMLFormElement) {
    return iterateFormControls(form.children, {});
}

export function getErrorMessages(errorResponse: AxiosResponse): ErrorMessages {
    const errors: ErrorMessages = {};

    if (!isValidationError(errorResponse)) {
        return errors;
    }

    Object.keys(errorResponse.data.errors).map((key, index) => {
        errors[key] = errorResponse.data.errors[key][0];
    });
    return errors;
}

export function isValidationError(errorResponse: AxiosResponse): boolean {
    if (errorResponse?.status !== 422 || !errorResponse?.data?.errors) {
        return false;
    }
    return true;
}