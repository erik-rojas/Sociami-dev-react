/*
    author: Alexander Zolotov
*/

import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { Icon } from 'react-fa';

import ActivityTypes from '~/src/common/ActivityTypes';

import ActionLink from '~/src/components/common/ActionLink';

const RenderDummyFriends = false;

class HeaderTaskManager extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const that = this;
    return (
      <div className="head-deep">
        <div className="dropdown">
          <button id="dLabel" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <span className="text-head">My Tasks</span>
            <Icon name="chevron-down" aria-hidden="true" />
          </button>
          <ul className="dropdown-menu" aria-labelledby="dLabel">
            {this.props.filters.map((filter, i) => {
              return (
                <li key={i} className={this.props.filterCurrent.type == filter.type ? 'active' : ''}>
                  <ActionLink href="#" onClick={() => that.props.onFilterChange(filter)}>
                    {filter.label}
                  </ActionLink>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
}

HeaderTaskManager.propTypes = {};

export default HeaderTaskManager;
