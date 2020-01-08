import {
  FETCH_JOB_ITEMS_INITIATE,
  FETCH_JOB_ITEMS_COMPLETE,
  FETCH_EVENT_ITEMS_INITIATE,
  FETCH_EVENT_ITEMS_COMPLETE,
  FETCH_COURSE_ITEMS_INITIATE,
  FETCH_COURSE_ITEMS_COMPLETE,
  FETCH_GIG_ITEMS_INITIATE,
  FETCH_GIG_ITEMS_COMPLETE,
  FETCH_RESULTS_INITIATE,
  FETCH_RESULTS_COMPLETE,
  SEARCH_QUERY_SET,
  OPEN_SEARCH_RESULTS,
  OPEN_SEARCH_RESULTS_COMPLETE,
  SELECT_RESULTS_CATEGORY,
} from '~/src/redux/actions/actionTypes';

import ResultCategory from '~/src/common/ResultCategoryNames';

export function resultsSelectedCategory(state = ResultCategory.JOBS_INDEED, action) {
  switch (action.type) {
    case SELECT_RESULTS_CATEGORY:
      return action.category;
    default:
      return state;
  }
}

export function isFetchInProgress(state = false, action) {
  switch (action.type) {
    case FETCH_RESULTS_INITIATE:
      return !state ? true : state;
    case FETCH_RESULTS_COMPLETE:
      return state ? false : state;
    default:
      return state;
  }
}

const searchResultsInitialState = {
  jobs: [],
  events: [],
  courses: [],
  gigs: [],
  numJobs: 0,
  numCourses: 0,
  numEvents: 0,
  numGigs: 0,
  isFetchingJobs: false,
  isFetchingEvents: false,
  isFetchingCourses: false,
  isFetchingGigs: false,
};

export function searchResults(state = searchResultsInitialState, action) {
  switch (action.type) {
    case FETCH_JOB_ITEMS_INITIATE:
      return { ...state, isFetchingJobs: true };
    case FETCH_JOB_ITEMS_COMPLETE:
      return { ...state, jobs: action.items, numJobs: action.items.length, isFetchingJobs: false };
    case FETCH_EVENT_ITEMS_INITIATE:
      return { ...state, isFetchingEvents: true };
    case FETCH_EVENT_ITEMS_COMPLETE:
      return { ...state, events: action.items, numEvents: action.items.length, isFetchingEvents: false };
    case FETCH_COURSE_ITEMS_INITIATE:
      return { ...state, isFetchingCourses: true };
    case FETCH_COURSE_ITEMS_COMPLETE:
      return { ...state, courses: action.items, numCourses: action.items.length, isFetchingCourses: false };
    case FETCH_GIG_ITEMS_INITIATE:
      return { ...state, isFetchingGigs: true };
    case FETCH_GIG_ITEMS_COMPLETE:
      return { ...state, gigs: action.items, numGigs: action.items.length, isFetchingGigs: false };
    default:
      return state;
  }
}

export function isOpenSearchResultsPending(state = false, action) {
  switch (action.type) {
    case OPEN_SEARCH_RESULTS:
      return !state ? true : state;
    case OPEN_SEARCH_RESULTS_COMPLETE:
      return state ? false : state;
    default:
      return state;
  }
}

export function searchQuery(state = '', action) {
  switch (action.type) {
    case SEARCH_QUERY_SET:
      return action.query;
    default:
      return state;
  }
}
