import React from 'react';
import TimeAgo from 'react-timeago';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';

class ChatUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = { userSelected: '' };
  }

  onItemClick(event) {
    event.preventDefault();
    this.state.userSelected = event.currentTarget.id;
    this.props.onTab(event.currentTarget.id, event.currentTarget.dataset.user);
  }

  render() {
    const tempClasses = !this.props.unreadCount[this.props.userID]
      ? 'chatCountContainerHide'
      : this.props.unreadCount[this.props.userID] == 0
        ? 'chatCountContainerHide'
        : 'chatCountContainerShow';
    const messageCountContainerClasses = `chatCountContainer ${tempClasses}`;
    const tabClass =
      String(this.props.userID) === String(this.props.selectedUser) ? 'personSelected' : 'person';
    const classes = `${tabClass} box-comment`;
    var fullname = (this.props.firstName || '') + ' ' + (this.props.lastName || '');
    var imgSrc = '';
    var fallbackImageSrc =
      'https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/userProfile/default-profile.png';

    var showLastMessage = this.props.lastMessage;
    if (this.props.lastMessage.indexOf('<img') >= 0) {
      showLastMessage = 'image';
    }

    const statusImgSrc =
      this.props.loggedinStatus == true || this.props.userType == 'chatbot'
        ? 'http://s3.amazonaws.com/gs.apps.icons/B_Bpusg8EeKT7hIxPR901Q_%2Fgreen+dot.png'
        : 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Location_dot_grey.svg/2000px-Location_dot_grey.svg.png';
    if (this.props.userType == 'chatbot') {
      imgSrc = 'http://blog.newrelic.com/wp-content/uploads/chatbot-300x300.jpg';
    } else {
      imgSrc = this.props.profilePic;
    }

    var unreadCountTag = '';
    if (this.props.unreadCount[this.props.userID]) {
      unreadCountTag = String(this.props.unreadCount[this.props.userID]);
    }
    return (
      <div
        data-id={`${this.props.tabKey}`}
        className="box-comment"
        style={{ cursor: 'pointer' }}
        onClick={event => this.onItemClick(event)}
        id={`${this.props.userID}`}
        data-user={`${fullname}`}
      >
        <img
          className="img-circle img-sm"
          src={imgSrc}
          onError={e => {
            e.target.src = fallbackImageSrc;
          }}
          alt="User Image"
        />

        <div className="comment-text">
          <span className="username">
            {fullname}
            <span className="text-muted pull-right">
              <i className="fa fa-clock-o" />{' '}
              <TimeAgo date={this.props.lastMessageTimeStamp} minPeriod={60} />
            </span>
          </span>
          <div className="chat-text">
            {ReactHtmlParser(showLastMessage)}
            <div className={messageCountContainerClasses}>
              <span className="messageCount">{unreadCountTag}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ChatUser.defaultProps = {
  tabKey: '',
  username: '',
};

export default ChatUser;
