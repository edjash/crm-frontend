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

export function getJsonFieldValues(form: HTMLFormElement) {
    const inputValues = getFieldValues(form);
    let data = {};
    Object.keys(inputValues).map((key) => {

    });

    return inputValues;
}

export function getErrorMessages(errorResponse: AxiosResponse): ErrorMessages {
    const errors: ErrorMessages = {};

    if (!isValidationError(errorResponse)) {
        return errors;
    }

    Object.keys(errorResponse.data.errors).map((key, index) => {
        const msg = errorResponse.data.errors[key][0];
        const keyArray = key.split('.');

        if (keyArray.length > 1) {
            const newKey = [keyArray.shift()];
            keyArray.map((part) => {
                newKey.push(`[${part}]`);
            });
            key = newKey.join('');
        }

        errors[key] = msg;
    });

    console.log("ERR", errors);
    return errors;
}

export function isValidationError(errorResponse: AxiosResponse): boolean {
    if (errorResponse?.status !== 422 || !errorResponse?.data?.errors) {
        return false;
    }
    return true;
}

export function flattenObject(obj: object, keySeparator = '.') {
    const flattenRecursive = (obj: object, parentProperty?: string, propertyMap: Record<string, unknown> = {}) => {
        for (const [key, value] of Object.entries(obj)) {
            const property = parentProperty ? `${parentProperty}${keySeparator}${key}` : key;
            if (value && typeof value === 'object') {
                flattenRecursive(value, property, propertyMap);
            } else {
                propertyMap[property] = value;
            }
        }
        return propertyMap;
    };
    return flattenRecursive(obj);
}