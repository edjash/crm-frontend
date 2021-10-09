import AppContext from '../app/AppContext';

import { AxiosResponse } from 'axios';

export const showError = (appContext: AppContext, list: string[] = []) => {
  let message = '';

  if (list.length > 1 && !message) {
    message = 'The following errors were encountered:';
  }

  if (list.length === 1 && !message) {
    message = list[0];
    list = [];
  }

  appContext.showToast({
    show: true,
    message: message,
    list: list,
    type: 'error',
  });
};

export const errorResponse = (
  appContext: AppContext,
  errorResponse: AxiosResponse
) => {
  const errors = errorResponse?.data?.errors ?? {};
  let list: string[] = [];

  for (let i in errors) {
    list = list.concat(errors[i]);
  }

  if (!list.length) {
    const status = errorResponse?.status;
    console.log(`${status} errorResponse`, errorResponse);
    if (status) {
      return;
    }
    list.push('A connection error occured, Please try again later.');
  }

  showError(appContext, list);
};
