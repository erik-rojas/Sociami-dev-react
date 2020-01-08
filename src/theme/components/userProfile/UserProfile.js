/*
  author: Anshul Kumar
*/

import React, { Component } from 'react';
import { Popover, OverlayTrigger } from 'react-bootstrap';
import { Icon } from 'react-fa';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Axios from 'axios';
import qs from 'query-string';
import _ from 'lodash';
import Img from 'react-image';

import ConfigMain from '~/configs/main';
import Friends from '~/src/theme/components/userProfile/Friends';
import Photos from '~/src/theme/components/userProfile/Photos';

import Spinner from '~/src/theme/components/homepage/Spinner';
import PostList from '~/src/theme/components/homepage/PostList';
import '~/src/theme/css/userProfile.css';

import { fetchListCharacterClasses, fetchListCharacterTraits } from '~/src/redux/actions/characterCreation';
import { fetchAchievements } from '~/src/redux/actions/achievements';

const profilePic =
  'https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/userProfile/default-profile.png';

class UserProfile extends Component {
  constructor(props) {
    super(props);

    const queryId = qs.parse(this.props.location.search).id;

    this.state = {
      firstName: this.props.userProfile.firstName,
      lastName: this.props.userProfile.lastName,
      userID: this.props.userProfile._id,
      work: 'Product Manager at Soqqle',
      character: this.props.userProfile.character,
      from: 'Singapore | Hong Kong',
      email: this.props.userProfile.email ? this.props.userProfile.email : 'Danshen@gmail.com',
      myProfile: true,
      url: 'Soqqle.com',
      tel: '+8521234567',
      tasks: 78,
      hangout: 63,
      mentees: 36,
      rating: 10,
      uploadType: '',
      blogs: [
        {
          text:
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laudantium quisquam minima aliquam, necessitatibus repudiandae maiores.',
          date: '30 minutes ago',
        },
        {
          text:
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laudantium quisquam minima aliquam, necessitatibus repudiandae maiores.',
          date: '1 day ago',
        },
        {
          text:
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laudantium quisquam minima aliquam, necessitatibus repudiandae maiores.',
          date: '2 days ago',
        },
      ],
      promoCode: '',
      promocodesUsed: [],
      isProfileLoading: queryId ? true : false,
      friendList: [],
      otherTabLoading: false,
      posts: [],
      loadingPosts: true,
      isAddButtonLoading: false,
    };
    this.fetchAllConnections = this.fetchAllConnections.bind(this);
    this.fetchPosts = this.fetchPosts.bind(this);
    this.navigateToUserProfile = this.navigateToUserProfile.bind(this);
    var self = this;
    this.props.history.listen((location, action) => {
      self.props.location.search = location.search;
      this.fetchAllConnections();
    });
    this.fetchAllConnections();
  }

  fetchPosts() {
    if (this.state.userID) {
      const postsEndpoint = `${ConfigMain.getBackendURL()}/${this.state.userID}/posts`;

      this.setState({ loadingPosts: true });
      Axios.get(postsEndpoint)
        .then(response => this.setState({ posts: response.data, loadingPosts: false }))
        .catch(error => {});
    }
  }

  componentDidMount() {
    this.fetchPosts();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.userID != prevState.userID) {
      this.fetchPosts();
    }
  }
  componentWillMount() {
    this.props.fetchListCharacterClasses();
    this.props.fetchListCharacterTraits();
    this.props.fetchAchievements();

    this.updatePromoCodesUsed();
    this.setUserProfile(qs.parse(this.props.location.search).id);
    this.setUserAchievement(qs.parse(this.props.location.search).id);
  }

  componentWillReceiveProps(nextProps) {
    const queryId = qs.parse(nextProps.location.search).id;
    this.setUserProfile(queryId);
  }
  fetchAllConnections() {
    const connectionsUrl = `${ConfigMain.getBackendURL()}/getConnectedSoqqlers`;
    var self = this;
    var currentUser;

    if (self.props.location.search === '') {
      currentUser = self.props.currentUserId;
    } else {
      var id = self.props.location.search;
      currentUser = id.substr(id.indexOf('=') + 1);
    }
    this.setState({ otherTabLoading: true });
    Axios.get(connectionsUrl, {
      params: {
        currentUser: currentUser,
      },
    })
      .then(function(response) {
        const friendList = response.data.filter(function(fList) {
          return fList.connectionStatus === 'Friends';
        });
        self.setState({
          otherTabLoading: false,
          friendList,
        });
      })
      .catch(function(error) {
        self.setState({ otherTabLoading: false });
      });
  }
  navigateToUserProfile(id) {
    return this.props.history.push(`/userprofile?id=${id}`);
  }
  openImageDialog(type, evt) {
    evt.stopPropagation();
    if (this.state.myProfile === true) {
      var file = this.refs.userImageInput;
      if (file) {
        this.setState({ uploadType: type });
        file.click();
      }
    } else {
      evt.preventDefault();
    }
  }

  uploadImage(e) {
    var file = e.target.files[0];
    if (file) {
      var userID = this.state.userID;
      var uploadType = this.state.uploadType;
      var imageFormData = new FormData();
      imageFormData.append('image', file);
      Axios.post(
        `${ConfigMain.getBackendURL()}/userProfile/${userID}/${uploadType}/upload-image`,
        imageFormData,
      )
        .then(response => {
          if (uploadType == 'avatar') {
            this.setState({ pictureURL: _.get(response, 'data.profile.pictureURL', '') });
            this.props.changeAvatar(_.get(response, 'data.profile.pictureURL', ''));
          } else {
            this.setState({ coverBackgroundURL: _.get(response, 'data.profile.coverBackgroundURL', '') });
            this.props.changeCoverBackground(_.get(response, 'data.profile.coverBackgroundURL', ''));
          }
        })
        .catch(err => {});
    }
  }

  setUserAchievement(queryId) {
    const id = queryId && this.state.userID != queryId ? queryId : this.props.userProfile._id;
    Axios(`${ConfigMain.getBackendURL()}/userAchievement/${id}`)
      .then(response => {
        this.setState({ userAchievement: response.data });
      })
      .catch(err => {});
  }

  setUserProfile(queryId) {
    this.state.isProfileLoading = true;
    if (queryId && this.state.userID != queryId) {
      Axios(`${ConfigMain.getBackendURL()}/fetchUserProfileById?id=${queryId}`)
        .then(response => {
          this.setState({
            userID: queryId,
            firstName: _.get(response, 'data.profile.firstName', ''),
            lastName: _.get(response, 'data.profile.lastName', ''),
            pictureURL: _.get(response, 'data.profile.pictureURL', ''),
            coverBackgroundURL: _.get(response, 'data.profile.coverBackgroundURL', ''),
            email: _.get(response, 'data.profile.email', ''),
            myProfile: false,
            hangout: _.size(_.get(response, 'data.hangouts')),
            progressionTrees: _.get(response, 'data.progressionTrees'),
            progressionTreeLevels: _.get(response, 'data.profile.progressionTreeLevels'),
            connectionDetails: _.get(response, 'data.connectionDetails'),
            isProfileLoading: false,
          });
        })
        .catch(err => {});
    } else if (queryId === this.props.userProfile._id || _.isEmpty(queryId)) {
      this.setState({
        firstName: _.get(this, 'props.userProfile.firstName'),
        lastName: _.get(this, 'props.userProfile.lastName'),
        userID: _.get(this, 'props.userProfile._id'),
        pictureURL: _.get(this, 'props.userProfile.pictureURL'),
        coverBackgroundURL: _.get(this, 'props.userProfile.coverBackgroundURL'),
        email: _.get(this, 'props.userProfile.email', 'Danshen@gmail.com'),
        myProfile: true,
        progressionTrees: this.props.userProfile.progressionTrees,
        progressionTreeLevels: this.props.userProfile.progressionTreeLevels,
        hangout: 0,
        isProfileLoading: false,
      });
    }
  }

  updatePromoCodesUsed() {
    Axios.get(
      `${ConfigMain.getBackendURL()}/couponsGet?ownerUserId=${this.props.userProfile._id}&isUsed=${true}`,
    )
      .then(results => {
        this.setState({ promocodesUsed: results.data });
      })
      .catch(error => {});
  }

  handleInputPromoCode(e) {
    if (e.target.value.length === 0 || /^[0-9a-zA-Z]+$/.test(e.target.value)) {
      this.setState({ promoCode: e.target.value.toUpperCase() });
    }
  }

  handleRedeemCode() {
    if (this.state.promoCode.length == 16) {
      const body = {
        code: this.state.promoCode,
        owner: {
          id: this.props.userProfile._id,
          firstName: this.props.userProfile.firstName,
          lastName: this.props.userProfile.lastName,
        },
      };

      Axios.post(`${ConfigMain.getBackendURL()}/couponRedeem`, body)
        .then(result => {
          this.setState({ promoCode: '' });
          this.updatePromoCodesUsed();
        })
        .catch(error => {
          if (error.response && error.response.status) {
            if (error.response.status === 423) {
              if (error.response.data && error.response.data.status) {
                if (error.response.data.status == 'used') {
                  alert('Code already used');
                }
              }
            } else if (error.response.status === 404) {
              alert('Invalid code');
            } else if (error.response.status === 500) {
              alert('Server error');
            }
          }
        });
    }
  }

  handlePromoInputKeyPress(event) {
    if (event.key == 'Enter') {
      this.handleRedeemCode();
    }
  }

  renderCharacter() {
    if (
      !this.props.userProfile ||
      !this.props.userProfile.character ||
      this.props.isFetchingCharacters ||
      this.props.isFetchingCharacterTraits
    ) {
      return null;
    }

    const Character = this.props.userProfile.character;

    const CharacterClass = this.props.listCharacters[Number(this.props.userProfile.character.characterIndex)];
    const CharacterTraits = this.props.listCharacterTraits[
      Number(this.props.userProfile.character.traitsIndex)
    ];

    return (
      <div id="userprofile-page-character-info">
        {CharacterClass.imageURL ? (
          <img src={CharacterClass.imageURL} />
        ) : (
          <img src="http://sociamibucket.s3.amazonaws.com/assets/character_creation/character_icons/Nelson.png" />
        )}
        <h2>{CharacterClass.name}</h2>
        <h3>{CharacterTraits.name}</h3>
        <h4>{CharacterTraits.description}</h4>
      </div>
    );
  }

  renderTransactions() {
    if (
      !this.props.accounting ||
      !this.props.accounting.data.userTransactions ||
      this.props.accounting.data.userTransactions.length === 0
    ) {
      return null;
    }

    return (
      // <div id="userprofile-page-transactions-log">
      // 	<h2>Transaction log</h2>
      // 	<ul>
      // 		{
      // 			this.props.accounting.data.userTransactions.map((transaction, i) => {
      // 				const Source = transaction.source.hangout ? `"${transaction.source.hangout.name}"`
      // 					: `"${transaction.source.illuminate.name}"`;

      // 				return (
      // 					<li key={i}><span>{`Received: ${transaction.numTokens} ${transaction.numTokens > 1 ? "tokens" : "token"} for ${Source} `}</span></li>
      // 				)
      // 			})
      // 		}
      // 	</ul>
      // </div>
      <div className="transaction-list">
        {this.props.accounting.data.userTransactions.map((transaction, i) => {
          // const Source = transaction.source.hangout ? `"${transaction.source.hangout.name}"`
          // 	: `"${transaction.source.illuminate.name}"`;
          const Source = transaction.source.hangout
            ? transaction.source.hangout.name
            : transaction.source.illuminate.name;
          let colorClass;
          if (i % 2 == 0) {
            colorClass = 'row token-grid-blue';
          } else {
            colorClass = 'row token-grid';
          }

          return (
            <div className={colorClass}>
              <div className="col-md-2 col-xs-4 token-number">
                +{transaction.numTokens} {transaction.numTokens > 1 ? 'tokens' : 'token'}
              </div>
              <div className="col-md-10 col-xs-8 no-padding">
                <div className="col-md-8 col-xs-12">{Source}</div>
                <div className="col-md-2 col-xs-6">Daniel Shen</div>
                <div className="col-md-2 col-xs-6 pull-right">12/12/2017</div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  renderLevels() {
    const UserProgressionTrees = this.state.progressionTrees;

    if (UserProgressionTrees && UserProgressionTrees.length > 0) {
      let ProgressionTreeLevels = this.state.progressionTreeLevels;

      if (!ProgressionTreeLevels || ProgressionTreeLevels.length == 0) {
        UserProgressionTrees.forEach(function(progressionTree) {
          ProgressionTreeLevels.push({
            _id: progressionTree._id,
            name: progressionTree.name,
            currentLevelXP: 0,
            totalXP: 0,
            level: 0,
          });
        });
      } else {
        UserProgressionTrees.forEach(function(progressionTree) {
          if (
            !ProgressionTreeLevels.find(function(progressionTreeLevel) {
              return progressionTreeLevel._id == progressionTree._id;
            })
          ) {
            ProgressionTreeLevels.push({
              _id: progressionTree._id,
              name: progressionTree.name,
              currentLevelXP: 0,
              totalXP: 0,
              level: 0,
            });
          }
        });
      }

      return (
        <div className="experience-list">
          {ProgressionTreeLevels.map(function(ProgTreeLevel, i) {
            let widthPercent = (ProgTreeLevel.currentLevelXP / ProgTreeLevel.totalXP) * 100;
            return (
              <div className="row skill-bar">
                <div className="col-md-1 col-xs-2 level-column">
                  <span className="fa-blue-stack">
                    <i className="fa fa-certificate fa-stack-2x blue-fa" />
                    <span className="fa fa-stack-1x">
                      <b>{ProgTreeLevel.level}</b>
                    </span>
                  </span>
                  <div className="profile-stat-name">LEVEL</div>
                </div>
                <div className="col-md-10 col-xs-8 exp-progress">
                  <div className="exp-title">{ProgTreeLevel.name}</div>
                  <div className="progress">
                    <div className="progress-length" style={{ width: `${widthPercent}%` }}>
                      {ProgTreeLevel.currentLevelXP} XP
                    </div>
                  </div>
                </div>
                <div className="col-md-1 col-xs-2 xp-column">
                  <span className="fa-blue-stack" style={{ color: '#F48543' }}>
                    <i className="fa fa-trophy fa-stack-2x gold-fa" />
                    <span className="fa fa-stack-1x stack-num-trophy">
                      <b>{ProgTreeLevel.totalXP}</b>
                    </span>
                  </span>
                  <div className="profile-stat-name">TOTAL XP</div>
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    return null;
  }

  renderPromoCodeSection() {
    return (
      <div id="userprofile-promocode-section">
        <button
          id="userprofile-promocode-submit"
          type="button"
          className="btn-base btn-yellow"
          onClick={() => this.handleRedeemCode()}
        >
          Redeem code
        </button>
        <input
          type="text"
          autoFocus={true}
          onKeyPress={e => this.handlePromoInputKeyPress(e)}
          maxLength={16}
          value={this.state.promoCode}
          onChange={e => this.handleInputPromoCode(e)}
        />

        {this.state.promocodesUsed.map((promocodeUsed, i) => {
          if (
            promocodeUsed.data &&
            promocodeUsed.data.benefit &&
            promocodeUsed.data.benefit.date &&
            promocodeUsed.data.benefit.value
          ) {
            return (
              <div key={i}>{`Promo code effective date: ${promocodeUsed.data.benefit.date} ${
                promocodeUsed.data.benefit.value
              }`}</div>
            );
          }
        })}
      </div>
    );
  }

  renderAchievementCount(achievement) {
    return achievement.conditions.map(cond => {
      let tokenCountLabel;
      switch (cond.type) {
        case 'Task':
          tokenCountLabel = `Complete ${cond.count} ${cond.taskType} ${cond.count === 1 ? 'task' : 'tasks'}.`;
          break;
        case 'Progression':
          // Find progression from this.state.progressionTrees using condition._roadmap field
          let progressionObj = this.state.progressionTrees.find(e => e._id === cond._roadmap);
          tokenCountLabel = `Complete ${cond.count} "${_.get(progressionObj, 'name')}" ${
            cond.count === 1 ? 'task' : 'tasks'
          }.`;
          break;
        case 'Achievements':
          // Find list of achievements from this.props.achievements using condition._achievements field which is an array
          let achievementNames = this.props.achievements.data
            .filter(ach => cond._achievements.indexOf(ach._id) !== -1)
            .map(ach => ach.name);
          tokenCountLabel = `Complete the ${
            achievementNames.length > 1 ? 'Achievements' : 'Achievement'
          } "${achievementNames.join('", "')}".`;
          break;
        case 'Action':
          if (cond.count > 1) {
            tokenCountLabel = `Complete ${cond.count} "${cond.action}s".`;
          } else {
            tokenCountLabel = `Complete ${cond.count} "${cond.action}".`;
          }
          break;
        case 'Level':
          tokenCountLabel = `Reach level ${cond.count}.`;
          break;
        case 'Story':
          tokenCountLabel = `Requires ${_.get(cond, '_story.name')}.`;
          break;
      }
      return (
        <div key={cond._id} className="token-count">
          {tokenCountLabel}
        </div>
      );
    });
  }

  achievementPopover(achievement) {
    return (
      <Popover id="popover-skill" className="popover-skill">
        {this.renderAchievementCount(achievement)}
        <div className="progress-custom">
          {/* {this.getTotalAchievementCount(achievement._id)} */}
          {this.renderProgressLength(achievement._id)}
        </div>
        <div className="earned-token">Earned 50 tokens during 7 days</div>
      </Popover>
    );
  }

  renderProgressLength(achievementId) {
    const total = this.getTotalAchievementCount(achievementId);
    console.log(total);
    const style = {
      width: `${(total.totalCtr / total.totalCount) * 100}%`,
    };
    return <div className="progress-length-custom" style={style} />;
  }

  getTotalAchievementCount(achievementId) {
    const achievements = _.get(this, 'state.userAchievement.achievements', []);
    const achievementById = _.find(achievements, { achievementId });
    let total = {
      totalCtr: 0,
      totalCount: 0,
    };
    if (achievementById) {
      _.each(achievementById.conditions, condition => {
        if (condition.type !== 'Story') {
          total.totalCtr += condition.counter;
          total.totalCount += condition.count;
        }
      });
    } else {
      // set totalCount to 1 so that counter will not be divided to zero
      total.totalCount = 1;
    }

    return total;
  }

  renderAchievementsFilter() {
    return (
      <div className="row achievement-to-show">
        <div className="achievement-text col-md-3 col-xs-8">Achievements to show</div>
        <div className="sort-achievement-div col-md-2 col-xs-4">
          <select className="sort-achievement">
            <option value="none">None</option>
            {this.props.achievements.data.map(achievement => {
              return <option value={achievement.name}>{achievement.name}</option>;
            })}
          </select>
        </div>
        <div className="search-achievement-div col-md-7 col-xs-12">
          <div className="input-group search-box">
            <span className="input-group-btn" style={{ position: 'absolute' }}>
              <button className="btn btn-search" type="button">
                <span className="glyphicon glyphicon-search" style={{ top: '4px' }} />
              </button>
            </span>
            <input type="text" className="search-query" placeholder="Type in to search" />
          </div>
        </div>
      </div>
    );
  }

  renderProgressionLevels(UserProgressionTreeLevels) {
    let listItems = UserProgressionTreeLevels.map((ProgTreeLevel, i) => {
      let widthPercent = Math.round((ProgTreeLevel.currentLevelXP / ProgTreeLevel.totalXP) * 100);
      return (
        // <div className="col-md-5 experience-container" key={i}>
        <div className="row">
          <div className="col-sm-8" style={{ 'text-align': 'right', color: 'white' }}>
            <p>{ProgTreeLevel.name}</p>
          </div>
          <div className="col-sm-4">
            <a href="/levels" className="btn-lavel-yellow pull-right">
              LEVEL {ProgTreeLevel.level}
            </a>
          </div>
        </div>
        // </div>
      );
    });
    return listItems;
  }

  renderAchievementsList() {
    return (
      <div className="achievementList">
        {this.props.achievements.data.map(achievement => {
          return (
            <div className="row achievement-list">
              <div className="achievement-header">
                <div className="achievement-heading col-md-2 col-xs-2 no-padding">
                  {_.get(achievement, '_company.name')}
                </div>
                <div className="achievement-progress col-md-8 col-xs-6 no-padding">
                  <div className="achievement-count">10 of 15</div>
                  <div className="progress-custom">
                    <div className="progress-length-custom" />
                  </div>
                </div>
                <div className="achievement-token col-md-2 col-xs-4 no-padding">
                  <p className="pull-right">+1000 SOQQ </p>
                </div>
              </div>

              {achievement._achievements.map(_achievement => {
                return (
                  <div key={_achievement._id} className="achievement-box col-lg-2 col-md-3 col-sm-2 col-xs-6">
                    <OverlayTrigger
                      trigger={['hover', 'click']}
                      placement="top"
                      rootClose
                      overlay={this.achievementPopover(_achievement)}
                    >
                      <div>
                        <div className="achievement-item">
                          <Img
                            src={`https://s3.us-east-2.amazonaws.com/admin.soqqle.com/achievementImages/${
                              _achievement._id
                            }?date=${new Date().toISOString()}`}
                          />
                        </div>
                        <div className="achievement-name">
                          <p>{_achievement.name}</p>
                        </div>
                      </div>
                    </OverlayTrigger>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  }
  coverStyle() {
    var style = {};
    style['background'] =
      'url(https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/userProfile/profile-top-bg.jpg)';
    if (this.state.coverBackgroundURL) {
      style['background'] = 'url(' + this.state.coverBackgroundURL + ')';
    }
    return style;
  }

  renderIntroEdit() {
    if (!this.state.myProfile) {
      return <span />;
    }

    return (
      <span className="pull-right">
        <a
          href="#"
          onClick={e => {
            e.preventDefault();
            return false;
          }}
          className="editbtn"
        >
          <i className="fa fa-pencil" /> Edit
        </a>
      </span>
    );
  }

  getConnectionStatus() {
    let statusData = {
      status: -1,
      buttonLabel: 'Add',
    };

    const visitedUserId = qs.parse(this.props.location.search).id;
    const visitorId = this.props.userProfile._id;
    if (this.state.connectionDetails && this.state.connectionDetails.length) {
      this.state.connectionDetails.forEach(connectionDetail => {
        if (visitedUserId === connectionDetail.userID1 && connectionDetail.userID2 === visitorId) {
          statusData = {
            status: connectionDetail.requestStatus,
            buttonLabel: [1, 2].indexOf(connectionDetail.requestStatus) > -1 ? 'Withdraw' : 'Add',
          };
        } else if (visitedUserId === connectionDetail.userID2 && connectionDetail.userID1 === visitorId) {
          statusData = {
            status: connectionDetail.requestStatus,
            buttonLabel: [1, 2].indexOf(connectionDetail.requestStatus) > -1 ? 'Withdraw' : 'Add',
          };
        }
      });
    }

    return statusData;
  }

  onClickWithdrawConnection(visitedUserId, e) {
    var that = this;
    const url = `${ConfigMain.getBackendURL()}/connectSoqqler`;
    this.setState({ isAddButtonLoading: true });
    Axios.post(url, {
      currentUser: that.props.userProfile,
      otherUser: { id: visitedUserId },
      connectAction: 'Withdraw',
    })
      .then(function(response) {
        if (response.data === 'success') {
          that.setState(prevState => ({
            connectionDetails: prevState.connectionDetails.filter(
              connectionDetail =>
                !(
                  connectionDetail.userID1 === that.props.userProfile._id &&
                  connectionDetail.userID2 === visitedUserId
                ),
            ),
            isAddButtonLoading: false,
          }));
        }
      })
      .catch(function(error) {});

    e.preventDefault();
  }

  onClickAddUser(connectionStatus, visitedUserId, e) {
    if (visitedUserId) {
      var that = this;
      const url = `${ConfigMain.getBackendURL()}/addSoqqler`;
      this.setState({ isAddButtonLoading: true });
      Axios.post(url, {
        uid1: that.props.userProfile._id,
        uid2: visitedUserId,
        reqStatus: 2,
      })
        .then(function(response) {
          if (response.data === 'success') {
            that.setState(prevState => ({
              connectionDetails: [
                ...prevState.connectionDetails,
                {
                  userID1: that.props.userProfile._id,
                  userID2: visitedUserId,
                  requestStatus: 1,
                },
              ],
              isAddButtonLoading: false,
            }));
          }
        })
        .catch(function(error) {});
    }

    e.preventDefault();
  }

  renderAddButtonSpinner() {
    return this.state.isAddButtonLoading ? <span className="fa fa-spinner fa-spin" /> : <span />;
  }

  renderAddOrFollowUserButton() {
    if (this.state.myProfile) {
      return <span />;
    }

    const visitedUserId = qs.parse(this.props.location.search).id;
    const connectionStatus = this.getConnectionStatus().status;
    const buttonLabel = this.getConnectionStatus().buttonLabel;
    let buttonWidth = 71;

    let buttonActionFn = this.onClickAddUser.bind(this, connectionStatus, visitedUserId);

    if (connectionStatus > 0) {
      buttonActionFn = this.onClickWithdrawConnection.bind(this, visitedUserId);
      buttonWidth = 91;
    }

    return (
      <p style={{ width: '60%', float: 'right' }}>
        <a href="#" onClick={buttonActionFn} className="btn-join" style={{ width: buttonWidth }}>
          {this.renderAddButtonSpinner()} {buttonLabel}
        </a>{' '}
        <a href="#" className="btn-follow">
          Follow
        </a>{' '}
        <a href="#" className="btn-send">
          <img
            src="https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/userProfile/send-arrow.png"
            alt=""
          />
        </a>
      </p>
    );
  }

  render() {
    const { otherTabLoading, friendList } = this.state;
    let traitsNameLine;
    let characterNameLine;
    if (this.state.character) {
      traitsNameLine = this.state.character.traitsName ? (
        <li>
          <span className="icon bt-icon" /> {this.state.character.traitsName}
        </li>
      ) : null;
      characterNameLine = this.state.character.characterName ? (
        <li>
          <span className="icon pc-icon" /> {this.state.character.characterName}
        </li>
      ) : null;
    }
    const UserProgressionTreeLevels = this.props.userProfile.progressionTreeLevels;
    return (
      <div className={`${this.props.userProfile.theme.toLowerCase()}-theme-wrapper profile-wrapper main-bg`}>
        <div className="row">
          <div className="container">
            {this.state.isProfileLoading && (
              <div className="progress-browser-wrap">
                <div className="row">
                  <div className="content-2-columns-left-title profile-loading">
                    Loading...<Icon spin name="spinner" />
                  </div>
                </div>
              </div>
            )}
            {!this.state.isProfileLoading && (
              <div className="row">
                <div className="row">
                  <div className="top-wp" style={this.coverStyle()}>
                    <div className="col-sm-5">
                      <div className="clf">
                        <div className="imgbox" onClick={this.openImageDialog.bind(this, 'avatar')}>
                          <a href="#">
                            <img src={this.state.pictureURL ? this.state.pictureURL : profilePic} />
                            {this.state.myProfile ? (
                              <span>
                                {' '}
                                <i className="fa fa-camera" aria-hidden="true" /> Edit
                              </span>
                            ) : (
                              <span />
                            )}
                          </a>
                        </div>
                        <h3>
                          {this.state.firstName} {this.state.lastName}
                        </h3>
                      </div>
                    </div>
                    <div className="col-sm-2 h-100">
                      {this.state.myProfile ? (
                        <span className="middle-edit" onClick={this.openImageDialog.bind(this, 'background')}>
                          <a href="#">
                            <i className="fa fa-camera" aria-hidden="true" /> &nbsp; Edit
                          </a>
                        </span>
                      ) : (
                        <span />
                      )}
                    </div>
                    {/* <div className="col-sm-5 last-right">
                      <p>Blockforce enhancer <a href="#" className="btn-lavel-yellow pull-right">level 5</a></p>
                      <p>Data miner <a href="#" className="btn-lavel-yellow pull-right">level 5</a></p>
                      <p><a href="#" className="btn-join">Add</a> <a href="#" className="btn-follow">Follow</a> <a href="#" className="btn-send"><img src="https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/userProfile/send-arrow.png" alt="" /></a></p>
                    </div> */}
                    <div className="col-sm-5 last-right" style={{ width: '40%', marginTop: '25px' }}>
                      {this.renderProgressionLevels(UserProgressionTreeLevels)}
                      {this.renderAddOrFollowUserButton()}
                    </div>
                    <input
                      type="file"
                      ref="userImageInput"
                      accept=".jpg, .png, .jpeg, .gif"
                      style={{ display: 'none' }}
                      onChange={this.uploadImage.bind(this)}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <div className="col-box-wp">
                      <div className="intro-wp">
                        <h3 className="col-heading">Intro {this.renderIntroEdit()}</h3>
                        <ul>
                          <li>
                            <span className="icon" /> {this.state.work}
                          </li>
                          <li>
                            <span className="icon p-icon" /> Studied at Yoobo
                          </li>
                          <li>
                            <span className="icon bt-icon" /> Lives in Vietnam
                          </li>
                          <li>
                            <span className="icon pc-icon" /> Joined September 2017
                          </li>
                          {traitsNameLine}
                          {characterNameLine}
                        </ul>
                      </div>
                    </div>
                    {otherTabLoading ? (
                      <Spinner shown />
                    ) : (
                      <Friends
                        handleChange={this.navigateToUserProfile}
                        connections={friendList}
                        heading={this.state.myProfile ? 'My friends' : 'Friends'}
                      />
                    )}

                    <Photos heading={this.state.myProfile ? 'My photos' : 'Photos'} />
                  </div>
                  <div className="col pull-right">
                    <div className="theme-box-right">
                      <div className="box">
                        <div className="games-network-wp">
                          <h3 className="col-heading">Quest</h3>
                          <p>
                            Innovation is widely known as a value which is worth pursuing or even a corporate
                            cure-all. However it is important to be aware of the many innovation
                          </p>
                          <h5>6/12 Slots Open on 13/08</h5>
                          <div className="fot-wp">
                            <p>
                              0/3 of Creavity Questions{' '}
                              <a href="#" className="btn-join pull-right">
                                Join
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="theme-box-right">
                      <div className="box">
                        <div className="games-network-wp">
                          <h3 className="col-heading">Quest</h3>
                          <p>
                            Innovation is widely known as a value which is worth pursuing or even a corporate
                            cure-all. However it is important to be aware of the many innovation
                          </p>
                          <h5>6/12 Slots Open on 13/08</h5>
                          <div className="fot-wp">
                            <p>
                              0/3 of Creavity Questions{' '}
                              <a href="#" className="btn-join pull-right">
                                Join
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="theme-box-right">
                      <div className="box">
                        <div className="games-network-wp">
                          <div className="text-center">
                            <a href="#" className="blue-rounded-btn small-text">
                              Challenge
                            </a>{' '}
                            <a href="#" className="blue-rounded-btn small-text">
                              Private
                            </a>
                          </div>
                          <h3 className="col-heading">Growth Hack Timber Logs</h3>
                          <p>
                            Innovation is widely known as a value which is worth pursuing or even a corporate
                            cure-all. However it is important to be aware of the many innovation
                          </p>

                          <div className="fot-wp">
                            <p className="text-uppercase text-center">You will receive</p>
                            <ul className="bttons-right-box">
                              <li>
                                <a href="#">5 Exp</a>
                              </li>
                              <li>
                                <a href="#"> 10 soqq</a>
                              </li>
                              <li>
                                <a href="#">Balor</a>
                              </li>
                            </ul>
                            <p>
                              0/5 Open{' '}
                              <a href="#" className="btn-join pull-right">
                                Join
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-middle">
                    <PostList
                      isLoading={this.state.loadingPosts}
                      posts={this.state.posts}
                      userProfile={this.props.userProfile}
                    />
                    <div className="col-box-wp">
                      <div className="main-comment-box">
                        <h4 className="heading-md">
                          Growth Hack Timber Logs
                          <span className="pull-right">
                            <a href="#" className="blue-rounded-btn">
                              Challenge
                            </a>{' '}
                            <a href="#" className="blue-rounded-btn">
                              Private
                            </a>
                          </span>
                        </h4>
                        <p>
                          Innovation is widely known as a value which is worth pursuing or even a corporate
                          cure-all. However it is important to be aware of the many innovation...
                        </p>
                      </div>
                    </div>
                    <div className="col-box-wp">
                      <div className="main-comment-box">
                        <h4 className="heading-md">
                          Growth Hack Timber Logs
                          <span className="pull-right">
                            <a href="#" className="blue-rounded-btn">
                              Challenge
                            </a>{' '}
                            <a href="#" className="blue-rounded-btn">
                              Private
                            </a>
                          </span>
                        </h4>
                        <p>
                          Innovation is widely known as a value which is worth pursuing or even a corporate
                          cure-all. However it is important to be aware of the many innovation...
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isFetchingCharacters: state.characterCreation.isFetchingCharacters,
  isFetchingCharacterTraits: state.characterCreation.isFetchingCharacterTraits,
  listCharacters: state.characterCreation.listCharacters,
  listCharacterTraits: state.characterCreation.listCharacterTraits,
  accounting: state.accounting,
  achievements: state.achievements,
});

const mapDispatchToProps = dispatch => ({
  fetchListCharacterClasses: bindActionCreators(fetchListCharacterClasses, dispatch),
  fetchListCharacterTraits: bindActionCreators(fetchListCharacterTraits, dispatch),
  fetchAchievements: bindActionCreators(fetchAchievements, dispatch),
});

//withRouter - is a workaround for problem of shouldComponentUpdate when using react-router-v4 with redux
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(UserProfile),
);
