import Axios from 'axios';

import ConfigMain from '~/configs/main';

import { FETCH_USER_FRIENDS_INITIATE, FETCH_USER_FRIENDS_COMPLETE } from './actionTypes';

export function fetchUserFriendsInitiate() {
  return {
    type: FETCH_USER_FRIENDS_INITIATE,
  };
}

export function fetchUserFriendsComplete(friendsList) {
  return {
    type: FETCH_USER_FRIENDS_COMPLETE,
    friends: friendsList,
  };
}

export function fetchUserFriends(userId) {
  return function(dispatch) {
    //async action entry point
    dispatch(fetchUserFriendsInitiate());

    const url = `${ConfigMain.getBackendURL()}/getConnectedSoqqlers?currentUser=${userId}&status=Friends`;
    return Axios.get(url)
      .then(function(response) {
        dispatch(fetchUserFriendsComplete(response.data));
      })
      .catch(function(error) {
        dispatch(fetchUserFriendsComplete([]));
      });
  };
}
