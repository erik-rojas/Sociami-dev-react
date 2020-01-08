/*
    author: Akshay Menon
*/
import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import ActionLink from '~/src/components/common/ActionLink';

import '~/src/theme/css/UserMenuDropdown.css';

class UserMenuDropdown extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <li className="dropdown user user-menu">
        <a href="#" className="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
          <i className="fa fa-user-circle" style={{color:'#016FB0'}}/>
        </a>
        <ul className="dropdown-menu pull-right">
          <div className="row user-name-tag">
            <i className="fa fa-2x fa-user-circle pull-left" style={{color: 'rgb(1, 111, 176)'}}/>
            <div className="name-tag">
              {' '}
              {this.props.userProfile.firstName} {this.props.userProfile.lastName} &nbsp;{' '}
            </div>
          </div>
          <hr className="user-hr" />
          <div className="row user-links" style={{ paddingTop: 5, paddingBottom: 5, }}>
            <span className="user-link-text">
              { this.props.localeData && this.props.localeData.localeTemporary }
            </span>
          </div>
          <div className="row user-links">
            <Link className="user-link-text" to="/challenges">
              Challenges
            </Link>
          </div>
          <div className="row user-links">
            <Link className="user-link-text" to="/userProfile">
              Your Profile
            </Link>
          </div>
          {this.props.isAdmin && (
            <div className="row user-links">
              <Link className="user-link-text" to="/company">
                Company
              </Link>
            </div>
          )}
          {this.props.isAdmin && (
            <div className="row user-links">
              <Link className="user-link-text" to="/teams">
                My Teams
              </Link>
            </div>
          )}
          <div className="row user-links">
            <Link className="user-link-text" to="/settings">
              Settings
            </Link>
          </div>
          <div className="row user-links">
            <ActionLink className="user-link-text" href="#" onClick={() => this.props.onSignOut()}>
              Logout
            </ActionLink>
          </div>
        </ul>
      </li>
    );
  }
}

// UserMenuDropdown.propTypes = {
// }

export default UserMenuDropdown;
