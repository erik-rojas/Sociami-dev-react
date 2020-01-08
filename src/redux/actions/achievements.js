import {
  FETCH_ACHIEVEMENTS_INITIATE,
  FETCH_ACHIEVEMENTS_COMPLETE,
  FETCH_ACHIEVEMENT_GROUPS_INITIATE,
  FETCH_ACHIEVEMENT_GROUPS_COMPLETE,
  ADD_ACHIEVEMENT_GROUP_INITIATE,
  ADD_ACHIEVEMENT_GROUP_COMPLETE,
  UPDATE_ACHIEVEMENT_GROUP_INITIATE,
  UPDATE_ACHIEVEMENT_GROUP_COMPLETE
} from './actionTypes';

import Axios from 'axios';

import ConfigMain from '~/configs/main';

export function fetchAchievementsInitiate() {
  return {
    type: FETCH_ACHIEVEMENTS_INITIATE,
  };
}

export function fetchAchievementsComplete(data) {
  return {
    type: FETCH_ACHIEVEMENTS_COMPLETE,
    data: data,
  };
}

export function fetchAchievementGroupsInitiate() {
  return {
    type: FETCH_ACHIEVEMENT_GROUPS_INITIATE,
  };
}

export function fetchAchievementGroupComplete(data) {
  return {
    type: FETCH_ACHIEVEMENT_GROUPS_COMPLETE,
    data: data,
  };
}

export function addAchievementGroupInitiate() {
  return {
    type: ADD_ACHIEVEMENT_GROUP_INITIATE
  }
}

export function addAchievementGroupComplete(data) {
  return {
    type: ADD_ACHIEVEMENT_GROUP_COMPLETE,
    data: data
  }
}

export function updateAchievementGroupInitiate() {
  return {
    type: UPDATE_ACHIEVEMENT_GROUP_INITIATE
  }
}

export function updateAchievementGroupComplete(data) {
  return {
    type: UPDATE_ACHIEVEMENT_GROUP_COMPLETE,
    data: data
  }
}

export function fetchAchievements() {
  return function(dispatch) {
    dispatch(fetchAchievementsInitiate());

    const url = `${ConfigMain.getBackendURL()}/achievement/group`;
    return Axios.get(url)
      .then(function(response) {
        dispatch(fetchAchievementsComplete(response.data));
      })
      .catch(function(error) {
        dispatch(fetchAchievementsComplete([]));
      });
  };
}

export function fetchAchievementGroups() {
  return function(dispatch) {
    dispatch(fetchAchievementGroupsInitiate());

    const url = `${ConfigMain.getBackendURL()}/achievement/group`;
    return Axios.get(url)
      .then(function(response) {
        dispatch(fetchAchievementGroupComplete(response.data));
      })
      .catch(function(error) {
        dispatch(fetchAchievementGroupComplete([]));
      });
  };
}

export function addAchievementGroup(companyName) {
  return function (dispatch) {
    dispatch(addAchievementGroupInitiate());
    const url = `${ConfigMain.getBackendURL()}/achievement/group`;
    let params = {
      name: `${companyName} Achievements`,
      scope: 'Public'
    }
    return (
      Axios.post(url, params)
      .then(function(response) {
        dispatch(addAchievementGroupComplete(response.data));
      })
      .catch(function(error) {
        dispatch(addAchievementGroupComplete({}));
      })
    );
  }
}

export function updateAchievementGroup(achievementGroup) {
  return function (dispatch) {
    dispatch(updateAchievementGroupInitiate());
    const url = `${ConfigMain.getBackendURL()}/achievement/group/${achievementGroup.key}`;
    return (
      Axios.put(url, achievementGroup)
      .then(function(response) {
        dispatch(updateAchievementGroupComplete(response.data));
      })
      .catch(function(error) {
          dispatch(updateAchievementGroupComplete({}));
      })
    );
  }
}
