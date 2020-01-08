/*
    author: Alexander Zolotov
*/
import React from 'react';

import ActionLink from '~/src/components/common/ActionLink';

import ResultCategory from '~/src/common/ResultCategoryNames';

const TrendScannerNavigation = props => {
  return (
    <div id="navbar-trend-scanner">
      <ul className="nav navbar-nav">
        <li>
          <ActionLink
            href="#"
            id={ResultCategory.GIGS_FREELANCER}
            className={props.resultsSelectedCategory == ResultCategory.GIGS_FREELANCER ? 'active' : ''}
            onClick={e => props.onHandleSelectCategory(e)}
          >
            Gigs
          </ActionLink>
        </li>
        <li>
          <ActionLink
            href="#"
            id={ResultCategory.COURSES_UDEMY}
            className={props.resultsSelectedCategory == ResultCategory.COURSES_UDEMY ? 'active' : ''}
            onClick={e => props.onHandleSelectCategory(e)}
          >
            Trainings
          </ActionLink>
        </li>
        <li>
          <ActionLink
            href="#"
            id={ResultCategory.EVENTS_EVENTBRITE}
            className={props.resultsSelectedCategory == ResultCategory.EVENTS_EVENTBRITE ? 'active' : ''}
            onClick={e => props.onHandleSelectCategory(e)}
          >
            Events
          </ActionLink>
        </li>
        <li>
          <ActionLink
            href="#"
            id={ResultCategory.JOBS_INDEED}
            className={props.resultsSelectedCategory == ResultCategory.JOBS_INDEED ? 'active' : ''}
            onClick={e => props.onHandleSelectCategory(e)}
          >
            Jobs
          </ActionLink>
        </li>
        <li>
          <a href="#">Soqqle Campaigns</a>
        </li>
        <li>
          <a href="#">
            Bookmarks <span id="bookmark-arrow-icon" className="glyphicon glyphicon-menu-down" />
          </a>
        </li>
      </ul>
    </div>
  );
};

export default TrendScannerNavigation;
