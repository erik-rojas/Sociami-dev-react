import {
  SET_CHARACTER_CREATION_SELECTED_CHARACTER_INDEX,
  SET_CHARACTER_CREATION_SELECTED_CHARACTER_TRAITS_INDEX,
  SET_CHARACTER_CREATION_DATA,
  START_CHARACTER_CREATION,
  FINISH_CHARACTER_CREATION,
  FETCH_LIST_CHARACTER_CLASSES_INITIATE,
  FETCH_LIST_CHARACTER_CLASSES_COMPLETE,
  FETCH_LIST_CHARACTER_TRAITS_INITIATE,
  FETCH_LIST_CHARACTER_TRAITS_COMPLETE,
} from './actionTypes';

import Axios from 'axios';

import ConfigMain from '~/configs/main';

export function setCharacterCreationData(data) {
  return {
    type: SET_CHARACTER_CREATION_DATA,
    data: data,
  };
}

export function startCharacterCreation() {
  return {
    type: START_CHARACTER_CREATION,
  };
}

export function finishCharacterCreation() {
  return {
    type: FINISH_CHARACTER_CREATION,
  };
}

export function setSelectedCharacterIndex(index) {
  return {
    type: SET_CHARACTER_CREATION_SELECTED_CHARACTER_INDEX,
    index: index,
  };
}

export function setSelectedCharacterTraitsIndex(index) {
  return {
    type: SET_CHARACTER_CREATION_SELECTED_CHARACTER_TRAITS_INDEX,
    index: index,
  };
}

export function fetchListCharacterClassesInitiate() {
  return {
    type: FETCH_LIST_CHARACTER_CLASSES_INITIATE,
  };
}

export function fetchListCharacterClassesComplete(data) {
  return {
    type: FETCH_LIST_CHARACTER_CLASSES_COMPLETE,
    data: data,
  };
}

export function fetchListCharacterClasses() {
  return function(dispatch) {
    dispatch(fetchListCharacterClassesInitiate());

    const url = `${ConfigMain.getBackendURL()}/houses`;
    return Axios.get(url)
      .then(function(response) {
        dispatch(fetchListCharacterClassesComplete(response.data));
      })
      .catch(function(error) {
        dispatch(fetchListCharacterClassesComplete([]));
      });
  };
}

export function fetchListCharacterTraitsInitiate() {
  return {
    type: FETCH_LIST_CHARACTER_TRAITS_INITIATE,
  };
}

export function fetchListCharacterTraitsComplete(data) {
  return {
    type: FETCH_LIST_CHARACTER_TRAITS_COMPLETE,
    data: data,
  };
}

export function fetchListCharacterTraits() {
  return function(dispatch) {
    dispatch(fetchListCharacterTraitsInitiate());

    const url = `${ConfigMain.getBackendURL()}/charactertraitsGet`;
    return Axios.get(url)
      .then(function(response) {
        dispatch(fetchListCharacterTraitsComplete(response.data));
      })
      .catch(function(error) {
        dispatch(fetchListCharacterTraitsComplete([]));
      });
  };
}
