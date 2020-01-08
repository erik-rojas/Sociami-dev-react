import {
  FETCH_HOUSES_INITIATE,
  FETCH_HOUSES_COMPLETE
} from '~/src/redux/actions/actionTypes';

const housesInitialState = {
  houses: [],
  isFetchingHouses: true
}

export function houses(state = housesInitialState, action) {
  switch (action.type) {
    case FETCH_HOUSES_INITIATE:
      return {...state, isFetchingHouses: true};
    case FETCH_HOUSES_COMPLETE:
      return {...state, houses: action.houses, isFetchingHouses: false};
    default:
      return state;
  }
}