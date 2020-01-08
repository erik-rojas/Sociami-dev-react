import {
  TASKS_SET,
  TASK_LASTSAVED_SET,
  TASK_LASTSTARTED_SET,
  FETCH_TASKS_INITIATE,
  FETCH_TASKS_COMPLETE,
  SAVE_TASK_INITIATE,
  SAVE_TASK_COMPLETE,
  TASK_UPDATE,
  TASK_ADD,
  TASK_REMOVE,
  UPDATE_TASK_INITIATE,
  UPDATE_TASK_COMPLETE,
  SET_ACTIVE_HANGOUT,
  RESET_ACTIVE_HANGOUT,
  LOAD_ACTIVATE_URL,
} from '~/src/redux/actions/actionTypes';

const tasksInitialState = {
  data: [],
  isFetchInProgress: false,
  isSaveInProgress: false,
  isUpdateInProgress: false,
  activeHangout: null,
};

export function tasks(state = tasksInitialState, action) {
  switch (action.type) {
    case TASK_REMOVE: {
      let findByID = function(task) {
        return task._id == action._id;
      };

      const foundIndex = state.data.findIndex(findByID);

      if (foundIndex != -1) {
        let copyTasks = state.data.slice(0);

        copyTasks.splice(foundIndex, 1);

        return { ...state, data: copyTasks };
      }

      return state;
    }
    case FETCH_TASKS_INITIATE:
      return { ...state, isFetchInProgress: true };
    case FETCH_TASKS_COMPLETE:
      return { ...state, data: action.tasks, isFetchInProgress: false };
    case SAVE_TASK_INITIATE:
      return { ...state, isSaveInProgress: true };
    case SAVE_TASK_COMPLETE:
      let copyTasks = state.data.slice(0);
      copyTasks.push(action.task);

      return { ...state, data: copyTasks, isSaveInProgress: false };
    case UPDATE_TASK_INITIATE:
      return { ...state, isUpdateInProgress: true };
    case UPDATE_TASK_COMPLETE: {
      let findByID = function(task) {
        return task._id == action.task._id;
      };

      let nextState = state;

      const foundIndex = state.data.findIndex(findByID);

      if (foundIndex != -1) {
        let copyTasks = state.data.slice(0);
        if (action.remove) {
          copyTasks.splice(foundIndex, 1);

          nextState = { ...state, data: copyTasks };
        } else {
          copyTasks[foundIndex] = action.task;

          nextState = { ...state, data: copyTasks };
        }
      }

      nextState = { ...nextState, isUpdateInProgress: false };

      return nextState;
    }
    case TASK_UPDATE: {
      let findByID = function(task) {
        return task._id == action.task._id;
      };

      const foundIndex = state.data.findIndex(findByID);

      if (foundIndex != -1) {
        let copyTasks = state.data.slice(0);
        copyTasks[foundIndex] = action.task;

        return { ...state, data: copyTasks };
      }

      return state;
    }
    case SET_ACTIVE_HANGOUT: {
      return {
        ...state,
        activeHangout: action.hangout,
      };
    }
    case RESET_ACTIVE_HANGOUT: {
      return {
        ...state,
        activeHangout: null,
      };
    }
    case LOAD_ACTIVATE_URL: {
      return {
        ...state,
      };
    }
    default:
      return state;
  }
}

export function lastSavedTask(state = {}, action) {
  if (action.type == TASK_LASTSAVED_SET) {
    return action.task;
  } else {
    return state;
  }
}

export function lastStartedTask(state = {}, action) {
  if (action.type == TASK_LASTSTARTED_SET) {
    return action.task;
  } else {
    return state;
  }
}
