import {
  TASK_ACTIVITY_UNLOCK_REQS_FETCH_INITIATE,
  TASK_ACTIVITY_UNLOCK_REQS_FETCH_COMPLETE,
} from '~/src/redux/actions/actionTypes';

const initialState = { taskActivityUnlockRequirements: {}, isLoading: false };

export function progression(state = initialState, action) {
  switch (action.type) {
    case TASK_ACTIVITY_UNLOCK_REQS_FETCH_INITIATE:
      return { ...state, isLoading: true };
    case TASK_ACTIVITY_UNLOCK_REQS_FETCH_COMPLETE: {
      let activityUnlockRequirements = {};

      if (action.reqList && action.reqList.length > 0) {
        action.reqList.forEach(requirement => {
          activityUnlockRequirements[requirement.type] = requirement.requirements;
        });
      }

      return { ...state, taskActivityUnlockRequirements: activityUnlockRequirements, isLoading: false };
    }

    default:
      return state;
  }
}
