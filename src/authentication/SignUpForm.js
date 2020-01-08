import React from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';

import Registration from './Registration';

import '~/src/css/signUpFormPopup.css';

class SignupForm extends React.Component {
  constructor(props) {
    super(props);

    this.modalDefaultStyles = {};
  }

  //TODO: Elaborate more robust force-signup mechanism. Probably, get rid of popup in favor of /login route
  isSignupRequired() {
    return this.props.pathname == '/projectManagement' && !this.props.isAuthorized;
  }

  componentWillMount() {
    if (this.props.isAuthorized) {
      this.props.onCloseModal();
    }

    this.modalDefaultStyles = Modal.defaultStyles;

    Modal.defaultStyles.content.background = 'black';
    Modal.defaultStyles.content.overflow = 'hidden';
    Modal.defaultStyles.content['color'] = 'white';
    Modal.defaultStyles.content['marginLeft'] = '0 auto';
    Modal.defaultStyles.content['marginRight'] = 'auto';
    Modal.defaultStyles.content['minWidth'] = '260px';
    Modal.defaultStyles.content['maxWidth'] = '588px';
    Modal.defaultStyles.content['height'] = '213px';
    Modal.defaultStyles.content['boxShadow'] = 'none';
  }

  componentWillUnmount() {
    Modal.defaultStyles = this.modalDefaultStyles;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.isAuthorized != this.props.isAuthorized) {
      if (this.props.isAuthorized) {
        this.props.onCloseModal();
      }
    }
  }

  renderForm() {
    return (
      <Modal className="popup-signup-form"
        isOpen={this.props.modalIsOpen}
        onRequestClose={() => this.handleRequestClose()}
        contentLabel="Login Form"
        style={{
          content: {
            height: '500px',
          },
        }}
      >
        <div className="signup-form-header">
          Sign in
        </div>
        <div className="signup-box">
          <Registration />
        </div>
        <div className="singup-buttons">
          <div className="col-xs-6 no-padding">
            <button
              type="button"
              className="col-sm-6 btn signup-facebook-btn btn-lg btn-block"
              onClick={() => this.props.onHandleSignUpFacebook()}
            >
              <i className="fa fa-facebook" style={{marginRight: '10px'}}></i>
              Login with Facebook
            </button>
          </div>
          <div className="col-xs-6 no-padding">
            <button
              type="button"
              className="col-sm-6 btn signup-linkedin-btn btn-lg btn-block"
              onClick={() => this.props.onHandleSignUpLinkedIn()}
            >
            <i className="fa fa-linkedin" style={{marginRight: '10px'}}></i>
            Login with LinkedIn
            </button>
          </div>
          

        </div>
      </Modal>
    );
  }

  handleRequestClose() {
    if (!this.isSignupRequired()) {
      this.props.onCloseModal();
    }
  }

  render() {
    return <div>{this.renderForm()}</div>;
  }
}

SignupForm.propTypes = {
  isAuthorized: PropTypes.bool.isRequired,
  pathname: PropTypes.string.isRequired,
};

export default require('react-click-outside')(SignupForm);
