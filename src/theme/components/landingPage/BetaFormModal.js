import React from 'react';

import { Button, Modal } from 'react-bootstrap';

const validateEmail = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

const handleInputSubmit = (event, email, onEmailInputSubmit) => {
  event.preventDefault();
  if (validateEmail(email)) {
    onEmailInputSubmit(email);
  }
}

const EmailInput = ({ onEmailInputSubmit, onEmailInput, email }) => {
  return (
    <span>
      <span className="landing-email-input-textfield-container">
        <input value={email}
          onChange={onEmailInput}
          onKeyPress={(event) => {
            if (event.key === 'Enter') {
              handleInputSubmit(event, email, onEmailInputSubmit)
            }
          }}
          type="email" placeholder="email@example.com" autoFocus={true} />
      </span>
    </span>
  )
}

const BetaFormModal = (props) => {

  return (
    <Modal show={props.isVisible} onHide={() => props.onBetaFormModalHide()} className="modal-thank-you-subscribtion">
      <Modal.Header closeButton>
        <Modal.Title>Enter your email address</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <EmailInput
          onEmailInput={props.onEmailInput}
          onEmailInputSubmit={props.onEmailInputSubmit}
          email={props.email}
        />
      </Modal.Body>
      <Modal.Footer>
          <Button onClick={() => props.onBetaFormModalHide()}>Cancel</Button>
          <Button onClick={(event)=> handleInputSubmit(event, props.email, props.onEmailInputSubmit)} >Send</Button>
      </Modal.Footer>
    </Modal>
  );
}

module.exports = BetaFormModal;
