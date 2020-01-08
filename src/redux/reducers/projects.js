import {
  PROJECT_SAVE_INITIATE,
  PROJECT_SAVE_COMPLETE,
  PROJECTS_FETCH_INITIATE,
  PROJECTS_FETCH_COMPLETE,
  PROJECTS_SET,
  PROJECT_SET,
} from '~/src/redux/actions/actionTypes';

export function projects(state = [], action) {
  switch (action.type) {
    case PROJECT_SET: {
      let copyProjects = state.slice(0);

      let findByID = function(project) {
        return project._id == action.project._id;
      };

      const foundIndex = state.findIndex(findByID);

      if (foundIndex != -1) {
        copyProjects[foundIndex] = action.project;
      } else {
        copyProjects.push(action.project);
      }

      return copyProjects;
    }
    case PROJECTS_SET: {
      return action.projects;
    }
    default:
      return state;
  }
}

export function isProjectsFetchInProgress(state = false, action) {
  switch (action.type) {
    case PROJECTS_FETCH_INITIATE:
      return !state ? true : state;
    case PROJECTS_FETCH_COMPLETE:
      return state ? false : state;
    default:
      return state;
  }
}

export function isProjectSaveInProgress(state = false, action) {
  switch (action.type) {
    case PROJECT_SAVE_INITIATE:
      return !state ? true : state;
    case PROJECT_SAVE_COMPLETE:
      return state ? false : state;
    default:
      return state;
  }
}
