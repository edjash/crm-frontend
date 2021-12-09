import axios, { Method, AxiosError, AxiosRequestConfig } from 'axios';

const apiClient = {
  get,
  post,
  put,
  delete: _delete,
  request: request
};

function request(
  method: Method,
  endpoint: string,
  data: object,
  sendToken: boolean
) {
  const API_URL = import.meta.env.VITE_API_URL;

  const options = {
    method: method,
    url: endpoint,
    baseURL: API_URL,
    headers: {
      Accept: 'application/json',
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

function get(endpoint: string, params: object, sendToken = true) {
  return request('GET', endpoint, params, sendToken);
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
