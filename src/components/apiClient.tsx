import axios, { Method, AxiosError, AxiosRequestConfig } from 'axios';

export const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const apiClient = {
    get,
    post,
    postForm,
    put,
    delete: _delete,
    request: request
};

function request(
    method: Method,
    endpoint: string,
    data: object,
    sendToken: boolean = true,
    config: AxiosRequestConfig = {},
) {

    const options = {
        ...config,
        method: method,
        url: endpoint,
        baseURL: SERVER_URL + '/api',
        headers: {
            Accept: 'application/json',
            ...config?.headers
        },
        data: {},
        params: {},
    } as AxiosRequestConfig;

    switch (method) {
        case 'POST':
        case 'PUT':
            options.data = data;
            break;
        case 'GET':
        default:
            options.params = data;
    }

    const token = localStorage.getItem('token');
    if (token && sendToken) {
        console.log("SEND TOKEN", token, sendToken);
        options.headers.Authorization = `Bearer ${token}`;
        options.withCredentials = true;
    } else {
    }

    return axios.request(options).catch(handleError);
}

function handleError(error: AxiosError) {
    //Handle the server being offline or the users internet connection down.

    //   if (!error?.response?.data.errors) {
    //     error.response.data.errors = {
    //       ERR_CONNECTION_REFUSED: ['An error occurred connecting to the server.'],
    //     };
    //   }

    return Promise.reject(error.response);
}

function get(endpoint: string, params: object = {}, sendToken = true) {
    return request('GET', endpoint, params, sendToken);
}

function postForm(
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

function post(endpoint: string, data: object, sendToken = true) {
    return request('POST', endpoint, data, sendToken);
}

function put(endpoint: string, data: object, sendToken = true) {
    return request('PUT', endpoint, data, sendToken);
}

// prefixed with underscored because delete is a reserved word in javascript
function _delete(endpoint: string, sendToken = true) {
    return request('DELETE', endpoint, {}, sendToken);
}

export default apiClient;
