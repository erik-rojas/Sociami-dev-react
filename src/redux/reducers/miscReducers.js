import { SELECT_RESULTS_CATEGORY, EXACT_LOCATION_SET } from '~/src/redux/actions/actionTypes';

export function exactLocation(state = '', action) {
  switch (action.type) {
    case EXACT_LOCATION_SET:
      return action.location;
    default:
      return state;
  }
}
