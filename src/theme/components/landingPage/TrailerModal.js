import React from 'react';

import { Button, Modal } from 'react-bootstrap';
import YouTube from 'react-youtube';

const opts = {
  height: '390',
  width: '640',
  playerVars: { // https://developers.google.com/youtube/player_parameters
    autoplay: 1
  }
}

const _onReady = (event) => {
  event.target.pauseVideo();
}

const TrailerModal = (props) => {

  return (
    <Modal show={props.isVisible} onHide={() => props.onTrailerModalHide()} bsSize="lg" className="modal-thank-you-subscribtion">
      <Modal.Body>
        <YouTube
          videoId="GOzUtBZVIsc"
          opts={opts}
          // onReady={_onReady}
        />
      </Modal.Body>
    </Modal>
  );
}

module.exports = TrailerModal;
