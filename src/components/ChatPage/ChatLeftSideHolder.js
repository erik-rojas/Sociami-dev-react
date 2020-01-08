import React,{Component} from 'react';

class ChatLeftSideHolder extends Component {
  render(){
    return(
      <div className="chat-ChatLeftSideHolder">
        <div className="top-header">
          <div className="icon">
            <img/>
          </div>
          <span className="header">Testing</span>
        </div>
        <div className="anonymous">
          ANONYMOUS
        </div>
        <div className="beautyTips">
          <div>
            Beauty tips
            <i className="fa fa-thumb-tack"></i>
          </div>
          <div className="gaming">Gaming</div>
        </div>
        <div className="worldChat">
          WORLD CHAT
        </div>
      </div>
    )
  }
}
export default ChatLeftSideHolder;
