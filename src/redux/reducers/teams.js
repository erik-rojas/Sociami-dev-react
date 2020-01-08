import {
    FETCH_TEAMS_INITIATE,
    FETCH_TEAMS_COMPLETE,
    ADD_NEW_TEAM,
    SAVE_TEAM_INITIATE,
    SAVE_TEAM_COMPLETE,
    ADD_EMAIL_INITIATE,
    ADD_EMAIL_COMPLETE,
    UPDATE_EMAIL_INITIATE,
    UPDATE_EMAIL_COMPLETE,
    DELETE_TEAM_INITIATE,
    DELETE_TEAM_COMPLETE
} from '~/src/redux/actions/actionTypes';

const achievementsInitialState = {
    data: [], 
    isFetchingTeams: false,
    isSavingTeams: false,
    isAddingEmail: false,
    isUpdatingEmail: false,
    isDeletingTeam: false
}

export function teams(state = achievementsInitialState, action) {
  switch (action.type) {
    case FETCH_TEAMS_INITIATE:
      return {...state, isFetchingTeams: true};
    case FETCH_TEAMS_COMPLETE:
      return {...state, data: action.data, isFetchingTeams: false};
    case ADD_NEW_TEAM:
      return {...state, data: state.data.concat({ emails: [] })};
    case SAVE_TEAM_INITIATE:
      return {...state, isSavingTeams: true};
    case SAVE_TEAM_COMPLETE:
      return {...state, data: state.data.map((team, index) => {
        if(index === action.index) {
          return Object.assign({}, action.team);
        }
        return team;
      }), isSavingTeams: false};
    case ADD_EMAIL_INITIATE:
      return {...state, isAddingEmail: true}
    case ADD_EMAIL_COMPLETE:
      return {...state, data: state.data.map((team, index) => {
        if(index === action.index) {
          return Object.assign({}, action.team);
        }
        return team;
      }), isAddingEmail: false};
    case UPDATE_EMAIL_INITIATE:
      return {...state, isUpdatingEmail: true}
    case UPDATE_EMAIL_COMPLETE:
      return {...state, data: state.data.map((team, index) => {
        if(team._id === action.team._id) {
          return Object.assign({}, action.team);
        }
        return team;
      }), isUpdatingEmail: false};
    case DELETE_TEAM_INITIATE:
      return {...state, isDeletingTeam: true}
    case DELETE_TEAM_COMPLETE:
      return {...state, data: state.data.filter((team, index) => {
        return index !== action.index;
      }), isDeletingTeam: false}
    default:
      return state;
  }
}