/*
    author: Alexander Zolotov
*/

import React, { Component } from 'react';
import 'url-search-params-polyfill';
import { withRouter } from 'react-router-dom';

import PropTypes from 'prop-types';

import Axios from 'axios';

import ConfigMain from '~/configs/main';

import '~/src/theme/css/common.css';

import '~/src/theme/css/progressionTreeBrowser.css';

class ProgressionTreeBrowser extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      progressionTree: {},
    };
  }

  componentDidMount() {
    const URLParams = new URLSearchParams(this.props.location.search);

    const CurrentProgressionTreeId = URLParams.get('id');

    const url = `${ConfigMain.getBackendURL()}/roadmapGet?id=${CurrentProgressionTreeId}`;
    Axios.get(url)
      .then(response => this.progressionTreeFetchSuccess(response))
      .catch(error => this.progressionTreeFetchFailed(error));
  }

  progressionTreeFetchSuccess(response) {
    this.setState({ progressionTree: response.data });
  }

  progressionTreeFetchFailed(error) {
    this.setState({ progressionTree: {} });
  }

  renderprogressionTree() {
    return this.state.progressionTree && this.state.progressionTree.name ? (
      <div className="row">
        <div className="col-lg-12">
          <h1>{this.state.progressionTree.name}</h1>
        </div>
        <div className="col-lg-12">
          <h2>{this.state.progressionTree.description}</h2>
        </div>
        <div className="col-lg-12">
          <h4>{this.state.progressionTree.nature}</h4>
        </div>
      </div>
    ) : (
      <div className="row" />
    );
  }

  render() {
    return (
      <div id="main-content_1">
        <div className="container-fluid">
          <div id="progressionTree-browser">{this.renderprogressionTree()}</div>
        </div>
      </div>
    );
  }
}

export default withRouter(ProgressionTreeBrowser);
