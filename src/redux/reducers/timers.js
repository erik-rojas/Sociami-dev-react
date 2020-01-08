import {
  PREPARE_TIMERS_IN_PROGRESS,
  PREPARE_TIMERS_COMPLETE,
  SHOW_ALL_TIMERS,
  SHOW_TOP_TIMERS,
} from '~/src/redux/actions/actionTypes';

const timersInitialState = {
  data: [],
  showIndex: 0,
  showMoreFilter: false,
  isTimersInProgress: undefined,
  displayAll: false,
};
const SHOW_MORE_FILTER_TOP_ITEM = 2;

export function timers(state = timersInitialState, action) {
  switch (action.type) {
    case PREPARE_TIMERS_IN_PROGRESS:
      return { ...state, isTimersInProgress: true };
    case PREPARE_TIMERS_COMPLETE:
      return {
        ...state,
        data: action.data,
        showMoreFilter: action.data.length > SHOW_MORE_FILTER_TOP_ITEM,
        showIndex: Math.min(SHOW_MORE_FILTER_TOP_ITEM, action.data.length),
        isTimersInProgress: false,
      };
    case SHOW_ALL_TIMERS:
      return { ...state, showIndex: state.data.length, displayAll: true };
    case SHOW_TOP_TIMERS:
      return { ...state, showIndex: Math.min(2, state.data.length), displayAll: false };
    default:
      return state;
  }
}
