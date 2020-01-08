import React, { Component } from 'react';
import Moment from 'moment';
import Axios from 'axios';
import nl2br from 'nl2br';

import Spinner from '~/src/theme/components/homepage/Spinner';
import LinkPreview from '~/src/theme/components/homepage/LinkPreview';
import ConfigMain from '~/configs/main';

const profilePic = 'https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/userProfile/default-profile.png';

const PostHeader = ({ author, authorName, date, userProfile }) => {
  const { _id: userId, pictureURL, firstName, lastName } = userProfile;
  const userPictureUrl = (author === userId && pictureURL) ? pictureURL : profilePic;
  const newAuthorName = (author === userId) ? firstName + " " + lastName : authorName;

  return (
    <div className="top-head">
      <div className="profile-icon">
       <img src={userPictureUrl} alt="" />
      </div>
      <span className="col-heading">{newAuthorName}</span>
      <span className="date">{Moment(date).format('DD.MM.YYYY')}</span>
     </div>
  )
}

const CommentBox = () => (
  <div className="input-wp">
    <div className="input-filed">
      <input type="text" name="" placeholder="Write comment..." />
      <a href="#" className="camera-icon"><i className="fa fa-camera"></i></a>
    </div>
    <div className="bot-share-btns">
      <ul>
        <li><a href="#"><div className="icon-white text-blue"><i className="fa fa-share"></i></div></a></li>
        <li><a href="#"><div className="icon-white icon-blue"><i className="fa fa-thumbs-up"></i></div></a></li>
      </ul>
    </div>
  </div>
);

const Reaction = () => (
  <div className="likewp">
    <div className="thum-like">
      <i className="fa fa-thumbs-up" aria-hidden="true"></i>
    </div>
    <span>Anna +23 others</span>
    <span className="comments-txt">4 comments</span>
  </div>
);

const PostFooter = () => (
  <div className="bot-wp">
    <Reaction />
    <CommentBox />
  </div>
);

export default class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetchMetaLoading: false,
      linkMeta: {},
    };
  }

  componentDidMount() {
    const { isContainUrl, url } = this.props;
    if (isContainUrl) this.fetchLinkMeta(url);
  }

  fetchLinkMeta(link) {
    this.setState({ isFetchMetaLoading: true });
    const linkMetaScraperEndpoint = `${ConfigMain.getLinkScraperServiceURL()}?url=${link}`;

    Axios.get(linkMetaScraperEndpoint)
      .then(({ data }) => {
        if (data.result.status == 'OK') {
          this.setState({ 
            linkMeta: data.meta, 
            isFetchMetaLoading: false 
          });
        }
      })
      .catch(error => this.setState({ isFetchMetaLoading: false }));
  }

  linkSnippet() {
    const { isContainUrl } = this.props;
    return isContainUrl ? 
      <LinkPreview 
        isLoading={this.state.isFetchMetaLoading}
        meta={this.state.linkMeta}
        loader={<Spinner shown={this.state.isFetchMetaLoading} />}
      /> : '';
  }

  render() {
    const { userProfile } = this.props;
    const { author, authorName, date, message } = this.props.data;
  
    return (
      <div className="col-box-wp">
        <div className="main-comment-box">
          <PostHeader author={author} authorName={authorName} date={date} userProfile={userProfile} />
          <p dangerouslySetInnerHTML={{ __html: nl2br(message) }} />
          { this.linkSnippet() }
          <PostFooter />
        </div>
      </div>
    );
  }
}
