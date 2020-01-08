/*
    author: Alexander Zolotov
*/

import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import { ListGroupItem, ListGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// import ActivityTypes from '~/src/common/ActivityTypes';
// import ActionLink from '~/src/components/common/ActionLink';

import '~/src/theme/css/notifications.css';
import { fetchUserTasks } from '~/src/redux/actions/authorization';
import { markActivitySeen } from '~/src/redux/actions/activities';
import { setActiveHangout } from '~/src/redux/actions/tasks';

class Notifications extends React.Component {
  constructor(props) {
    super(props);
  }

  handleClickOutside() {
    this.props.onClose();
  }

  handleNotificationClick(notification) {
    this.props.markActivitySeen(notification._id, this.props.currentUserID, this.props.currentUserID);
    this.props.onClose();
  }

  componentDidMount() {
    this.setState({});
    this.props.fetchUserTasks(this.props.userProfile._id);
  }

  handleStartClick(task) {
    this.props.setActiveHangout(task);
    this.props.onClose();
  }

  renderNotifications() {
    const that = this;
    // const TaskStartedActivities = this.props.userActivities
    //   ? this.props.userActivities.filter(function(activity) {
    //       return (
    //         activity.type == ActivityTypes.TASK_STATUS_CHANGED ||
    //         activity.type == ActivityTypes.USER_TASK_ACTION
    //       );
    //     })
    //   : [];

    const oneDay = 24 * 60 * 60 * 1000;
    const Notifications = this.props.userTasks.created
      ? this.props.userTasks.created
        .map(function (task) {
          const days = Math.round(Math.abs((new Date().getTime() - task.date) / oneDay));
          const daysText = days === 0 ? 'Today ' : days + ' days ago';
          return {
            _id: task._id,
            isSeen: true,
            title: task.description,
            name: 'You can start your ',
            date: daysText,
            status: task.status,
            task,
          };
        })
        .filter(task => task.status !== 'complete')
        .reverse()
        .slice(0, 10)
      : [];

    // const Notifications =
    //   TaskStartedActivities.length > 0
    //     ? TaskStartedActivities.map(function(activity, i) {
    //         if (activity.subType == 'started') {
    //           return {
    //             title: `${
    //               activity.metadata.task.creator.firstName
    //             } has started a Hangout on skill "${
    //               activity.metadata.task.metaData.subject.skill.name
    //             }"`,
    //             isSeen:
    //               activity.witnessIDs &&
    //               activity.witnessIDs.find(function(witnessID) {
    //                 return witnessID == that.props.currentUserID;
    //               }),
    //             _id: activity._id
    //           };
    //         } else if (activity.subType == 'cancelled') {
    //           return {
    //             title: `${
    //               activity.metadata.userActor.firstName
    //             } has cancelled a Hangout on skill "${
    //               activity.metadata.task.metaData.subject.skill.name
    //             }"`,
    //             isSeen:
    //               activity.witnessIDs &&
    //               activity.witnessIDs.find(function(witnessID) {
    //                 return witnessID == that.props.currentUserID;
    //               }),
    //             _id: activity._id
    //           };
    //         } else if (activity.subType == 'leave') {
    //           return {
    //             title: `${
    //               activity.metadata.userActor.firstName
    //             } has left your Hangout on skill "${
    //               activity.metadata.task.metaData.subject.skill.name
    //             }"`,
    //             isSeen:
    //               activity.witnessIDs &&
    //               activity.witnessIDs.find(function(witnessID) {
    //                 return witnessID == that.props.currentUserID;
    //               }),
    //             _id: activity._id
    //           };
    //         } else if (activity.subType == 'cancelled_automatically') {
    //           return {
    //             title: `Hangout on skill "${
    //               activity.metadata.task.metaData.subject.skill.name
    //             } has been cancelled due to not enough participants!"`,
    //             isSeen:
    //               activity.witnessIDs &&
    //               activity.witnessIDs.find(function(witnessID) {
    //                 return witnessID == that.props.currentUserID;
    //               }),
    //             _id: activity._id
    //           };
    //         } else {
    //           return {
    //             title: `Unsupported notification subType "${activity.subType}"`,
    //             isSeen: false,
    //             _id: activity._id
    //           };
    //         }
    //       })
    //     : [];

    const { userProfile = {} } = this.props;

    return (
      <ListGroup>
        <ListGroupItem className="notifyTitle">
          <div>Notifications ({Notifications.length})</div>
        </ListGroupItem>
        {this.props.userTasks.isLoading ? <div className="notifications-loading">Loading...</div> : null}
        <div id="notificationSection">
          {Notifications.map(function (notification, i) {
            return (
              <ListGroupItem
                key={i}
                className={
                  notification.isSeen ? 'notification-item-seen notification-item' : 'notification-item'
                }
              >
                <div
                  onClick={e => {
                    e.preventDefault();
                    that.handleNotificationClick(notification);
                  }}
                >
                  <div className="notificationRow notify-grow">
                    <div className="notify-container">
                      <div className="notifyIcon">
                        {userProfile.pictureURL ? <img src={userProfile.pictureURL} /> : <i className="fa fa-user-circle fa-2x fa-profile-image" />}
                      </div>
                      <div className="notify-text-detail">
                        <div className="notifyDesc">
                          <span className="notify-name">{notification.name}</span>
                          <span className="notify-title">{notification.title}</span>
                        </div>

                        <div className="notifyMeta">
                          <span className="notify-date">{notification.date}</span>
                          <span className="notify-actions">
                            <Link
                              to="/tasks"
                              className="notify-btn-notification-check"
                              onClick={() => that.handleStartClick(notification.task)}
                            >
                              Start
                            </Link>
                            <button className="notify-btn-notification-reschedule">
                              Reschedule
                            </button>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ListGroupItem>
            );
          })}
        </div>
        {
          !this.props.userTasks.isLoading && (
            <div className="more-notifications">
              <a href="#">See all notifications ></a>
            </div>
          )
        }
      </ListGroup>
    );
  }

  render() {
    return <div id="notificationTile">{this.renderNotifications()}</div>;
  }
}

Notifications.PropTypes = {
  isAuthorized: PropTypes.bool.isRequired,
  userActivities: PropTypes.array.isRequired,
  markActivitySeen: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  currentUserID: state.userProfile.profile._id,
  userTasks: state.userProfile.tasks,
  userProfile: state.userProfile.profile,
});

const mapDispatchToProps = dispatch => ({
  markActivitySeen: bindActionCreators(markActivitySeen, dispatch),
  fetchUserTasks: bindActionCreators(fetchUserTasks, dispatch),
  setActiveHangout: bindActionCreators(setActiveHangout, dispatch),
});

//withRouter - is a workaround for problem of shouldComponentUpdate when using react-router-v4 with redux
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(require('react-click-outside')(Notifications));
