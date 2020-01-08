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
import '~/src/theme/css/projectBrowser.css';

class ProjectBrowser extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      project: {},
    };
  }

  componentDidMount() {
    const URLParams = new URLSearchParams(this.props.location.search);

    const currentProjectId = URLParams.get('id');

    if (currentProjectId) {
      Axios.get(`${ConfigMain.getBackendURL()}/projectGet?id=${currentProjectId}`)
        .then(response => this.projectFetchSuccess(response))
        .catch(error => this.projectFetchFailed(error));
    }
  }

  projectFetchSuccess(response) {
    this.setState({ project: response.data });
  }

  projectFetchFailed(error) {
    this.setState({ project: {} });
  }

  renderProject() {
    return this.state.project && this.state.project.name ? (
      <div className="row">
        <div className="col-lg-12">
          <h1>{this.state.project.name}</h1>
        </div>
        <div className="col-lg-12">
          <h2>{this.state.project.description}</h2>
        </div>
        <div className="col-lg-12">
          <h4>{this.state.project.nature}</h4>
        </div>
      </div>
    ) : (
      <div className="row" />
    );
  }

  render() {
    return (
      <div id="main-content_1">
        <div id="project-browser">
          <div className="container-fluid">{this.renderProject()}</div>
        </div>
      </div>
    );
  }
}

export default withRouter(ProjectBrowser);
