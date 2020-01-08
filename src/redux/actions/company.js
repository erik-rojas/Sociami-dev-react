import {
  FETCH_COMPANY_INITIATE,
  FETCH_COMPANY_COMPLETE,
  UPDATE_COMPANY_INITIATE,
  UPDATE_COMPANY_COMPLETE
} from './actionTypes'
import Axios from 'axios';
import ConfigMain from '~/configs/main';

export function fetchCompanyInitiate() {
  return {
    type: FETCH_COMPANY_INITIATE,
    company: []
  }
}

export function fetchCompanyComplete(data) {
  return {
    type: FETCH_COMPANY_COMPLETE,
    company: data,
  }
}

export function updateCompanyInitiate() {
  return {
    type: UPDATE_COMPANY_INITIATE,
    company: []
  }
}

export function updateCompanyComplete(data) {
  return {
    type: UPDATE_COMPANY_COMPLETE,
    company: data
  }
}

export function fetchCompanyByEmail(email) {
  return function (dispatch) {
    dispatch(fetchCompanyInitiate());
    const url = `${ConfigMain.getBackendURL()}/company?email=${email}`;
    return (
      Axios.get(url)
      .then(function (response) {
        dispatch(fetchCompanyComplete(response.data));
      })
      .catch(function (error) {
        dispatch(fetchCompanyComplete([]));
      })
    );
  }
}

export function updateCompany(company) {
  return function (dispatch) {
    dispatch(updateCompanyInitiate());
    const url = `${ConfigMain.getBackendURL()}/company/${company._id}`;
    return (
      Axios.put(url, company)
      .then(function(response) {
        dispatch(updateCompanyComplete(response.data));
      })
      .catch(function(error) {
          dispatch(updateCompanyComplete([]));
      })
    );
  }
}
