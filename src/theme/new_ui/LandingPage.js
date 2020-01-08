/*
    author: Alexander Zolotov
*/

import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { withCookies, Cookies } from 'react-cookie';

import '~/src/theme/new_ui/css/style.css';

import SignUpFormPopup from '~/src/authentication/SignUpForm';

import ActionLink from '~/src/components/common/ActionLink';

import { openSignUpForm } from '~/src/redux/actions/authorization';

import { Route, Switch } from 'react-router-dom'; //temporarily here, remove it!!!!!!!
import Authorize from '~/src/authentication/Authorize';

import CharacterCreationFlow from '~/src/character-creation/CharacterCreationFlow';

import ConfigMain from '~/configs/main';

import { startCharacterCreation } from '~/src/redux/actions/characterCreation';

import LandingPageContent from '~/src/theme/new_ui/LandingPageContent';
import PrivacyPolicy from '~/src/theme/new_ui/PrivacyPolicy';
import TermsOfUse from '~/src/theme/new_ui/TermsOfUse';

class LandingPage extends React.Component {
  constructor(props) {
    super(props);
  }

  startCharacterCreation() {
    this.props.startCharacterCreation();
  }

  renderSignUpForm() {
    return this.props.isSignUpFormOpen ? (
      <SignUpFormPopup
        modalIsOpen={this.props.isSignUpFormOpen}
        isAuthorized={this.props.isAuthorized}
        onCloseModal={() => this.props.onCloseSignUpModal()}
        onHandleSignUpFacebook={() => this.props.onHandleSignUpFacebook()}
        onHandleSignUpLinkedIn={() => this.props.onHandleSignUpLinkedIn()}
        pathname={this.props.pathname}
      />
    ) : null;
  }

  renderRoutes() {
    return (
      <Switch>
        <Route exact path="/" render={routeProps => <LandingPageContent {...routeProps} {...this.props} />} />
        <Route path="/authorize" render={routeProps => <Authorize {...routeProps} {...this.props} />} />
        <Route
          exact
          path="/privacyPolicy"
          render={routeProps => <PrivacyPolicy {...routeProps} {...this.props} />}
        />
        <Route
          exact
          path="/termsOfUse"
          render={routeProps => <TermsOfUse {...routeProps} {...this.props} />}
        />
        <Route path="*" render={routeProps => <LandingPageContent {...routeProps} {...this.props} />} />
      </Switch>
    );
  }

  render() {
    return <div className="wrapper">{this.renderRoutes() /*This is temporary - remove it!!!!!!!!*/}</div>;
  }
}

LandingPage.propTypes = {
  isAuthorized: PropTypes.bool.isRequired,
  isSignUpFormOpen: PropTypes.bool.isRequired,
  startCharacterCreation: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  openSignUpForm: bindActionCreators(openSignUpForm, dispatch),
  startCharacterCreation: bindActionCreators(startCharacterCreation, dispatch),
});

const mapStateToProps = state => ({
  isAuthorized: state.userProfile.isAuthorized,
});

//withRouter - is a workaround for problem of shouldComponentUpdate when using react-router-v4 with redux
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withCookies(LandingPage));
