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
} from './actionTypes'
import Axios from 'axios';
import ConfigMain from '~/configs/main';

export function fetchTeamsInitiate() {
    return {
        type: FETCH_TEAMS_INITIATE,
    }
}

export function fetchTeamsComplete(data) {
    return {
        type: FETCH_TEAMS_COMPLETE,
        data: data,
    }
}

export function saveTeamInitiate() {
    return {
        type: SAVE_TEAM_INITIATE
    }
}

export function saveTeamComplete(index, team) {
    return {
        type: SAVE_TEAM_COMPLETE,
        index,
        team
    }
}

export function addEmailInitiate() {
    return {
        type: ADD_EMAIL_INITIATE
    }
}

export function addEmailComplete(index, team) {
    return {
        type: ADD_EMAIL_COMPLETE,
        index,
        team
    }
}

export function updateEmailInitiate() {
  return {
      type: UPDATE_EMAIL_INITIATE
  }
}

export function updateEmailComplete(index, prevEmail, newEmail, team) {
  return {
      type: UPDATE_EMAIL_COMPLETE,
      index,
      team
  }
}

export function deleteTeamInitiate() {
  return {
      type: DELETE_TEAM_INITIATE
  }
}

export function deleteTeamComplete(index) {
  return {
      type: DELETE_TEAM_COMPLETE,
      index
  }
}

export function addNewTeam() {
    return {
        type: ADD_NEW_TEAM
    }
}

export function cancelTeam(index, team) {
  return function (dispatch) {
    if(!team._id) {
      dispatch(deleteTeamComplete(index));
    } else {
      const url = `${ConfigMain.getBackendURL()}/team/${team._id}`;
      return (
      Axios.get(url)
      .then(function(response) {
        dispatch(saveTeamComplete(index, response.data));
      })
      .catch(function(error) {
        dispatch(saveTeamComplete(index, team));
      }));
    }
  }
}

export function saveTeam(index, team) {
    return function (dispatch) {
        dispatch(saveTeamInitiate());
        
        if (team._id) {
          const url = `${ConfigMain.getBackendURL()}/team/${team._id}`;
          return (
            Axios.put(url, { name: team.name })
            .then(function(response) {
              dispatch(saveTeamComplete(index, response.data));
            })
            .catch(function(error) {
              dispatch(saveTeamComplete(index, team));
            }));
        }
        const url = `${ConfigMain.getBackendURL()}/team`;
        return (
        Axios.post(url, team)
        .then(function(response) {
            dispatch(saveTeamComplete(index, response.data));
        })
        .catch(function(error) {
            dispatch(saveTeamComplete(index, team));
        }));
    }
}

export function deleteTeam(index, teamId) {
  return function (dispatch) {
      dispatch(deleteTeamInitiate());
      
      const url = `${ConfigMain.getBackendURL()}/team/${teamId}`;
        return (
        Axios.delete(url)
        .then(function(response) {
            dispatch(deleteTeamComplete(index));
        })
        .catch(function(error) {
            dispatch(deleteTeamComplete(-1));
        }));
  }
}

export function addTeamEmail(index, email, team) {
    return function (dispatch) {
        dispatch(addEmailInitiate());
        const url = `${ConfigMain.getBackendURL()}/team/${team._id}`;
          return (
          Axios.put(url, { email })
          .then(function(response) {
              dispatch(addEmailComplete(index, response.data));
          })
          .catch(function(error) {
              dispatch(addEmailComplete(index, team));
          }));
    }
}

export function updateTeamEmail(emailIndex, prevEmail, newEmail, team) {
  return function (dispatch) {
    dispatch(updateEmailInitiate());
    const url = `${ConfigMain.getBackendURL()}/team/${team._id}/email`;
      return (
      Axios.put(url, { prevEmail, newEmail })
      .then(function(response) {
        dispatch(updateEmailComplete(emailIndex, prevEmail, newEmail, response.data));
      })
      .catch(function(error) {
          dispatch(updateEmailComplete(emailIndex, prevEmail, newEmail, team));
      }));
}
}
export function fetchTeams() {
    return function (dispatch) {
      dispatch(fetchTeamsInitiate());
      
      const url = `${ConfigMain.getBackendURL()}/team/all`;
        return (
        Axios.get(url)
        .then(function(response) {
            dispatch(fetchTeamsComplete(response.data));
        })
        .catch(function(error) {
            dispatch(fetchTeamsComplete([]));
        }));
    }
}
