import React from 'react';
import { Modal } from 'react-bootstrap';

const EnterpriseModal = (props) => {
  return (
    <Modal show={props.isVisible} onHide={() => props.onEnterpriseModalHide()} className="top-popup">
      <Modal.Header closeButton>
        <Modal.Title>here how others use Soqqle</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ul>
          <li>
            <a href="http://enterprise.soqqle.com/gaming" target="_blank">
              <div className="img-icon"><img src="https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/landingPage/popup-icon1.png" alt="" /></div>
              <h4>Gaming</h4>
            </a>
          </li>
          <li>
            <a href="http://enterprise.soqqle.com/edu" target="_blank">
              <div className="img-icon"><img src="https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/landingPage/popup-icon2.png" alt="" /></div>
              <h4>Education</h4>
            </a>
          </li>
          <li>
            <a href="http://enterprise.soqqle.com/hr" target="_blank">
              <div className="img-icon"><img src="https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/landingPage/popup-icon3.png" alt="" /></div>
              <h4>Human Resource</h4>
            </a>
          </li>
          <li>
            <a href="http://enterprise.soqqle.com/community" target="_blank">
              <div className="img-icon"><img src="https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/landingPage/popup-icon4.png" alt="" /></div>
              <h4>Community Plug In</h4>
            </a>
          </li>
          <li>
            <a href="http://enterprise.soqqle.com/other" target="_blank">
              <div className="img-icon"><img src="https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/landingPage/popup-icon5.png" alt="" /></div>
              <h4>Others Opportunities</h4>
            </a>
          </li>
        </ul>
      </Modal.Body>
    </Modal>
  );
}

module.exports = EnterpriseModal;
