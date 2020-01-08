import React from 'react';

const ChatBottomMessage = () => {
  return(
    <div className="right-footer">
      <div className="input-holder">
        <input placeholder="Type a message"/>
      </div>
      <div className="chat-icons">
        <ul>
          <li>
            <a className="fa fa-link"></a>
          </li>
          <li>
            <a className="fa fa-picture-o"></a>
          </li>
          <li>
            <a className="fa fa-paperclip"></a>
          </li>
          <li>
            <a className="fa fa-smile-o"></a>
          </li>
          <li className="send-btn">
            <a className="fa fa-play"></a>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default ChatBottomMessage;
