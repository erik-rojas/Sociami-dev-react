import Axios from 'axios';

import ConfigMain from '~/configs/main';

import {
  ROADMAP_ADD,
  ROADMAPS_SET,
  ROADMAP_REMOVE,
  ROADMAP_REMOVE_ALL,
  ROADMAPS_FETCH,
  ROADMAPS_FETCH_INITIATE,
  ROADMAPS_FETCH_COMPLETE,
  ROADMAPS_DETAILED_SET,

  //roadmaps from admin
  ROADMAPS_ADMIN_FETCH_INITIATE,
  ROADMAPS_ADMIN_FETCH_COMPLETE,
} from './actionTypes';

export function roadmapAdd(newRoadmapId) {
  return {
    type: ROADMAP_ADD,
    roadmapId: newRoadmapId,
  };
}

export function roadmapsSet(newRoadmapsIds) {
  return {
    type: ROADMAPS_SET,
    roadmapIds: newRoadmapsIds,
  };
}

export function roadmapRemove(roadmapIdToRemove) {
  return {
    type: ROADMAP_REMOVE,
    roadmapId: roadmapIdToRemove,
  };
}

export function roadmapRemoveAll(idToRemove) {
  return {
    type: ROADMAP_REMOVE_ALL,
  };
}

export function fetchRoadmaps(query = '') {
  return function(dispatch) {
    dispatch(fetchRoadmapsInitiate());

    const url = `${ConfigMain.getBackendURL()}/findRoadmaps?query=${query}`;

    return Axios.get(url)
      .then(function(response) {
        dispatch(fetchRoadmapsComplete(response.data.results));
      })
      .catch(function(error) {
        dispatch(fetchRoadmapsComplete([]));
      });
  };
}

export function fetchRoadmapsFromAdmin(userId) {
  return function(dispatch) {
    dispatch(fetchRoadmapsFromAdminInitiate());

    const url = `${ConfigMain.getBackendURL()}/roadmapsGet`;

    const params = userId ? { userId: userId } : {};

    return Axios.get(url, { params: params })
      .then(function(response) {
        dispatch(fetchRoadmapsFromAdminComplete(response.data));
      })
      .catch(function(error) {
        dispatch(fetchRoadmapsFromAdminComplete([]));
      });
  };
}

export function fetchRoadmapsInitiate() {
  return {
    type: ROADMAPS_FETCH_INITIATE,
  };
}

export function fetchRoadmapsComplete(data) {
  return {
    type: ROADMAPS_FETCH_COMPLETE,
    roadmaps: data,
  };
}

//roadmaps from admin
export function fetchRoadmapsFromAdminInitiate() {
  return {
    type: ROADMAPS_ADMIN_FETCH_INITIATE,
  };
}

export function fetchRoadmapsFromAdminComplete(data) {
  return {
    type: ROADMAPS_ADMIN_FETCH_COMPLETE,
    roadmaps: data,
  };
}

export function roadmapsDetailedSet(newRoadmaps) {
  return {
    type: ROADMAPS_DETAILED_SET,
    roadmaps: newRoadmaps,
  };
}

export function fetchRoadmapsDetailsByIds(roadmapIds) {
  return function(dispatch) {
    dispatch(fetchRoadmapsInitiate());

    if (roadmapIds && roadmapIds.length > 0) {
      let url = `${ConfigMain.getBackendURL()}/getRoadmapsByIds?`;

      for (let i = 0; i < roadmapIds.length; ++i) {
        url += `roadmaps=${roadmapIds[i]}&`;
      }

      return Axios.get(url)
        .then(function(response) {
          dispatch(roadmapsDetailedSet(response.data));
          dispatch(fetchRoadmapsComplete());
        })
        .catch(function(error) {
          dispatch(roadmapsDetailedSet([]));
          dispatch(fetchRoadmapsComplete());
        });
    }
  };
}
