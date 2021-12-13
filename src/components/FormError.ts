import { AxiosResponse } from 'axios';

export const showError = (list: string[] = []) => {
  let message = '';

  if (list.length > 1 && !message) {
    message = 'The following errors were encountered:';
  }

  if (list.length === 1 && !message) {
    message = list[0];
    list = [];
  }

  PubSub.publish('TOAST.SHOW', {
    autoHide: false,
    message: message,
    list: list,
    type: 'error',
  });
};

export const errorResponse = (errorResponse: AxiosResponse) => {
  const errors = errorResponse?.data?.errors ?? {};
  let list: string[] = [];

  for (let i in errors) {
    console.log(i);
    list = list.concat(errors[i]);
  }

  if (!list.length) {
    const status = errorResponse?.status;
    //console.log(`${status} errorResponse`, errorResponse);
    if (status) {
      return;
    }
    list.push('A connection error occured, Please try again later.');
  }

  showError(list);
};
