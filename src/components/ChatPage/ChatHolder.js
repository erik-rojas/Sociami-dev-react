require('~/src/css/ChatHolder.css');
import React,{Component} from 'react';

import ChatHeader from './ChatHeader';
import ChatLeftSideHolder from './ChatLeftSideHolder';
import ChatRightSideHolder from './ChatRightSideHolder';

class ChatHolder extends Component {
  render(){
    return(
      <div className={`chat-holder ${this.props.isChatHolder ? 'active-modal' : ''}`}>
        <div className="chat-container">
          <ChatHeader
            toggleChatHolder={this.props.toggleChatHolder}
          />
          <div className="chat-content-holder">
            <ChatLeftSideHolder/>
            <ChatRightSideHolder/>
          </div>
        </div>
      </div>
    )
  }
}
export default ChatHolder;
