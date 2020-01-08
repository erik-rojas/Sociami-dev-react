/*
  author: Anna Kuzii
*/

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom'; //temporarily here, remove it!!!!!!!
import { openSignUpForm,changePageLanguage } from '~/src/redux/actions/authorization';
import { startCharacterCreation } from '~/src/redux/actions/characterCreation';
import SignUpFormPopup from '~/src/authentication/SignUpForm';
import Authorize from '~/src/authentication/Authorize';
import LandingPageContent from "~/src/theme/components/landingPage/LandingPageContent";
import Houses from "~/src/theme/components/houses/Houses";
import Heroes from "~/src/theme/components/heroes/Heroes";
import PrivacyPolicy from '~/src/theme/new_ui/PrivacyPolicy';
import TermsOfUse from '~/src/theme/new_ui/TermsOfUse';
import CharacterCreationFlow from "~/src/theme/components/characterCreation/CharacterCreationFlow";

import '~/src/theme/css/landingPage.css';
import '~/src/theme/css/materialize.css';
import '~/src/theme/css/materializeCommon.css';

//mailerlite subscribe
import Axios from 'axios';
import ConfigMain from '~/configs/main';
import SubscribeThanksModal from "~/src/theme/components/SubscribeThanksModal";
import EnterpriseModal from "~/src/theme/components/landingPage/EnterpriseModal";
import { Logo } from './Logo';
import { Footer } from './Footer';
import { MobileMenu } from './MobileMenu';

const validateEmail = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

//this one is for desktop only, for mobile, there is simple input element
const EmailInput = ({ onEmailInputHide, onEmailInputSubmit, onEmailInput, email }) => {
  const handleInputSubmit = (event) => {
    event.preventDefault();
    if (validateEmail(email)) {
      onEmailInputSubmit(email);
    }
  }

  return (
    <span>
      <span className="landing-email-input-textfield-container">
        <input value={email}
          onChange={onEmailInput}
          onKeyPress={(event) => {
            if (event.key === 'Enter') {
              handleInputSubmit(event)
            }
          }}
          type="email" placeholder="email@example.com" autoFocus={true} />
      </span>,
    <button type="submit" onClick={handleInputSubmit}><p>Send</p></button>
    </span>
  )
}

const Header = ({ openMenu, openSignUpForm, onMoreMenuToggle, isMoreMenuVisible, onEmailInputShow, onEmailInputHide, onEmailInputSubmit, onEmailInput, isEmailInputVisible, email, changePageLanguage, onEnterpriseModalShow }) => {
  return (
    <div className="header">
      <button className="burger" onClick={openMenu}>
        <span> </span>
        <span> </span>
        <span> </span>
      </button>
      <button type="button">
        <p>The Game</p>
      </button>
      <button type="button">
        <p>Forums</p>
      </button>
      <button type="button">
        <p>Markets</p>
      </button>
      {
        process.env.SOQQLE_ENV !== 'production' &&
        (
          !isEmailInputVisible ?
          <div className="right-new-link">
            <a className="dd-new-right" onClick={onMoreMenuToggle}>More <i className="fa fa-angle-down"></i></a>
            {
              isMoreMenuVisible &&
              <ul className="right-dropdown-link">
                <li><a onClick={onEnterpriseModalShow}>Enterprise</a></li>
                <li><a onClick={onEmailInputShow}>Subscribe</a></li>
                <li>
                  <a onClick={()=>changePageLanguage('en')}>en</a>
                  <b>|</b>
                  <a onClick={()=>changePageLanguage('ko')}>ko</a>
                  <b>|</b>
                  <a onClick={()=>changePageLanguage('vi')}>vi</a>
                </li>
                <li>
                  <a onClick={()=>changePageLanguage('th')}>th</a>
                  <b>|</b>
                  <a onClick={()=>changePageLanguage('cn')}>cn</a>
                </li>
              </ul>
            }
          </div>
          :
          <EmailInput onEmailInputHide={onEmailInputHide} onEmailInputSubmit={onEmailInputSubmit} onEmailInput={onEmailInput} email={email} />
        )
      }

      {
        process.env.SOQQLE_ENV !== 'production' &&
        <button type="button" className="sign-up-button right-new-signup" onClick={() => openSignUpForm()}>
          <p>Sign in</p>
        </button>
      }
    </div>
  );
};

class LandingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      isMoreMenuVisible: false,
      isEmailInputVisible: false,
      email: "",
      isSubscriptionModalVisible: false,
      isEnterpriseModalVisible: false
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  //mailerlite subscribe
  handleEmailInputShow(show) {
    this.setState({ isEmailInputVisible: show });
  }

  handleMoreMenuToggle() {
    this.setState({ isMoreMenuVisible: !this.state.isMoreMenuVisible });
  }

  handleEmailInputSubmit(value) {
    if (value) {
      const body = { groupId: 9716454, name: "n/a", email: value };
      mixpanel.track('Sign Up Beta - submit')
      Axios.post(`${ConfigMain.getBackendURL()}/addSubscriberToGroup`, body)
        .then((response) => {
        })
        .catch(error => {
        });
      this.setState({ email: "", isEmailInputVisible: false, isSubscriptionModalVisible: true });
    }
  }

  handleEmailInput(event) {
    this.setState({ email: event.target.value });
  }

  handleCloseSubscribeThankYouModal() {
    this.setState({ isSubscriptionModalVisible: false });
  }

  handleEnterpriseModalShow(show) {
    this.setState({ isEnterpriseModalVisible: show });
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
        <Route exact path='/' render={routeProps => <LandingPageContent {...routeProps}{...this.props}/>}/>
        <Route path='/authorize' render={routeProps => <Authorize {...routeProps}{...this.props}/>}/>
        <Route exact path='/houses' render={routeProps => <Houses {...routeProps}{...this.props}/>}/>
        <Route exact path='/heroes' render={routeProps => <Heroes {...routeProps}{...this.props}/>}/>
        <Route exact path="/privacyPolicy" render={routeProps => <PrivacyPolicy {...routeProps} {...this.props} />}/>
        <Route exact path="/termsOfUse" render={routeProps => <TermsOfUse {...routeProps} {...this.props} />}/>
        <Route exact path='/characterCreation' render={routeProps => <CharacterCreationFlow {...routeProps}{...this.props}/>}/>
        <Route path="*" render={routeProps => <LandingPageContent {...routeProps}{...this.props}/>}/>
      </Switch>
    );
  }

  componentWillMount() {
    mixpanel.track("Enter Landing");
  }

  render() {
    return (
      <div className="landing-page-wrapper landing-page-container">
        {this.renderSignUpForm()}
        <header>
          <EnterpriseModal isVisible={this.state.isEnterpriseModalVisible}
            onEnterpriseModalHide={() => this.handleEnterpriseModalShow(false)} />
          <SubscribeThanksModal isVisible={this.state.isSubscriptionModalVisible}
            closeSubscribeThankYouModal={() => this.handleCloseSubscribeThankYouModal()} />
          <Logo />
          <Header
            openMenu={this.toggle}
            openSignUpForm={this.props.openSignUpForm}
            onMoreMenuToggle={() => this.handleMoreMenuToggle()}
            isMoreMenuVisible={this.state.isMoreMenuVisible}
            onEmailInputShow={() => this.handleEmailInputShow(true)}
            onEmailInputHide={() => this.handleEmailInputShow(false)}
            onEmailInputSubmit={(value) => { this.handleEmailInputSubmit(value) }}
            onEmailInput={(event) => { this.handleEmailInput(event) }}
            isEmailInputVisible={this.state.isEmailInputVisible}
            email={this.state.email}
            changePageLanguage={this.props.changePageLanguage}
            onEnterpriseModalShow={() => this.handleEnterpriseModalShow(true)}
          />
        </header>
        {this.renderRoutes() /*This is temporary - remove it!!!!!!!!*/}
        <Footer localeData={this.props.localeData} currentLanguage={this.props.currentLanguage}/>
        <MobileMenu
          isOpen={this.state.isOpen} closeMenu={this.toggle}
          onMoreMenuToggle={() => this.handleMoreMenuToggle()}
          isMoreMenuVisible={this.state.isMoreMenuVisible}
          onEmailInputShow={() => this.handleEmailInputShow(true)}
          onEmailInputHide={() => this.handleEmailInputShow(false)}
          onEmailInputSubmit={(event) => { this.handleEmailInputSubmit(event) }}
          onEmailInput={(event) => { this.handleEmailInput(event) }}
          isEmailInputVisible={this.state.isEmailInputVisible}
          email={this.state.email}
          changePageLanguage={this.props.changePageLanguage}
          onEnterpriseModalShow={() => this.handleEnterpriseModalShow(true)}
        />
      </div>
    );
  }
}

LandingPage.propTypes = {
  isAuthorized: PropTypes.bool.isRequired,
  isSignUpFormOpen: PropTypes.bool.isRequired,
  startCharacterCreation: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  openSignUpForm: bindActionCreators(openSignUpForm, dispatch),
  startCharacterCreation: bindActionCreators(startCharacterCreation, dispatch),
  changePageLanguage: bindActionCreators(changePageLanguage, dispatch)
});

const mapStateToProps = state => ({
  isAuthorized: state.userProfile.isAuthorized,
  localeData: state.userProfile.locale,
  currentLanguage: state.userProfile.locale.selectedLanguage || 'en'
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withCookies(LandingPage));
