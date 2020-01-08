/*
    author: Alexander Zolotov
*/

import React, { Component } from 'react';
import Axios from 'axios';
import { Icon } from 'react-fa';

import '~/src/theme/new_ui/css/privacy_policy.css';

class PrivacyPolicy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      privacyPolicyData: undefined,
    };
  }

  componentWillMount() {
    Axios.get(`https://sociamibucket.s3.amazonaws.com/legal/privacy_policy_min.html`)
      .then(result => {
        this.setState({ privacyPolicyData: result.data });
      })
      .catch(error => {});
  }

  render() {
    return (
      <div id="privacy-policy-container">
        {this.state.privacyPolicyData ? (
          <div dangerouslySetInnerHTML={{ __html: this.state.privacyPolicyData }} />
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

export default PrivacyPolicy;
