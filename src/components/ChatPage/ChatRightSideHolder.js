import React from 'react';

import ChatBottomMessage from './ChatBottomMessage';
import ChatMessageHolder from './ChatMessageHolder';

const ChatRightSideHolder = () => {
  return(
    <div className="chat-ChatRightSideHolder">
      <div className="right-header">
        <div className="search-box">
          <i className="fa fa-search"/>
          <input
            placeholder="Search for people, chats, message"
          />
        </div>
        <div className="icon-bar">
          <ul>
            <li>
              <div className="icon-holder">
                <a className="fa fa-at"/>
              </div>
              <div>MENTION</div>
            </li>
            <li>
              <div className="icon-holder mini-size">
                <a className="fa fa-users"/>
              </div>
              <div>COMMUNITY</div>
            </li>
            <li>
              <div className="icon-holder mini-size">
                <a className="fa fa-envelope-o"/>
              </div>
              <div>INBOX</div>
            </li>
            <li>
              <div className="icon-holder mini-size">
                <a className="fa fa-align-right"/>
              </div>
              <div>NEWS</div>
            </li>
            <li>
              <div className="icon-holder">
                <a className="fa fa-cog"/>
              </div>
              <div>SETTINGS</div>
            </li>
          </ul>
        </div>
      </div>
      <ChatMessageHolder/>
      <ChatBottomMessage/>
    </div>
  )
}
export default ChatRightSideHolder;
