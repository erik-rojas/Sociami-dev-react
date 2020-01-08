import React from 'react';

import { Button, Modal } from 'react-bootstrap';

const soqqleEnv = process.env.SOQQLE_ENV;

const ThankYouModal = (props) => {
    return (
        <Modal show={props.isVisible} onHide={() => props.closeSubscribeThankYouModal()} className="modal-thank-you-subscribtion">
            <Modal.Header closeButton>
              { soqqleEnv === 'production' ?
                <Modal.Title>Your Beta Application</Modal.Title>
                :
                <Modal.Title>Subscribe</Modal.Title>
              }
            </Modal.Header>
            <Modal.Body>
              { soqqleEnv === 'production' ?
                <h5>Your email: {props.email} has been registered for beta and you will receive a confirmation</h5>
                :
                <h5>Thank You for Subscribing!</h5>
              }
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={() => props.closeSubscribeThankYouModal()} autoFocus={true}>OK</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ThankYouModal;