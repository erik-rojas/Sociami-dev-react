import Axios from 'axios';

import ConfigMain from '~/configs/main';

import {
  TASK_ACTIVITY_UNLOCK_REQS_FETCH_INITIATE,
  TASK_ACTIVITY_UNLOCK_REQS_FETCH_COMPLETE,
} from './actionTypes';

export function taskActivityUnlockReqsFetchInitiate() {
  return {
    type: TASK_ACTIVITY_UNLOCK_REQS_FETCH_INITIATE,
  };
}

export function taskActivityUnlockReqsFetchComplete(reqList) {
  return {
    type: TASK_ACTIVITY_UNLOCK_REQS_FETCH_COMPLETE,
    reqList: reqList,
  };
}

export function fetchTaskActivityUnlockReqs() {
  return function(dispatch) {
    //async action entry point
    dispatch(taskActivityUnlockReqsFetchInitiate());

    const url = `${ConfigMain.getBackendURL()}/taskActivityUnlockRequirementsGet`;
    return Axios.get(url)
      .then(function(response) {
        dispatch(taskActivityUnlockReqsFetchComplete(response.data));
      })
      .catch(function(error) {
        dispatch(taskActivityUnlockReqsFetchComplete());
      });
  };
}
