import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ErrorOption } from 'react-hook-form';

export const SERVER_URL = import.meta.env.VITE_SERVER_URL;
export type HTTPVerb = 'GET' | 'POST' | 'PUT' | 'DELETE';

const apiClient = {
    get,
    post,
    postForm,
    put,
    delete: _delete,
    showErrors: showErrors,
};

export default apiClient;

export type ErrorMessages = {
    [index: string]: string;
};

export function request(
    method: HTTPVerb,
    endpoint: string,
    data: object,
    sendToken = true,
    axiosConfig: AxiosRequestConfig = {}
) {

    const options: AxiosRequestConfig = {
        method: method,
        url: endpoint,
        baseURL: SERVER_URL + '/api',
        headers: {
            Accept: 'application/json',
            ...axiosConfig?.headers
        },
        data: {},
        params: {},
        withCredentials: true,
        ...axiosConfig,
    };

    switch (options.method) {
        case 'POST':
        case 'PUT':
            options.data = data;
            break;
        case 'GET':
        default:
            options.params = data;
    }

    // const token = localStorage.getItem('token');
    // if (token && sendToken) {
    //     options.headers.Authorization = `Bearer ${token}`;
    //     options.withCredentials = true;
    // }

    return axios.request(options).catch(handleError);
}

export function get(endpoint: string, params: object = {}, sendToken = true) {
    return request('GET', endpoint, params, sendToken);
}

function post(endpoint: string, data: object, sendToken = true) {
    return request('POST', endpoint, data, sendToken);
}

export function postForm(
    endpoint: string,
    formData: FormData,
    sendToken: boolean = true,
    config: AxiosRequestConfig = {},
) {
    config = {
        ...config,
        headers: {
            "Content-Type": "multipart/form-data"
        }
    };
    return request('POST', endpoint, formData, sendToken, config);
}

function put(endpoint: string, data: object, sendToken = true) {
    return request('PUT', endpoint, data, sendToken);
}

// prefixed with underscored because delete is a reserved word in javascript
function _delete(endpoint: string, params: object = {}, sendToken = true) {
    return request('DELETE', endpoint, params, sendToken);
}

//utility
function handleError(error: AxiosError) {

    if (error.response?.status === 401) {
        PubSub.publish('AUTH.TIMEOUT');
    }

    return Promise.reject(error.response);
}

type setErrorFn = (name: string, error: ErrorOption, options?: {
    shouldFocus: boolean;
} | undefined) => void;

function showErrors(errorResponse: AxiosResponse, setError: setErrorFn) {
    if (!setValidationErrors(errorResponse, setError)) {
        PubSub.publish('TOAST.SHOW', {
            autoHide: false,
            message: "An unexpected error was encountered submitting the form.",
            type: 'error',
        });
    }
}

export function setValidationErrors(errorResponse: AxiosResponse, setError: setErrorFn): boolean {
    if (!isValidationError(errorResponse)) {
        return false;
    }
    const msgOb = errorResponse?.data?.validationErrors?.messages || {};
    for (let field in msgOb) {
        setError(field, { message: msgOb[field][0] });
    }
    return true;
}

export function isValidationError(errorResponse: AxiosResponse): boolean {
    if (errorResponse?.status !== 422 || !errorResponse?.data?.validationErrors) {
        return false;
    }
    return true;
}

