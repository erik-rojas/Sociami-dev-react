/*
    author: Alexander Zolotov
*/

import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { Icon } from 'react-fa';

import ActionLink from '~/src/components/common/ActionLink';

import Notifications from '~/src/theme/components/Notifications';

import StatsDropdown from '~/src/theme/components/StatsDropdown';

import ConfigMain from '~/configs/main';

import { ToastContainer, toast } from 'react-toastify';

import UserMenuDropdown from './components/UserMenuDropdown';

import PubSub from 'pubsub-js';

class ThemeHeader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      notificationsOpen: false,
    };
  }

  componentDidMount() {
    $(window).scroll(function() {
      var distanceY = window.pageYOffset;
      var breakpoint = 100;
      var soqqleLogo = $('.logo');
      var navLinks = $('#nav-links');
      var navTasks = $('#nav-tasks');
      var sessionHeader = $('.session-header');
      if (distanceY > breakpoint) {
        soqqleLogo.addClass('logo-scroll');
        navLinks.addClass('nav-links-scroll');
        navTasks.addClass('nav-tasks-scroll');
        sessionHeader.addClass('session-header-scroll');
      } else {
        soqqleLogo.removeClass('logo-scroll');
        navLinks.removeClass('nav-links-scroll');
        navTasks.removeClass('nav-tasks-scroll');
        sessionHeader.removeClass('session-header-scroll');
      }
    });
  }

  handleNotificationsOpen() {
    if (this.props.userActivities.length > 0) {
      this.setState({ notificationsOpen: true });
    }
  }

  handleNotificationsClose() {
    this.setState({ notificationsOpen: false });
  }

  componentWillMount() {
    this.PubsubEventsSubscribe();
  }

  componentWillUnmount() {
    this.PubsubEventsUnSubscribe();
  }

  PubsubEventsSubscribe() {
    if (!this.token_server_event_accounting_update) {
      this.token_server_event_accounting_update = PubSub.subscribe(
        'accounting_updated',
        this.serverEventAccountingUpdated.bind(this),
      );
    }
  }

  PubsubEventsUnSubscribe() {
    if (this.token_server_event_accounting_update) {
      PubSub.unsubscribe(this.token_server_event_accounting_update);
      this.token_server_event_accounting_update = undefined;
    }
  }

  serverEventAccountingUpdated(msg, data) {
    if (data && data.numTokens) {
      let source = '';

      if (data.source) {
        if (data.source.illuminate) {
          source = `for ${data.source.illuminate.name}`;
        } else if (data.source.deepdive) {
          source = `for ${data.source.deepdive.name}`;
        }
      }

      this.showNotification(
        `Congratulations: You've earned ${data.numTokens} ${
          data.numTokens > 1 ? 'tokens' : 'token'
        } ${source}!!!`,
      );
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.isAuthorized != this.props.isAuthorized) {
      if (this.props.isAuthorized) {
        this.props.fetchUserActivities(this.props.currentUserID);
        this.PubsubEventsUnSubscribe();
        this.PubsubEventsSubscribe();
      } else {
        this.PubsubEventsUnSubscribe();
      }
    }
  }

  showNotification(message) {
    toast(message, { position: toast.POSITION.TOP_CENTER });
  }

  onSignOut() {
    this.props.logout();
  }

  render() {
    const CurrentUserID = this.props.currentUserID;

    const NumNotifications = this.props.userActivities
      ? this.props.userActivities.filter(function(activity) {
          return (
            !activity.witnessIDs ||
            !activity.witnessIDs.find(function(witnessID) {
              return witnessID == CurrentUserID;
            })
          );
        }).length
      : 0;

    const NumNotificationsString = NumNotifications > 0 ? `${NumNotifications}` : '';

    const labelNotif =
      NumNotifications > 0 ? <span className="label-notif">{NumNotificationsString}</span> : '';

    const OpenMenuClass = !this.props.isSidebarOpen ? 'open-menu' : 'open-menu';
    const CloseMenuClass = this.props.isSidebarOpen ? 'close-menu' : 'close-menu';

    return (
      <div className="session-header" id="popup-root">
        <ToastContainer />
        {this.state.notificationsOpen && (
          <Notifications
            onClose={() => this.handleNotificationsClose()}
            userActivities={this.props.userActivities}
          />
        )}
        <div className="container-fluid">
          <div className="row">
            <div id="nav-menu" className="nav-menu">
              <div className="menu-hamburger">
                <ActionLink
                  href="#"
                  className={OpenMenuClass}
                  style={{ dispay: 'none' }}
                  onClick={() => this.props.openSidebar(true)}
                  style={{ display: !this.props.isSidebarOpen ? 'block' : 'none' }}
                >
                  <span />
                  <span />
                  <span />
                </ActionLink>

                <ActionLink
                  href="#"
                  className={CloseMenuClass}
                  onClick={() => this.props.openSidebar(false)}
                  style={{ display: this.props.isSidebarOpen ? 'block' : 'none' }}
                >
                  <Icon name="times" aria-hidden="true" />
                </ActionLink>
              </div>
              <h1 className="logo">
                <Link to="/">
                  <img
                    src="https://sociamibucket.s3.amazonaws.com/assets/new_ui_color_scheme/img/logo.png"
                    alt=""
                  />
                  <span className="logo-alpha">alpha</span>
                </Link>
              </h1>
            </div>

            <div id="nav-links" className="nav-links">
              <ul className="navbar-top-links">
                <StatsDropdown userProfile={this.props.userProfile} accounting={this.props.accounting} />
                <li className="notification">
                  <ActionLink href="#" onClick={() => this.handleNotificationsOpen()}>
                    <Icon name="bell" aria-hidden="true" />
                    {/* {labelNotif} */}
                  </ActionLink>
                </li>
                <li className="register">
                  <Link href="#" to="/connections">
                    <Icon name="user-plus" aria-hidden="true" />
                  </Link>
                </li>
                <UserMenuDropdown
                  isAdmin={this.props.isAdmin}
                  userProfile={this.props.userProfile}
                  onSignOut={() => this.onSignOut()}
                />
              </ul>
            </div>

            <div id="nav-tasks" className="nav-tasks">
              <div className="task-manager">
                {!ConfigMain.ChallengesScannerDisabled ? (
                  <Link to="/projectManagement" className="btn-base btn-yellow">
                    Challenges Scanner
                  </Link>
                ) : (
                  <div
                    className="btn-nav disabled"
                    style={{ cursor: 'default', position: 'relative', marginLeft: '5px', marginRight: '5px' }}
                  >
                    <img
                      src="https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/custom_ui/challenges.png"
                      style={{ width: '20px' }}
                    />
                    {/* <span>CHALLENGES</span> */}
                    CHALLENGES
                    <div
                      className="challenges-coming-soon"
                      style={{
                        fontSize: '10px',
                        position: 'absolute',
                        left: '0px',
                        bottom: '-15px',
                        color: 'white',
                        fontFamily: "'Berlin-Sans-FB-Regular', sans-serif",
                      }}
                    >
                      coming soon
                    </div>
                  </div>
                )}

                <Link to="/progressionTrees" className="btn-nav">
                  <img
                    src="https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/custom_ui/progressionskill.png"
                    style={{ width: '20px' }}
                  />
                  PROGRESSIONS
                </Link>
                <Link to="/tasks" className="btn-nav">
                  <img
                    src="https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/custom_ui/task.png"
                    style={{ width: '20px' }}
                  />
                  TASKS
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ThemeHeader;
