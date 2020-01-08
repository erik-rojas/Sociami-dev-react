/*
    author: Alexander Zolotov
*/
import React from 'react';

import { Icon } from 'react-fa';

import ActionLink from '~/src/components/common/ActionLink';

import ResultCategory from '~/src/common/ResultCategoryNames';

const trimmedString = (original, limit) => {
  let trimmed = original.substr(0, limit);
  trimmed = trimmed.substr(0, Math.min(trimmed.length, trimmed.lastIndexOf(' ')));
  return trimmed;
};

const renderGigs = props => {
  return (
    <ul>
      {props.searchResults.gigs.map(function(gig, i) {
        return (
          <li key={i}>
            <div className="list-item">
              <div id="icons" className="icons-margin">
                <a href="#">
                  <span className="glyphicon glyphicon-tag" />
                </a>
                <a href="#">
                  <div>
                    <i className="fa fa-share-alt" aria-hidden="true" />
                  </div>
                </a>
              </div>
              <a href={gig.url} target="_blank" id="text">
                <div>{gig.title}</div>
                <div>{gig.description}</div>
                <div>Hong Kong</div>
              </a>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

const renderTrainings = props => {
  return (
    <ul>
      {props.searchResults.courses.map(function(course, i) {
        return (
          <li key={i}>
            <div className="list-item">
              <div id="icons" className="icons-margin">
                <a href="#">
                  <span className="glyphicon glyphicon-tag" />
                </a>
                <a href="#">
                  <div>
                    <i className="fa fa-share-alt" aria-hidden="true" />
                  </div>
                </a>
              </div>
              <a href={course.url} target="_blank" id="text">
                <div>{course.title}</div>
                <div>{course.price}</div>
              </a>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

const renderEvents = props => {
  return (
    <ul>
      {props.searchResults.events.map(function(event, i) {
        const title = trimmedString(event.name, 60);
        const description = trimmedString(event.description, 120);

        return (
          <li key={i}>
            <div className="list-item">
              <div id="icons" className="icons-margin">
                <a href="#">
                  <span className="glyphicon glyphicon-tag" />
                </a>
                <a href="#">
                  <div>
                    <i className="fa fa-share-alt" aria-hidden="true" />
                  </div>
                </a>
              </div>
              <a href={event.url} target="_blank" id="text">
                <div>{title}</div>
                <div>{description}</div>
              </a>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

const renderJobs = props => {
  return (
    <ul>
      {props.searchResults.jobs.map(function(job, i) {
        const title = job.jobtitle;
        const company = job.company ? job.company : 'N/A';

        return (
          <li key={i}>
            <div className="list-item">
              <div id="icons" className="icons-margin">
                <a href="#">
                  <span className="glyphicon glyphicon-tag" />
                </a>
                <a href="#">
                  <div>
                    <i className="fa fa-share-alt" aria-hidden="true" />
                  </div>
                </a>
              </div>
              <a href={job.url} target="_blank" id="text">
                <div>{title}</div>
                <div>{company}</div>
                <div>{job.country}</div>
              </a>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

const TrendScannerResults = props => {
  if (props.isFetchInProgress) {
    return (
      <h3>
        Searching... <Icon spin name="spinner" />
      </h3>
    );
  } else {
    switch (props.resultsSelectedCategory) {
      case ResultCategory.GIGS_FREELANCER: {
        return renderGigs(props);
      }
      case ResultCategory.COURSES_UDEMY: {
        return renderTrainings(props);
      }
      case ResultCategory.EVENTS_EVENTBRITE: {
        return renderEvents(props);
      }
      default:
        return renderJobs(props);
    }
  }
};

export default TrendScannerResults;
