/*
  author: Anshul Kumar
*/

import React, { Component } from 'react';
import Modal from 'react-modal';

import PropTypes from 'prop-types';
import ActionLink from '~/src/components/common/ActionLink';

import '~/src/theme/css/achievement.css';

class Achievement extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { isOpen, close, achievementDetails } = this.props;
    const modalStyleOverrides = {
      overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      content: {
        border: 'none',
        position: 'relative',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      },
    };
    return (
      <Modal isOpen={isOpen} style={modalStyleOverrides} onRequestClose={close}>
        <div className="achievement-modal modal-popup">
          <div className="achievement-container">
            <div className="achievement-wrapper">
              <div className="center-wrapper">
                <ActionLink href="#" className="modal-close-button" onClick={close} />
                <div className="content-wp">
                  <h6 className="yellow-text">{achievementDetails.displayProgressVsComplete}</h6>
                  <h4>{achievementDetails.displayName}</h4>
                  <p>
                    The Innovator quickly flies into action and arrives at the signal. The Chief of Police is
                    there and tells him that the nefarious Shadow Professor has struck again
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

Achievement.propTypes = {};

export default Achievement;
