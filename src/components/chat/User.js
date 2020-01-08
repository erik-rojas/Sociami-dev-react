import React from 'react';
import TimeAgo from 'react-timeago';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';

class User extends React.Component {
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
      ? 'messageCountContainerHide'
      : this.props.unreadCount[this.props.userID] == 0
        ? 'messageCountContainerHide'
        : 'messageCountContainerShow';
    const messageCountContainerClasses = `messageCountContainer ${tempClasses}`;
    const tabClass =
      String(this.props.userID) === String(this.props.selectedUser) ? 'personSelected' : 'person';
    const classes = `${tabClass}`;
    var fullname = this.props.firstName + ' ' + this.props.lastName;
    var imgSrc = '';

    var showLastMessage = this.props.lastMessage;
    if (this.props.lastMessage.indexOf('<img') >= 0) {
      showLastMessage = 'image';
    }

    const statusImgSrc =
      this.props.loggedinStatus == true || this.props.userType == 'chatbot'
        ? 'http://s3.amazonaws.com/gs.apps.icons/B_Bpusg8EeKT7hIxPR901Q_%2Fgreen+dot.png'
        : 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Location_dot_grey.svg/2000px-Location_dot_grey.svg.png';
    if (this.props.userType == 'facebook') {
      imgSrc = 'http://graph.facebook.com/' + this.props.username + '/picture?type=square';
    } else if (this.props.userType == 'linkedin') {
      imgSrc = 'https://s3.amazonaws.com/FringeBucket/default-user.png';
    } else if (this.props.userType == 'chatbot') {
      imgSrc = 'http://blog.newrelic.com/wp-content/uploads/chatbot-300x300.jpg';
    }

    var unreadCountTag = '';
    if (this.props.unreadCount[this.props.userID]) {
      unreadCountTag = String(this.props.unreadCount[this.props.userID]);
    }
    return (
      <div
        data-id={`${this.props.tabKey}`}
        className={classes}
        onClick={event => this.onItemClick(event)}
        id={`${this.props.userID}`}
        data-user={`${fullname}`}
      >
        <img src={imgSrc} alt="" className="profilePic" />
        <span className="name">
          {fullname} <img src={statusImgSrc} className="statusDot" />
        </span>
        <span className="time">
          <TimeAgo date={this.props.lastMessageTimeStamp} minPeriod={60} />
        </span>
        <span className="preview">{ReactHtmlParser(showLastMessage)}</span>
        <div className={messageCountContainerClasses}>
          <span className="messageCount">{unreadCountTag}</span>
        </div>
      </div>
    );
  }
}

User.defaultProps = {
  tabKey: '',
  username: '',
};

export default User;
