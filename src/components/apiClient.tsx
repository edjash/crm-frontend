import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ErrorOption } from 'react-hook-form';
import { SERVER_URL } from '../app/constants';

export type HTTPVerb = 'GET' | 'POST' | 'PUT' | 'DELETE';

axios.defaults.withCredentials = true;
axios.interceptors.request.use((config: AxiosRequestConfig) => {
    // Request csrf cookie if not exists.
    if (!csrfCookieExists() && config.method !== 'get') {
        return axios.get(SERVER_URL + '/sanctum/csrf-cookie').then(rsp => config);
    }
    return config;
});

const apiClient = {
    get,
    post,
    put,
    delete: _delete,
};

export default apiClient;

export function request(
    method: HTTPVerb,
    endpoint: string,
    data: object = {},
    axiosConfig: AxiosRequestConfig = {},
) {
    const config: AxiosRequestConfig = {
        method: method,
        url: '/api' + endpoint,
        baseURL: SERVER_URL,
        headers: {
            Accept: 'application/json',
        },
        data: {},
        params: {},
        withCredentials: true,
        ...axiosConfig,
    };

    switch (config.method) {
        case 'POST':
        case 'PUT':
            config.data = data;
            break;
        case 'GET':
        default:
            config.params = data;
    }

    return axios.request(config).catch(handleError);
}

export function get(endpoint: string, params: object = {}) {
    return request('GET', endpoint, params);
}

export function post(endpoint: string, data: object, config: AxiosRequestConfig = {}) {
    return request('POST', endpoint, data, config);
}

export function put(endpoint: string, data: object) {
    return request('PUT', endpoint, data);
}

// prefixed with underscored because delete is a reserved word in javascript
export function _delete(endpoint: string, params: object = {}) {
    return request('DELETE', endpoint, params);
}

//utility
export function csrfCookieExists() {
    if (document.cookie.split(';').some((item) => item.trim().startsWith('XSRF-TOKEN='))) {
        return true;
    }
    return false;
}

function handleError(error: AxiosError) {

    if (error.response?.status === 401) {
        PubSub.publish('AUTH.TIMEOUT');
    }

    return Promise.reject(error.response);
}

type setErrorFn = (name: string, error: ErrorOption, options?: {
    shouldFocus: boolean;
} | undefined) => void;

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

