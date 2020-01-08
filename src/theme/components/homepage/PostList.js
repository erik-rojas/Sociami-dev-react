import React, { Component } from 'react';
import Post from '~/src/theme/components/homepage/Post';
import Spinner from '~/src/theme/components/homepage/Spinner';
import { findUrlInText } from '~/src/utils/UrlUtils';

const NoPost = ({ condition }) => {
  const spanStyle = {
    color: 'gray', 
    fontSize: '16px', 
    textAlign: 'center', 
    width: '100%', 
    display: 'inline-block' 
  };

  if (!condition) return <div />;
  return <span style={spanStyle}>There are no posts! Start making friends!</span>;
};

export default class PostList extends Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.posts.length != this.props.posts.length) return true;
    if (nextProps.isLoading === this.props.isLoading) return false;
    return true;
  }


  render () {
    const { isLoading, posts, userProfile } = this.props;
    if (isLoading) return <Spinner shown />;
    if (posts.length === 0) return <NoPost condition={true} />; 
    
    const postList = posts.map( post => {
      const foundUrlResult = findUrlInText(post.message);
      const postProps = { key: post._id, data: post, userProfile };
      if (foundUrlResult.hasUrl) {
        postProps.isContainUrl = true;
        postProps.url = foundUrlResult.firstUrl;
      }

      return <Post {...postProps} />;
    });

    return <div>{ postList }</div>;
  }
}
