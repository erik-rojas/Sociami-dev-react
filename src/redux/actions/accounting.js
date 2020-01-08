import Axios from 'axios';

import ConfigMain from '~/configs/main';

import { USER_ACCOUNTING_FETCH_INITIATE, USER_ACCOUNTING_FETCH_COMPLETE } from './actionTypes';

export function userAccountingFetchInitiate() {
  return {
    type: USER_ACCOUNTING_FETCH_INITIATE,
  };
}

export function userAccountingFetchComplete(data) {
  return {
    type: USER_ACCOUNTING_FETCH_COMPLETE,
    data: data,
  };
}

export function fetchUserAccounting(id) {
  return function(dispatch) {
    //async action entry point
    dispatch(userAccountingFetchInitiate());

    const url = `${ConfigMain.getBackendURL()}/userAccounting?id=${id}`;
    return Axios.get(url)
      .then(function(response) {
        dispatch(userAccountingFetchComplete(response.data));
      })
      .catch(function(error) {
        dispatch(userAccountingFetchComplete());
      });
  };
}
