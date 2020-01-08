import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap.css';
import '~/src/theme/css/tooltipUser.css';
import * as FontAwesome from 'react-icons/lib/fa';

import { Link } from 'react-router-dom';

import Axios from 'axios';
import ConfigMain from '~/configs/main';

class TooltipUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      connectionUser: [],
      connectionStatus: 0, // 0 - loading
    };

    this.getUserInfo = this.getUserInfo.bind(this);
    this.getMyFriendsFilter = this.getMyFriendsFilter.bind(this);
    this.addFriend = this.addFriend.bind(this);
    this.friendRequest = this.friendRequest.bind(this);
  }

  componentDidMount() {
    this.getUserInfo();
    this.getMyFriendsFilter();
  }

  openChat(user) {
    const chatBoxElemet = document.getElementById(user.user_id);

    if (chatBoxElemet) {
      chatBoxElemet.click();
    } else {
      PubSub.publish('OpenChat', user);
    }
  }

  getUserInfo() {
    const userFromProp = this.props.user;
    const url = `${ConfigMain.getBackendURL()}/fetchUserProfileById`;
    Axios.get(url, {
      params: {
        id: userFromProp.user._id,
      },
    })
      .then(response => {
        this.setState({ user: response.data.profile });
      })
      .catch(error => {
        console.warn('ERROR: ', error);
      });
  }

  getMyFriendsFilter() {
    const userFromProp = this.props.user;
    const currentUserId = this.props.currentUser._id;
    const connectionsUrl = `${ConfigMain.getBackendURL()}/getConnectedSoqqlers`;
    Axios.get(connectionsUrl, {
      params: {
        currentUser: currentUserId,
      },
    })
      .then(response => {
        const filterFriend = response.data.filter(friend => friend.id === userFromProp.user._id);

        if (filterFriend.length) {
          this.setState({
            connectionUser: filterFriend,
            connectionStatus: filterFriend[0].connectionStatus,
          });
        } else {
          throw new Error('no-friend');
        }
      })
      .catch(error => {
        // console.warn(error);
        this.setState({
          connectionStatus: 'no-friend',
        });
      });
  }

  addFriend(event) {
    event.preventDefault();

    const userFromProp = this.props.user;
    const currentUserId = this.props.currentUser._id;

    this.setState({
      connectionStatus: 0,
    });

    const url = `${ConfigMain.getBackendURL()}/addSoqqler`;
    Axios.post(url, {
      uid1: currentUserId,
      uid2: userFromProp.user._id,
      reqStatus: 2,
    })
      .then(response => {
        if (response.data === 'success') {
          this.getMyFriendsFilter();
        } else {
          throw new Error('not-success');
        }
      })
      .catch(error => {
        console.warn(error);
        this.getMyFriendsFilter();
      });
  }

  /**
   * Handle friend request. action can be "Accept", "Reject" or "Withdraw"
   */
  friendRequest(action) {
    const userFromProp = this.props.user;
    const currentUser = this.props.currentUser;

    this.setState({
      connectionStatus: 0,
    });

    const url = `${ConfigMain.getBackendURL()}/connectSoqqler`;
    Axios.post(url, {
      currentUser,
      otherUser: this.state.connectionUser[0],
      connectAction: action,
    })
      .then(response => {
        if (response.data === 'success') {
          this.getMyFriendsFilter();
        } else {
          throw new Error('not-success');
        }
      })
      .catch(error => {
        console.warn(error);
        this.getMyFriendsFilter();
      });
  }

  renderAddFriendButton(status) {
    let content;
    switch (status) {
      case 0:
        content = (
          <a href="#" className="item" onClick={e => e.preventDefault()}>
            Loading...
          </a>
        );
        break;
      case 'Sent':
        content = (
          <a
            className="item"
            href="#"
            onClick={e => {
              e.preventDefault();
              this.friendRequest('Withdraw');
            }}
          >
            <FontAwesome.FaCheckCircle size={25} style={{ marginRight: '10px' }} />
            Request sent
          </a>
        );
        break;
      case 'Friends':
        content = (
          <a
            className="item"
            href="#"
            onClick={e => {
              e.preventDefault();
              this.friendRequest(this.state.connectionStatus);
            }}
          >
            <FontAwesome.FaUserTimes size={25} style={{ marginRight: '10px' }} />
            Remove Friend
          </a>
        );
        break;

      default:
        content = (
          <a className="item" href="#" onClick={this.addFriend}>
            <FontAwesome.FaUserPlus size={25} style={{ marginRight: '10px' }} />
            Add Friend
          </a>
        );
        break;
    }

    return content;
  }

  ovelayContent(user) {
    const userFromProp = this.props.user;
    return (
      <div>
        {this.state.user !== null ? (
          <div className="user-header">
            <div className="user-header-avatar">
              <img src={user.pictureURL} alt="user avatar" />
            </div>
            <div className="user-header-info">
              <h2 className="user-name">{`${user.firstName} ${user.lastName}`}</h2>
              <a className="user-socaial" target="_blank" href="#">
                @danielshen
              </a>
            </div>
          </div>
        ) : (
          <div className="user-header">
            <div className="loading-data">Loading...</div>
          </div>
        )}

        <div className="user-action">
          {this.renderAddFriendButton(this.state.connectionStatus)}
          <a
            className="item"
            href="#"
            onClick={e => {
              e.preventDefault();
              this.openChat(userFromProp);
            }}
          >
            <FontAwesome.FaComments size={25} style={{ marginRight: '10px' }} />
            Send Message
          </a>

          <Link className="item" to={`/userProfile?id=${userFromProp.user._id}`}>
            <FontAwesome.FaUser size={25} style={{ marginRight: '10px' }} />
            View Full Profile
          </Link>
        </div>
      </div>
    );
  }

  render() {
    return (
      <Tooltip
        overlayClassName="tooltip-user"
        placement={'top'}
        mouseEnterDelay={0}
        mouseLeaveDelay={0.1}
        overlay={this.ovelayContent(this.state.user)}
        transitionName={'animation'}
      >
        {this.props.children}
      </Tooltip>
    );
  }
}

TooltipUser.propTypes = {
  children: PropTypes.element.isRequired,
  user: PropTypes.object.isRequired, // for tooltip user data
  currentUser: PropTypes.object.isRequired, // my profile user data
};

export default TooltipUser;
