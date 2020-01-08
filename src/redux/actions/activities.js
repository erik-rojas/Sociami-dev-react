import Axios from 'axios';

import ConfigMain from '~/configs/main';

import { PUSH_NEW_ACTIVITY, ACTIVITIES_FETCH_INITIATE, ACTIVITIES_FETCH_COMPLETE } from './actionTypes';

export function activitiesFetchInitiate() {
  return {
    type: ACTIVITIES_FETCH_INITIATE,
  };
}

export function activitiesFetchComplete(newActivities) {
  return {
    type: ACTIVITIES_FETCH_COMPLETE,
    activities: newActivities,
  };
}

export function activitiesFetch(userIds = []) {
  return function(dispatch) {
    //async action entry point
    dispatch(activitiesFetchInitiate());

    const parseUserIds = userIds => {
      let result = '';

      for (let i = 0; i < userIds.length; ++i) {
        result += `id=${userIds[i]}`;
        if (i < userIds.length - 1) {
          result += '&';
        }
      }

      return result;
    };

    const url = `${ConfigMain.getBackendURL()}/userActivitiesGet?${parseUserIds(userIds)}`;
    return Axios.get(url)
      .then(function(response) {
        dispatch(activitiesFetchComplete(response.data));
      })
      .catch(function(error) {
        dispatch(activitiesFetchComplete([]));
      });
  };
}

export function pushNewActivity(activity) {
  return function(dispatch) {
    const url = `${ConfigMain.getBackendURL()}/userActivityAdd`;
    return Axios.post(url, activity)
      .then(function(response) {})
      .catch(function(error) {});
  };
}

export function markActivitySeen(_activityId, _otherUserId, _witnessId) {
  return function(dispatch) {
    const url = `${ConfigMain.getBackendURL()}/userActivityMarkSeenByUser`;
    const body = { userID: _otherUserId, activityID: _activityId, witnessID: _witnessId };
    return Axios.post(url, body)
      .then(function(response) {})
      .catch(function(error) {});
  };
}
