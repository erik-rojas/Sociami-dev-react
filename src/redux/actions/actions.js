import { EXACT_LOCATION_SET } from './actionTypes';

export function setExactLocation(exactLocation) {
  return {
    type: EXACT_LOCATION_SET,
    location: exactLocation,
  };
}
