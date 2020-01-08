import React from 'react';
import Axios from 'axios';

import Message from './Message';
import ConfigMain from '../../../configs/main';
import { Icon } from 'react-fa';

class Messages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoadingMore: false,
      hasMorePreviousMessage: true,
    };
  }

  componentDidUpdate() {
    // There is a new message in the state, scroll to bottom of list
    const objDiv = document.getElementById('messageList');
    if (this.state.isLoadingMore) {
      objDiv.scrollTop = objDiv.scrollHeight - (this.state.previousHeight + 300);
    } else {
      objDiv.scrollTop = objDiv.scrollHeight - 300;
    }
  }

  componentDidMount() {
    document.getElementById('messageList').addEventListener('scroll', this.handleScroll.bind(this));
  }

  componentWillUnmount() {
    this.state.isLoadingMore = false;
    document.getElementById('messageList').removeEventListener('scroll', this.handleScroll.bind(this));
  }

  handleScroll(event) {
    let scrollTop = document.getElementById('messageList').scrollTop;
    if (scrollTop < 1 && this.state.isLoadingMore === false && this.state.hasMorePreviousMessage) {
      const url = `${ConfigMain.getBackendURL()}/fetchConversationByParticipants?ids=${this.props.sender};${
        this.props.receiver
      }&skip=${this.props.messages.length}`;
      self = this;
      this.state.isLoadingMore = true;
      this.state.previousHeight = document.getElementById('messageList').scrollHeight;
      Axios.get(url).then(function(response) {
        if (response.data.length) {
          for (var message of response.data) {
            message.username = message.sender;
            message.receiver = self.props.receiver;
            message.fromMe = message.sender === self.props.sender;
            message.unshift = true;
            self.props.addMessage(message);
          }
        } else {
          self.state.hasMorePreviousMessage = false;
        }
        self.state.isLoadingMore = false;
      });
    }
  }

  render() {
    // Loop through all the messages in the state and create a Message component
    const messages = this.props.messages.map((message, i) => {
      return (
        <Message
          key={i}
          username={message.username}
          message={message.message}
          time={message.time}
          fromMe={message.fromMe}
        />
      );
    });

    return (
      <div id="messageList" className="messageList">
        {messages}
        <br className="clear" />
      </div>
    );
  }
}

Messages.defaultProps = {
  messages: [],
};

export default Messages;
