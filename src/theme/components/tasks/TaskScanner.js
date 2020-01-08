/*
    author: Alexander Zolotov
*/

import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { Icon } from 'react-fa';

import ActivityTypes from '~/src/common/ActivityTypes';

const RenderDummyFriends = false;

import ActionLink from '~/src/components/common/ActionLink';

import TaskTypes from '~/src/common/TaskTypes';

const DayFromNumber = dayNum => {
  const DayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return DayNames[dayNum];
};

const MonthFromNumber = monthNum => {
  const MonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Dec'];

  return MonthNames[monthNum];
};

const Hours12 = date => {
  return (date.getHours() + 24) % 12 || 12;
};

const RenderSingleTask = (task, i, props) => {
  if (!task.type) {
    return null;
  }

  if (task.type == TaskTypes.DEEPDIVE) {
    const date = new Date(task.metaData.time);

    const dateNow = new Date(Date.now());
    const dateTomorrow = new Date(Date.now() + 60 * 60 * 24);

    const Noon = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);
    const AmPm = date.getTime() < Noon.getTime() ? 'am' : 'pm';

    const Hours = String(Hours12(date)) + AmPm;
    let time = '';

    if (
      dateNow.getDate() == date.getDate() &&
      dateNow.getMonth() == date.getMonth() &&
      dateNow.getFullYear() == date.getFullYear()
    ) {
      time = `${Hours} today`;
    } else if (
      dateTomorrow.getDate() == date.getDate() &&
      dateTomorrow.getMonth() == date.getMonth() &&
      dateTomorrow.getFullYear() == date.getFullYear()
    ) {
      time = `${Hours} tomorrow`;
    } else {
      time = `${Hours} on ${DayFromNumber(date.getDay())} (${date.getDate()} ${MonthFromNumber(
        date.getMonth(),
      )})`;
    }

    if (date < new Date()) time = 'mutually convenient time today';

    return (
      <div className="col-tokens col-sm-12" key={i}>
        <div className="item-tokens tokens-red">
          <h4>
            <a href="#" className="link-red">
              {task.creator.firstName}
            </a>{' '}
            {` is looking to deepdive to discuss ${task.metaData.subject.roadmap.name} at ${time}`}
          </h4>
          <p className="text-1">{task.creator.firstName} is in your wider network</p>
          {/* <p className="text-2">Earn up to 10 tokens completing this task</p> */}
          <div className="token-bottom">
            {!task.isLocked ? (
              <ActionLink
                href="#"
                className="btn-bg-red"
                data-toggle="modal"
                data-target="#token"
                onClick={() => props.handleOpenConfirmTaskDetailsPopup(task)}
              >
                <span className="font-small">Join</span>
              </ActionLink>
            ) : (
              <span className="tasks-scanner-task-locked-icon glyphicon glyphicon-lock">Locked</span>
            )}
          </div>
        </div>
      </div>
    );
  }
};

class TaskScanner extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isSearchExpanded: false,
    };
  }

  renderTasks() {
    let foundTasks = [];

    const scannerQuery = this.props.scannerQuery.toLowerCase();

    if (scannerQuery != '') {
      foundTasks = this.props.tasks.filter(function(task) {
        return (
          (this.props.currentUserID == undefined || task.userID != this.props.currentUserID) &&
          task.name &&
          task.name.toLowerCase().startsWith(scannerQuery)
        );
      });
    } else {
      foundTasks = this.props.tasks;
    }

    let that = this;

    if (foundTasks.length == 0) {
      return null;
    } else {
      return foundTasks.map(function(task, i) {
        return RenderSingleTask(task, i, that.props);
      });
    }
  }

  handleExpandSearch(expand) {
    this.setState({ isSearchExpanded: expand });
  }

  render() {
    const BtSearchClass = this.state.isSearchExpanded ? 'bt-search open-search' : 'bt-search';
    const HeadingBorderClass = this.props.isExpanded
      ? 'text-heading heading-border heading-border-decorators-visible'
      : 'text-heading heading-border';
    return (
      <div className="block-tokens">
        <div className="expanding">
          {!this.props.isExpanded ? (
            <ActionLink href="#" className="open-expanding" onClick={() => this.props.onExpand(true)}>
              <Icon className="none-padding-left" name="chevron-left" aria-hidden="true" />
            </ActionLink>
          ) : (
            <ActionLink href="#" className="close-expanding" onClick={() => this.props.onExpand(false)}>
              <Icon className="none-padding-left" name="chevron-right" aria-hidden="true" />
            </ActionLink>
          )}
        </div>

        <div className="expanding expanding-mobile">
          {!this.props.isExpanded ? (
            <ActionLink href="#" className="open-expanding" onClick={() => this.props.onExpand(true)}>
              <Icon className="none-padding-left" name="chevron-left" aria-hidden="true" />
            </ActionLink>
          ) : (
            <ActionLink href="#" className="close-expanding" onClick={() => this.props.onExpand(false)}>
              <Icon className="none-padding-left" name="chevron-right" aria-hidden="true" />
            </ActionLink>
          )}
        </div>

        <div className={BtSearchClass}>
          <ActionLink href="#" className="icon-search" onClick={() => this.handleExpandSearch(true)}>
            <Icon className="none-padding-left" name="search" aria-hidden="true" />
          </ActionLink>

          <div className="block-search" style={{ display: this.state.isSearchExpanded ? 'block' : 'none' }}>
            <div className="close-search">
              <ActionLink href="#" onClick={() => this.handleExpandSearch(false)}>
                <Icon name="times" aria-hidden="true" />
              </ActionLink>
            </div>
            <div className="form-search-tokens">
              <div id="imaginary_container">
                <div className="input-group stylish-input-group">
                  <input type="text" className="form-control input-text" placeholder="Search" />
                  <span className="input-group-addon">
                    <button type="submit">
                      <span className="glyphicon glyphicon-search" />
                    </button>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="box-head">
          <h1 className={HeadingBorderClass}>
            <span>Complete quests to earn tokens</span>
          </h1>
        </div>

        {/* 
    Remove for now. Daniel is still thinking for the purpose
    <div className="box-location clearfix">
        <div className="text-location">
            <span>Hong Kong Island</span>
        </div>
    </div> */}

        <div className="scrollbar-inner clearfix">
          <div className="wrapper-tokens clearfix">
            <div className="scrollbar-inner clearfix">{this.renderTasks()}</div>
          </div>
        </div>
      </div>
    );
  }
}

TaskScanner.propTypes = {};

export default TaskScanner;
