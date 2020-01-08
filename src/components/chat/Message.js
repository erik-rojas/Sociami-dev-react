import React from 'react';
import TimeAgo from 'react-timeago';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';

class Message extends React.Component {
  render() {
    // Was the message sent by the current user. If so, add a css class
    const fromMe = this.props.fromMe ? 'me' : 'you';
    const timeStampClass = this.props.fromMe ? 'timeStampMe' : 'timeStampYou';
    return (
      <div>
        <div className={`bubble ${fromMe}`}>{ReactHtmlParser(this.props.message)}</div>
        <div className={`${timeStampClass}`}>
          <TimeAgo date={this.props.time} minPeriod={60} />
        </div>
      </div>
    );
  }
}

Message.defaultProps = {
  message: '',
  username: '',
  fromMe: false,
};

export default Message;
