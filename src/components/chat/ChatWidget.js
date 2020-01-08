import React from 'react';
import ChatUsers from './ChatUsers';

class ChatWidget extends React.Component {
  render() {
    const profilePic =
      'https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/userProfile/default-profile.png';
    return (
      <div className={this.props.chatPanelClass}>
        <div className="chat-panel-header">
          <div className="widget-user-image">
            <img
              className="img-circle"
              src={this.props.userProfile.pictureURL ? this.props.userProfile.pictureURL : profilePic}
              alt="User Avatar"
            />
          </div>

          <span
            className="fa fa-times pull-right"
            style={{ cursor: 'pointer' }}
            onClick={() => this.props.toggleChatWidgetButton()}
          />

          <h3 className="widget-user-username">
            {this.props.userProfile.firstName} {this.props.userProfile.lastName} &nbsp;
          </h3>
          <h5 className="widget-user-desc">&nbsp;</h5>
        </div>
        <div className="chat-widget-footer text-center row">
          <div className="col-xs-4 chat-stat-grid border-right">
            <h3 className="widget-footer-num">0</h3>
            <h5 className="widget-footer-desc">Connections</h5>
          </div>
          <div className="col-xs-4 chat-stat-grid border-right">
            <h3 className="widget-footer-num">0</h3>
            <h5 className="widget-footer-desc">Messages</h5>
          </div>
          <div className="col-xs-4 chat-stat-grid">
            <h3 className="widget-footer-num">0</h3>
            <h5 className="widget-footer-desc">Supports</h5>
          </div>
        </div>
        <div className="chat-panel-body row">
          <div className="col-xs-3 chat-widget-tab-menu">
            <div className="list-group">
              <a href="#" className="list-group-item text-center">
                <h4 className="fa fa-2x fa-question-circle" />
                <br />
              </a>
              <a href="#" className="list-group-item active text-center">
                <h4 className="fa fa-2x fa-comments" />
                <br />
              </a>
              <a href="#" className="list-group-item text-center">
                <h4 className="fa fa-2x fa-users" />
                <br />
              </a>
            </div>
          </div>
          <div className="col-xs-9 chat-widget-tab">
            <div className="chat-widget-tab-content">IPSUM LOREM</div>

            <ChatUsers
              users={this.props.users}
              selectedUser={this.props.selectedUser}
              selectedUserFullName={this.props.selectedUserFullName}
              lastMessageRec={this.props.lastMessageRec}
              lastMessages={this.props.lastMessages}
              unreadCount={this.props.unreadCount}
              onTab={this.props.onTab}
              checkUserWin={this.props.checkUserWin}
              tabClose={this.props.tabClose}
              openWindow={this.props.openWindow}
            />

            <div className="chat-widget-tab-content">LOREM IPSUM</div>
          </div>
        </div>
      </div>
    );
  }
}

export default ChatWidget;
