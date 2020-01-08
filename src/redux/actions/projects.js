import Axios from 'axios';

import ConfigMain from '~/configs/main';

import {
  PROJECT_SAVE_INITIATE,
  PROJECT_SAVE_COMPLETE,
  PROJECTS_FETCH_INITIATE,
  PROJECTS_FETCH_COMPLETE,
  PROJECTS_SET,
  PROJECT_SET,
} from './actionTypes';

export function projectSaveInitiate() {
  return {
    type: PROJECT_SAVE_INITIATE,
  };
}

export function projectSaveComplete() {
  return {
    type: PROJECT_SAVE_COMPLETE,
  };
}

export function projectsFetchInitiate() {
  return {
    type: PROJECTS_FETCH_INITIATE,
  };
}

export function projectsFetchComplete() {
  return {
    type: PROJECTS_FETCH_COMPLETE,
  };
}

export function projectsSet(fetchedProjects) {
  return {
    type: PROJECTS_SET,
    projects: fetchedProjects,
  };
}

export function projectSet(savedProject) {
  return {
    type: PROJECT_SET,
    project: savedProject,
  };
}

export function projectSave(project) {
  return function(dispatch) {
    dispatch(projectSaveInitiate());

    const url = `${ConfigMain.getBackendURL()}/projectSave`;
    return Axios.post(url, project)
      .then(function(response) {
        dispatch(projectSet(response.data));
        dispatch(projectSaveComplete());
      })
      .catch(function(error) {
        dispatch(projectSaveComplete({}));
      });
  };
}

export function projectsFetch() {
  return function(dispatch) {
    dispatch(projectsFetchInitiate());

    const url = `${ConfigMain.getBackendURL()}/projectsGet`;
    return Axios.get(url)
      .then(function(response) {
        dispatch(projectsSet(response.data));
        dispatch(projectsFetchComplete());
      })
      .catch(function(error) {
        dispatch(projectsSet([]));
        dispatch(projectsFetchComplete());
      });
  };
}
