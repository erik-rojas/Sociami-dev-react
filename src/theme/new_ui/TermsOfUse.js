/*
    author: Alexander Zolotov
*/

import React, { Component } from 'react';
import Axios from 'axios';
import { Icon } from 'react-fa';

import '~/src/theme/new_ui/css/privacy_policy.css';

class TermsOfUse extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: undefined,
    };
  }

  componentWillMount() {
    Axios.get(`https://sociamibucket.s3.amazonaws.com/legal/terms_of_use_min.html`)
      .then(result => {
        this.setState({ data: result.data });
      })
      .catch(error => {});
  }

  render() {
    return (
      <div id="privacy-policy-container">
        {this.state.data ? (
          <div dangerouslySetInnerHTML={{ __html: this.state.data }} />
        ) : (
          <div id="privacy-policy-spinner-container" className="text-center">
            <div className="privacy-policy-spinner">
              <Icon spin name="spinner" />Loading...
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default TermsOfUse;
