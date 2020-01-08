import ConfigMain from '~/configs/main';

let DataProviderIndeed = require('~/src/data_providers/indeed/DataProvider');
let DataProviderEventBrite = require('~/src/data_providers/event_brite/DataProvider');
let DataProviderUdemy = require('~/src/data_providers/udemy/DataProvider');
let DataProviderFreelancer = require('~/src/data_providers/freelancer/DataProvider');

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
  SELECT_RESULTS_CATEGORY,
  OPEN_SEARCH_RESULTS,
  OPEN_SEARCH_RESULTS_COMPLETE,
  SEARCH_QUERY_SET,
} from './actionTypes';

export function fetchJobItemsInitiate() {
  return {
    type: FETCH_JOB_ITEMS_INITIATE,
  };
}

export function fetchJobItemsComplete(newItems) {
  return {
    type: FETCH_JOB_ITEMS_COMPLETE,
    items: newItems,
  };
}

export function fetchEventItemsInitiate() {
  return {
    type: FETCH_EVENT_ITEMS_INITIATE,
  };
}

export function fetchEventItemsComplete(newItems) {
  return {
    type: FETCH_EVENT_ITEMS_COMPLETE,
    items: newItems,
  };
}

export function fetchCourseItemsInitiate() {
  return {
    type: FETCH_COURSE_ITEMS_INITIATE,
  };
}

export function fetchCourseItemsComplete(newItems) {
  return {
    type: FETCH_COURSE_ITEMS_COMPLETE,
    items: newItems,
  };
}

export function fetchGigItemsInitiate() {
  return {
    type: FETCH_GIG_ITEMS_INITIATE,
  };
}

export function fetchGigItemsComplete(newItems) {
  return {
    type: FETCH_GIG_ITEMS_COMPLETE,
    items: newItems,
  };
}

export function fetchResultsInitiate() {
  return {
    type: FETCH_RESULTS_INITIATE,
  };
}

export function fetchResultsComplete() {
  return {
    type: FETCH_RESULTS_COMPLETE,
  };
}

//selects category 'RESULTS_CATEGORY_JOBS', 'RESULTS_CATEGORY_EVENTS', etc.
export function selectResultsCategory(newCategory) {
  return {
    type: SELECT_RESULTS_CATEGORY,
    category: newCategory,
  };
}

export function openSearchResults() {
  return {
    type: OPEN_SEARCH_RESULTS,
  };
}

export function openSearchResultsComplete() {
  return {
    type: OPEN_SEARCH_RESULTS_COMPLETE,
  };
}

export function setSearchQuery(searchQuery) {
  return {
    type: SEARCH_QUERY_SET,
    query: searchQuery,
  };
}

function fetchResultsSuccess(type, items, dispatch) {
  if (type && type != '' && typeof items !== 'undefined') {
    switch (type) {
      case 'jobs_indeed': {
        dispatch(fetchJobItemsComplete(items));
        break;
      }
      case 'events_eventbrite': {
        dispatch(fetchEventItemsComplete(items));
        break;
      }
      case 'courses_udemy': {
        dispatch(fetchCourseItemsComplete(items));
        break;
      }
      case 'gigs_freelancer': {
        dispatch(fetchGigItemsComplete(items));
        break;
      }
    }
  }
}

export function fetchResults(type, searchQuery, country = 'sg') {
  if (searchQuery && searchQuery != '' && (type && type != '')) {
    const BackendURL = ConfigMain.getBackendURL();

    switch (type) {
      case 'jobs_indeed': {
        return function(dispatch) {
          dispatch(fetchJobItemsInitiate());

          const PUBLISHER_ID = '4201738803816157'; //TODO: move to back-end
          let url = `${BackendURL}/indeed/jobs?query=${searchQuery}&country=${country}`;
          DataProviderIndeed.requestApiData(url, items => fetchResultsSuccess(type, items, dispatch), true);
        };
      }
      case 'events_eventbrite': {
        return function(dispatch) {
          dispatch(fetchEventItemsInitiate());

          let url = `${BackendURL}/eventbrite/events?query=${searchQuery}&location=${country}`;
          DataProviderEventBrite.requestApiData(url, items => fetchResultsSuccess(type, items, dispatch));
        };
      }
      case 'courses_udemy': {
        return function(dispatch) {
          dispatch(fetchCourseItemsInitiate());

          let url = `${BackendURL}/udemy/courses/?query=${searchQuery}`;
          DataProviderUdemy.requestApiData(url, items => fetchResultsSuccess(type, items, dispatch));
        };
      }
      case 'gigs_freelancer': {
        return function(dispatch) {
          dispatch(fetchGigItemsInitiate());

          let url = `${BackendURL}/freelancer/gigs/?query= ${searchQuery}`;
          DataProviderFreelancer.requestApiData(url, items => fetchResultsSuccess(type, items, dispatch));
        };
      }
      default:
        break;
    }
  }
}
