import {
  ROADMAP_ADD,
  ROADMAP_REMOVE,
  ROADMAP_REMOVE_ALL,
  ROADMAPS_SET,
  ROADMAPS_FETCH,
  ROADMAPS_FETCH_INITIATE,
  ROADMAPS_FETCH_COMPLETE,
  ROADMAPS_DETAILED_SET,
  ROADMAPS_DETAILED_REMOVE_ALL,

  //roadmaps from admin
  ROADMAPS_ADMIN_FETCH_INITIATE,
  ROADMAPS_ADMIN_FETCH_COMPLETE,
} from '~/src/redux/actions/actionTypes';

const roadmapsInitialState = { isFetching: false, data: [] };
export function roadmaps(state = roadmapsInitialState, action) {
  switch (action.type) {
    case ROADMAPS_FETCH_INITIATE:
      return { ...state, isFetching: true };
    case ROADMAPS_FETCH_COMPLETE:
      return { ...state, isFetching: false, data: action.roadmaps };
    default:
      return state;
  }
}

export function roadmapsDetailed(state = [], action) {
  switch (action.type) {
    case ROADMAPS_DETAILED_SET:
      return action.roadmaps;
    case ROADMAPS_DETAILED_REMOVE_ALL:
      return [];
    default:
      return state;
  }
}

export function roadmapsAdmin(state = roadmapsInitialState, action) {
  switch (action.type) {
    case ROADMAPS_ADMIN_FETCH_INITIATE:
      return { ...state, isFetching: true };
    case ROADMAPS_ADMIN_FETCH_COMPLETE:
      return { ...state, isFetching: false, data: action.roadmaps };
    default:
      return state;
  }
}
