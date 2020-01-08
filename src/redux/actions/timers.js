import Axios from 'axios';
import Async from 'async';
import Moment from 'moment';
import _ from 'lodash';

import ConfigMain from '~/configs/main';

import {
  PREPARE_TIMERS_IN_PROGRESS,
  PREPARE_TIMERS_COMPLETE,
  SHOW_ALL_TIMERS,
  SHOW_TOP_TIMERS,
} from './actionTypes';

export function timersInProgress() {
  return {
    type: PREPARE_TIMERS_IN_PROGRESS,
  };
}

export function timersCompleted(timers) {
  return {
    type: PREPARE_TIMERS_COMPLETE,
    data: timers,
  };
}

export function showAllTimers() {
  return {
    type: SHOW_ALL_TIMERS,
  };
}

export function showTopTimers() {
  return {
    type: SHOW_TOP_TIMERS,
  };
}

function findRefreshTime(timer) {
  const sgOffset = Moment()
    .utcOffset('+08:00')
    .startOf('day');
  let nextRefresh;

  switch (_.get(timer, 'refresh')) {
    case 'Daily':
      nextRefresh = sgOffset.add(1, 'day');
      break;
    case 'Weekly':
      nextRefresh = sgOffset.day(8);
      break;
    case 'Monthly':
      nextRefresh = sgOffset.startOf('month').add(1, 'month');
      break;
  }

  return nextRefresh.toDate();
}

function fetchTimer(roadmap, userId, callback) {
  const url = `${ConfigMain.getBackendURL()}/timersAggregated?roadmapId=${roadmap._id}&userId=${userId}`;
  Axios.get(url)
    .then(timerResp => {
      callback(null, {
        roadmap,
        timerTracker: _.get(timerResp, 'data'),
      });
    })
    .catch(err => {
      //TODO
    });
}

function fetchTimers(roadMaps, userId, callback) {
  let roadMapsResults = {};
  roadMaps.forEach(roadmap => {
    roadMapsResults[roadmap._id] = Async.apply(fetchTimer, roadmap, userId);
  });
  Async.parallel(roadMapsResults, (error, results) => {
    callback(null, results);
  });
}

export function prepareTimers(roadMaps, userId) {
  return function(dispatch) {
    //async action entry point
    dispatch(timersInProgress());
    if (roadMaps && roadMaps.length > 0) {
      fetchTimers(roadMaps, userId, (error, results) => {
        let timers = [];
        Object.getOwnPropertyNames(results).forEach(roadmapId => {
          results[roadmapId]['timerTracker'].forEach(item => {
            const timer = _.get(item, 'timer', {});
            const count = _.get(item, 'tracker.count', 0);
            const quota = _.get(timer, 'quota', 0);
            if (count && count >= quota) {
              timers.push({
                name: results[roadmapId]['roadmap'].name + ' - ' + _.get(timer, 'type', ''),
                date: findRefreshTime(timer),
              });
            }
          });
        });
        dispatch(timersCompleted(timers));
      });
    } else {
      dispatch(timersCompleted([]));
    }
  };
}
