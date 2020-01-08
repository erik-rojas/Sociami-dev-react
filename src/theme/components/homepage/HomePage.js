/*
  author: Anshul Kumar
*/

import React, { Component } from 'react';
import Axios from 'axios';
import Textarea from 'react-textarea-autosize';
import ConfigMain from '~/configs/main';

import LeftNav from '~/src/theme/components/homepage/LeftNav';
import RightSection from '~/src/theme/components/homepage/RightSection';
import PostList from '~/src/theme/components/homepage/PostList';
import LinkPreview from '~/src/theme/components/homepage/LinkPreview';
import Spinner from '~/src/theme/components/homepage/Spinner';
import { findUrlInText, isSameLink } from '~/src/utils/UrlUtils';
import '~/src/theme/css/darkTheme.css';
import '~/src/theme/css/lightTheme.css';
import '~/src/css/bootstrap-workaround.css';

const profilePic = 'https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/userProfile/default-profile.png';

const FIX_MOBILE_MARGIN_8959 = 'fix-mobile-margin-8959';

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.defaultPostLinkData = {
      isPreviewLoading: false,
      meta: {},
    };

    this.state = {
      posts: [],
      loadingPosts: true,
      postLink: this.defaultPostLinkData
    };

    this.createPost = this.createPost.bind(this);
    this.createCompnayPost = this.createCompnayPost.bind(this);
    this.createHousePost = this.createHousePost.bind(this);
    this.handleCreatePost = this.handleCreatePost.bind(this);
    this.fetchPosts = this.fetchPosts.bind(this);
    this.detectPostType = this.detectPostType.bind(this);
    this.postInput = null;
    this.setPostInputRef = element => {
      this.postInput = element;
    };
  }

  createHousePost() {
    this.handleCreatePost(this.props.houses.houses[0]._id, this.props.houses.houses[0].name);
  }

  createCompnayPost() {
    this.handleCreatePost(this.props.company._id, this.props.company.name);
  }

  createPost() {
    this.handleCreatePost(this.props.userProfile._id, `${this.props.userProfile.firstName} ${this.props.userProfile.lastName}`);
  }

  handleCreatePost(id, name) {
    const that = this;
    const postData = {
      message: this.postInput.value, 
      userName: name
    };
    this.setState({isWritingPost: false});
    Axios.post(`${ConfigMain.getBackendURL()}/${id}/posts`, postData)
      .then((response) => {
        this.postInput.value = '';
        this.clearLinkPreview();
        that.fetchPosts();
      })
      .catch((error) => {
        console.log(error);
        this.setState({isWritingPost: true});
      });
  }

  fetchPosts() {
    const feedsEndoint = `${ConfigMain.getBackendURL()}/${this.props.userProfile._id}/feeds`;

    this.setState({ loadingPosts: true });
    Axios.get(feedsEndoint)
      .then(response => 
        this.setState({ posts: response.data, loadingPosts: false }))
      .catch(error => {});
  }

  clearLinkPreview() {
    this.setState({ postLink: this.defaultPostLinkData });
  }

  detectPostType(event) {
    const text = event.target.value;
    const foundUrlResult = findUrlInText(text);
    const currentMeta = this.state.postLink.meta;

    
    if (foundUrlResult.hasUrl && typeof currentMeta !== 'undefined') {
      const hrefLink = foundUrlResult.firstUrl;
      const currentMetaLink = currentMeta.url;
      if (!currentMetaLink || !isSameLink(currentMetaLink, hrefLink)) {
        this.fetchLink(hrefLink);
      }

      return;
    }

    this.setState({ postLink: this.defaultPostLinkData });
  }

  fetchLink(link) {
    const linkMetaScraperEndpoint = `${ConfigMain.getLinkScraperServiceURL()}?url=${link}`;

    this.loadingLinkPreview(true);
    Axios.get(linkMetaScraperEndpoint)
      .then(({ data }) => {
        if (data.result.status == 'OK') {
          this.showLinkPreview(data.meta);
        } else {
          this.loadingLinkPreview(false)
        }
      })
      .catch(error => this.loadingLinkPreview(false));
  }

  loadingLinkPreview(isPreviewLoading) {
    const postLink = { 
      ...this.state.postLink, 
      isPreviewLoading
    };

    this.setState({ postLink });
  }

  showLinkPreview(meta) {
    const currentPostLinkState = { 
      isPreviewLoading: false,
      meta,
    };

    this.setState({ postLink: currentPostLinkState });
  }

  componentDidMount() {
    this.fetchPosts();
  }

  render() {
    const isFetchingPostLoading = this.state.loadingPosts;
    return (
      <div className={`${this.props.userProfile.theme.toLowerCase()}-theme-wrapper profile-wrapper main-bg`}>
        <div className="row">
          <div className="container">
            <div className="row">
              <div className={`row ${FIX_MOBILE_MARGIN_8959}`}>
                
                <LeftNav 
                  accounting={this.props.accounting}
                  userProfile={this.props.userProfile} 
                  profilePic={this.props.userProfile.pictureURL ? this.props.userProfile.pictureURL : profilePic} 
                />

                <RightSection
                  skills={this.props.skills}
                  roadmapsAdmin={this.props.roadmapsAdmin}
                  userProfile={this.props.userProfile}
                />

                <div className="col-middle ml-fixed">
                  <div className="top-box-wp" onFocus={() => this.setState({isWritingPost: true})}>

                    <div className="profile-icon">
                      <img src={this.props.userProfile.pictureURL ? this.props.userProfile.pictureURL : profilePic} alt="" />
                    </div>

                    <Textarea
                      name="" 
                      onChange={this.detectPostType} 
                      inputRef={this.setPostInputRef} 
                      placeholder="What do you want to say..." 
                    />
                    <div style={{marginTop: '15px'}}>
                      <ul style={{paddingLeft: '20px'}}>
                        <li style={{display: 'inline-block', listStyle: 'none'}}>
                          <a href="#">
                            <i style={{color: 'rgb(150, 1, 163)', fontSize: '16px'}} className="fa fa-camera"></i>
                          </a>
                        </li>
                        <li style={{display: 'inline-block', listStyle: 'none', paddingLeft: '20px'}}>
                          <a href="#">
                            <i style={{color: 'rgb(150, 1, 163)', fontSize: '16px'}} className="fa fa-video-camera"></i>
                          </a>
                        </li>
                      </ul>
                    </div>
                    <LinkPreview
                      isLoading={this.state.postLink.isPreviewLoading}
                      meta={this.state.postLink.meta}
                      loader={<Spinner shown={this.state.postLink.isPreviewLoading} />}
                    />
                    { this.state.isWritingPost &&
                    <div className="buttons-wp">
                      <ul>
                        { _.get(this.props.houses, 'houses.length', 0) > 0 && <li>
                          <a href="#">
                            <div className="icon-white" onClick={this.createHousePost}>
                              <i style={{color: '#9601a3', fontSize: '20px'}} className="fa fa-home"></i>
                            </div>
                          </a>
                        </li> }
                        { this.props.isAdmin && <li>
                          <a href="#">
                            <div className="icon-white" onClick={this.createCompnayPost}>
                              <i style={{color: '#9601a3', fontSize: '16px'}} className="fa fa-building"></i>
                            </div>
                          </a>
                        </li> }
                        <li><a href="#"><div className="icon-white icon-purpal" onClick={this.createPost}><i className="fa fa-paper-plane"></i></div></a></li>
                      </ul>
                    </div>
                    }
                  </div>
              
                  <PostList 
                    isLoading={isFetchingPostLoading} 
                    posts={this.state.posts}
                    userProfile={this.props.userProfile}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default HomePage;
