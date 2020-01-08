import {
  FETCH_HOUSES_INITIATE,
  FETCH_HOUSES_COMPLETE,
} from './actionTypes'
import Axios from 'axios';
import ConfigMain from '~/configs/main';

export function fetchHousesInitiate() {
  return {
      type: FETCH_HOUSES_INITIATE,
      houses: []
  }
}

export function fetchHousesComplete(data) {
  return {
      type: FETCH_HOUSES_COMPLETE,
      houses: data,
  }
}

export function fetchHousesByEmail(email) {
  return function (dispatch) {
    dispatch(fetchHousesInitiate());
    const url = `${ConfigMain.getBackendURL()}/houses?email=${email}`;
      return (
      Axios.get(url)
      .then(function(response) {
          dispatch(fetchHousesComplete(response.data));
      })
      .catch(function(error) {
          dispatch(fetchHousesComplete([]));
      }));
  }
}