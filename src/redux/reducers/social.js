import { FETCH_USER_FRIENDS_INITIATE, FETCH_USER_FRIENDS_COMPLETE } from '~/src/redux/actions/actionTypes';

const userFriendsInitialState = { friends: [], isFetching: false };

export function userFriends(state = userFriendsInitialState, action) {
  switch (action.type) {
    case FETCH_USER_FRIENDS_INITIATE:
      return { ...state, isFetching: true };
    case FETCH_USER_FRIENDS_COMPLETE:
      return { ...state, friends: action.friends, isFetching: false };
    default:
      return state;
  }
}
