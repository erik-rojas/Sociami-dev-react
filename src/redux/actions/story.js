import { FETCH_SKILLS_INITIATE, FETCH_SKILLS_COMPLETE } from './actionTypes';

import Axios from 'axios';
import ConfigMain from '~/configs/main';

export function fetchStoriesInitiate () {
  return {
    type: FETCH_SKILLS_INITIATE,
    skills: []
  };
}

export function fetchStoriesComplete (data) {
  return {
    type: FETCH_SKILLS_COMPLETE,
    skills: data
  };
}

export function fetchStories () {
  return (dispatch) => {
    dispatch(fetchStoriesInitiate());

    const url = `${ConfigMain.getBackendURL()}/skillsGet`;
    return Axios.get(url)
      .then((response) => {
        dispatch(fetchStoriesComplete(response.data));
      })
      .catch(() => {
        fetchStoriesComplete([]);
      });
  };
}
