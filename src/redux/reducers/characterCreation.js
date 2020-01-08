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
} from '~/src/redux/actions/actionTypes';

const characterCreationDataInitialState = {
  selectedCharacterIndex: 0,
  selectedTraitsIndex: 0,
  isInProgress: false,
};

export function characterCreationData(state = characterCreationDataInitialState, action) {
  switch (action.type) {
    case SET_CHARACTER_CREATION_DATA:
      return action.data;
    case SET_CHARACTER_CREATION_SELECTED_CHARACTER_INDEX:
      return { ...state, selectedCharacterIndex: action.index };
    case SET_CHARACTER_CREATION_SELECTED_CHARACTER_TRAITS_INDEX:
      return { ...state, selectedTraitsIndex: action.index };
    case START_CHARACTER_CREATION:
      return { ...characterCreationDataInitialState, isInProgress: true };
    case FINISH_CHARACTER_CREATION:
      return { ...state, isInProgress: false };
    default:
      return state;
  }
}

export function characterCreation(
  state = {
    listCharacters: [],
    listCharacterTraits: [],
    isFetchingCharacters: false,
    isFetchingCharacterTraits: false,
  },
  action,
) {
  switch (action.type) {
    case FETCH_LIST_CHARACTER_CLASSES_INITIATE:
      return { ...state, isFetchingCharacters: true };
    case FETCH_LIST_CHARACTER_CLASSES_COMPLETE:
      return { ...state, listCharacters: action.data, isFetchingCharacters: false };
    case FETCH_LIST_CHARACTER_TRAITS_INITIATE:
      return { ...state, isFetchingCharacterTraits: true };
    case FETCH_LIST_CHARACTER_TRAITS_COMPLETE:
      return { ...state, listCharacterTraits: action.data, isFetchingCharacterTraits: false };
    default:
      return state;
  }
}
