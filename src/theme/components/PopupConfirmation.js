import React from 'react';
import Modal from 'react-modal';
import '~/src/css/PopupLatestTask.css';

class PopupConfirmation extends React.Component {
  constructor(props) {
    super(props);

    this.modalDefaultStyles = {};
  }
  render() {
    return (
      <div className="container-fluid popup-new-project">
        <div className="row">
          <div className="col-lg-12">
            <p>Withdrawing will remove this item from the task manager.</p>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <p>
              This item is currently with "{this.props.assigneeName}", who will receive a notification of the
              withdraw
            </p>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <p>Are you sure?</p>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <button
              type="button"
              className="btn btn-lg btn-outline-inverse"
              onClick={() => this.props.onConfirmationPopupClose(true)}
            >
              Yes
            </button>
            <button
              type="button"
              className="btn btn-lg btn-outline-inverse"
              onClick={() => this.props.onConfirmationPopupClose(false)}
            >
              No
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default require('react-click-outside')(PopupConfirmation);
