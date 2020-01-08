/*
    author: Alexander Zolotov
*/

import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';

import ActionLink from '~/src/components/common/ActionLink';

import Notifications from '~/src/theme/components/Notifications';

import '~/src/theme/css/navbarTop.css';

import { fetchUserActivities } from '~/src/redux/actions/authorization';

class NavTop extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      notificationsOpen: false,
    };
  }

  componentWillMount() {
    if (this.props.isAuthorized) {
      this.props.fetchUserActivities(this.props.currentUserID);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.isAuthorized != this.props.isAuthorized) {
      if (this.props.isAuthorized) {
        this.props.fetchUserActivities(this.props.currentUserID);
      }
    }
  }

  renderConnectionsView() {
    let ConnectionsViewLink = '';
    if (this.props.isAuthorized) {
      ConnectionsViewLink = (
        <Link href="#" to="/connections">
          <img src="http://sociamibucket.s3.amazonaws.com/assets/images/custom_ui/add-friend.png" />
        </Link>
      );
    }
    return ConnectionsViewLink;
  }

  handleNotificationsOpen() {
    if (this.props.userActivities.length > 0) {
      this.setState({ notificationsOpen: true });
    }
  }

  handleNotificationsClose() {
    this.setState({ notificationsOpen: false });
  }

  render() {
    const ButtonClassName = 'top-nav-btn';

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

    const NumNotificationsString = NumNotifications > 0 ? `(${NumNotifications})` : '';

    return (
      <div id="nav-top">
        <nav className="navbar navbar-default navbar-right">
          <div className="container-fluid">
            <div className="navbar-header">
              <button
                type="button"
                className="navbar-toggle"
                data-toggle="collapse"
                data-target="#navbar-content-top"
              >
                <span className="icon-bar" />
                <span className="icon-bar" />
                <span className="icon-bar" />
              </button>
            </div>
            <div className="collapse navbar-collapse" id="navbar-content-top">
              {this.state.notificationsOpen && (
                <Notifications onClose={() => this.handleNotificationsClose()} />
              )}
              <ul className="nav navbar-nav">
                {/* <li>
                    <p className="navbar-btn">
                      <Link to='/searchResults' className={this.props.location.pathname == "/searchResults" 
                      ? ButtonClassName + " active" : ButtonClassName}>Trends Scanner</Link>
                    </p>
                  </li> */}
                <li>
                  <p className="navbar-btn">
                    <Link
                      to="/progressionTrees"
                      className={
                        this.props.location.pathname == '/progressionTrees'
                          ? ButtonClassName + ' active'
                          : ButtonClassName
                      }
                    >
                      Progression Trees
                    </Link>
                  </p>
                </li>
                <li>
                  <p className="navbar-btn">
                    <Link
                      to="/projectManagement"
                      className={
                        this.props.location.pathname == '/projectManagement'
                          ? ButtonClassName + ' active'
                          : ButtonClassName
                      }
                    >
                      Project Management
                    </Link>
                  </p>
                </li>
                <li>
                  <p className="navbar-btn">
                    <Link
                      to="/tasks"
                      className={
                        this.props.location.pathname == "/tasks"
                          ? ButtonClassName + ' active'
                          : ButtonClassName
                      }
                    >
                      Tasks Manager
                    </Link>
                  </p>
                </li>
                {/*<li>
                    <p className="navbar-btn">
                      <Link to='/ico' className={this.props.location.pathname == "/ico" 
                      ? ButtonClassName + " active" : ButtonClassName}>ICO</Link>
                    </p>
                  </li>*/}
                <li>
                  <p className="navbar-btn">
                    <Link
                      to="/about"
                      className={
                        this.props.location.pathname == '/about'
                          ? ButtonClassName + ' active'
                          : ButtonClassName
                      }
                    >
                      About
                    </Link>
                  </p>
                </li>
                <li className="nav-user-profile-control">
                  <a href="#">
                    <img src="http://sociamibucket.s3.amazonaws.com/assets/images/custom_ui/close-envelope.png" />
                  </a>
                </li>
                <li className="nav-user-profile-control">
                  {this.props.isAuthorized && (
                    <ActionLink href="#" onClick={() => this.handleNotificationsOpen()}>
                      {NumNotificationsString}
                      <img src="http://sociamibucket.s3.amazonaws.com/assets/images/custom_ui/notification.png" />
                    </ActionLink>
                  )}
                </li>
                <li className="nav-user-profile-control">{this.renderConnectionsView()}</li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    );
  }
}

NavTop.PropTypes = {
  location: PropTypes.object.isRequired,
  fetchUserActivities: PropTypes.func.isRequired,
  userActivities: PropTypes.array.isRequired,
};

const mapDispatchToProps = dispatch => ({
  fetchUserActivities: bindActionCreators(fetchUserActivities, dispatch),
});

const mapStateToProps = state => ({
  isAuthorized: state.userProfile.isAuthorized,
  currentUserID: state.userProfile.profile._id,
  userActivities: state.userProfile.activities.data,
});

//withRouter - is a workaround for problem of shouldComponentUpdate when using react-router-v4 with redux
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NavTop);
