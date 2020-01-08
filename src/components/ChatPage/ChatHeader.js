import React,{Component} from 'react';

class ChatHeader extends Component {


  render(){
    return(
      <div className="chat-header">
        <div className="chat-header-menu">
          <ul className="tab-wp">
            <li className="active">
              <a>General</a>
            </li>
            <li>
              <a>Friends</a>
            </li>
            <li>
              <a>Spaces</a>
            </li>
          </ul>
        </div>
        <div className="chat-header-action">
          <ul>
            <li onClick={()=>this.props.toggleChatHolder()}>
              <a className="fa fa-times"></a>
            </li>
            <li>
              <a className="fa fa-angle-double-down"></a>
            </li>
          </ul>
        </div>
      </div>
    )
  }
}
export default ChatHeader;
