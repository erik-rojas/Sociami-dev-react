import {
  PUSH_NEW_ACTIVITY,
  ACTIVITIES_FETCH_INITIATE,
  ACTIVITIES_FETCH_COMPLETE,
} from '~/src/redux/actions/actionTypes';

const userFriendsActivitiesInitialState = { activities: {}, isFetching: false };

export function userFriendsActivities(state = userFriendsActivitiesInitialState, action) {
  switch (action.type) {
    case ACTIVITIES_FETCH_INITIATE:
      return { ...state, isFetching: true };
    case ACTIVITIES_FETCH_COMPLETE:
      return { ...state, activities: action.activities, isFetching: false };
    default:
      return state;
  }
}
