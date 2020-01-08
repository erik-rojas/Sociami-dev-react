/*
		author: Michael Korzun

*/

import React, { Component } from 'react';
import { Button, Popover, OverlayTrigger, DropdownButton, MenuItem } from 'react-bootstrap';
import { Icon } from 'react-fa';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Axios from 'axios';
import StarRatings from 'react-star-ratings';
import qs from 'query-string';
import _ from 'lodash';
import Img from 'react-image';

import ConfigMain from '~/configs/main';
import { openUserProfileComplete } from '~/src/redux/actions/authorization';
import '~/src/css/newUserProfile.css';

import { fetchListCharacterClasses, fetchListCharacterTraits } from '~/src/redux/actions/characterCreation';

import { fetchAchievements } from '~/src/redux/actions/achievements';
import { ENGINE_METHOD_DIGESTS } from 'constants';

const tag = 'https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/userProfile/rightBarTag.png';
const friend =
  'https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/userProfile/rightBarAdd-friend.png';
const question =
  'https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/userProfile/rightBarQuestion.png';
const coffee =
  'https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/userProfile/rightBarCoffee-cup.png';
const eyeglasses =
  'https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/userProfile/rightBarEyeglasses.png';
const close = 'https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/userProfile/rightBarX.png';
const mentees = 'https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/userProfile/mentees.png';
const hangout = 'https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/userProfile/hangout.png';
const tasks = 'https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/userProfile/tasks.png';
const profilePic =
  'https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/userProfile/default-profile.png';

class UserProfile extends React.Component {
  constructor(props) {
    super(props);

    const queryId = qs.parse(this.props.location.search).id;

    this.state = {
      firstName: this.props.userProfile.firstName,
      lastName: this.props.userProfile.lastName,
      userID: this.props.userProfile._id,
      work: 'Product Manager at Soqqle',
      from: 'Singapore | Hong Kong',
      email: this.props.userProfile.email ? this.props.userProfile.email : 'Danshen@gmail.com',
      url: 'Soqqle.com',
      tel: '+8521234567',
      tasks: 78,
      hangout: 63,
      mentees: 36,
      rating: 10,
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
    };
  }

  componentWillMount() {
    this.props.fetchListCharacterClasses();
    this.props.fetchListCharacterTraits();
    this.props.fetchAchievements();

    this.updatePromoCodesUsed();
    this.setUserProfile(qs.parse(this.props.location.search).id);
    this.setUserAchievement(qs.parse(this.props.location.search).id)
  }

  componentWillReceiveProps(nextProps) {
    const queryId = qs.parse(nextProps.location.search).id;
    this.setUserProfile(queryId);
  }

  setUserAchievement(queryId) {
    const id = queryId && this.state.userID != queryId ? queryId : this.props.userProfile._id;
    Axios(`${ConfigMain.getBackendURL()}/userAchievement/${id}`)
      .then(response => {
        this.setState({userAchievement: response.data})
      }).catch(err => {});
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
            email: _.get(response, 'data.profile.email', ''),
            hangout: _.size(_.get(response, 'data.hangouts')),
            progressionTrees: _.get(response, 'data.progressionTrees'),
            progressionTreeLevels: _.get(response, 'data.profile.progressionTreeLevels'),
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
        email: _.get(this, 'props.userProfile.email', 'Danshen@gmail.com'),
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
          tokenCountLabel = `Requires ${_.get(cond, '_story.name')}.`
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
    const total = this.getTotalAchievementCount(achievementId)
    console.log(total)
    const style = {
      width: `${(total.totalCtr/total.totalCount) * 100}%`
    }
    return (
      <div className="progress-length-custom" style={style}/>
    )
  }

  getTotalAchievementCount(achievementId) {
    const achievements = _.get(this, 'state.userAchievement.achievements', [])
    const achievementById = _.find(achievements, {achievementId})
    let total = {
      totalCtr: 0,
      totalCount: 0
    };
    if (achievementById) {
      _.each(achievementById.conditions, condition => {
        if (condition.type !== 'Story') {
          total.totalCtr += condition.counter
          total.totalCount += condition.count
        }
      })
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

  renderAchievementsList() {
    return (
      <div class="achievementList">
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

  render() {
    //Incorrect usage of bootstrap row col. @Michael?
    return (
      <div className=" soqqle-content-container profile-container">
        {this.state.isProfileLoading && (
          <div className="container-fluid progress-browser-wrap">
            <div className="row">
              <div className="content-2-columns-left-title">
                Loading...<Icon spin name="spinner" />
              </div>
            </div>
          </div>
        )}
        {!this.state.isProfileLoading && (
          <div>
            <div className="user-profile-box">
              <div className="row">
                <div className="col-md-offset-2 col-md-3 col-xs-7">
                  <h4 className="profile-user-name">
                    {this.state.firstName} {this.state.lastName}
                  </h4>
                  <p className="profile-user-work">{this.state.work}</p>
                </div>
                <div className="col-md-2 col-xs-5">
                  <div className="row">
                    <div className="col-xs-6 text-center">
                      <span className="fa-stack prof-fa">
                        <i className="fa fa-star fa-stack-2x header-fa" />
                        <span className="fa fa-stack-1x">
                          <b>0</b>
                        </span>
                      </span>
                      <p className="text-center">E-XP</p>
                      <div className="c-soon">coming soon..</div>
                    </div>
                    <div className="col-xs-6 text-center">
                      <span className="fa-stack prof-fa">
                        <i className="fa fa-database fa-stack-2x header-fa" />
                        <span className="fa fa-stack-1x">
                          <b>72</b>
                        </span>
                      </span>
                      <p className="text-center">SOQQ</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-5 col-sm-12" />
              </div>
              <div className="row">
                <div className="profile-img-container col-md-2 col-xs-5">
                  <img
                    className="profile-img"
                    src={this.state.pictureURL ? this.state.pictureURL : profilePic}
                  />
                  <div className="online-green" />
                </div>
                <div className="profile-desc col-md-3 col-xs-7" style={{ wordWrap: 'break-word' }}>
                  <p>"I prefer working theory and information, thinking, organinsing and understanding"</p>
                </div>
                <div className="col-md-7 col-xs-12" />
              </div>
              <div className="row">
                <div className="profile-stat-column col-md-offset-2 col-md-3 col-xs-3">
                  <div className="col-md-3 no-padding">
                    <div className="profile-stat" style={{ color: '#20A5D0' }}>
                      <div className="profile-stat-count">{this.state.tasks}</div>
                      <div className="profile-stat-name">TASKS</div>
                    </div>
                  </div>
                  <div className="col-md-3 no-padding">
                    <div className="profile-stat" style={{ color: '#F48543' }}>
                      <div className="profile-stat-count">{this.state.mentees}</div>
                      <div className="profile-stat-name">HOURS</div>
                    </div>
                  </div>
                  <div className="col-md-3 no-padding">
                    <div className="profile-stat" style={{ color: '#DC2F41' }}>
                      <div className="profile-stat-count">{this.state.mentees}</div>
                      <div className="profile-stat-name">MENTEES</div>
                    </div>
                  </div>
                </div>
                <div className="profile-details-column col-md-7 col-xs-8">
                  <div className="profile-details">
                    <i className="fa fa-map-marker detail-fa" />{' '}
                    <span className="prof-marker">{this.state.from}</span>
                  </div>
                  <div className="profile-details">
                    <i className="fa fa-envelope detail-fa" />{' '}
                    <span className="prof-marker">{_.get(this, 'state.email', 'mail@example.com')}</span>
                  </div>
                  <div className="profile-details">
                    <i className="fa fa-globe detail-fa" />{' '}
                    <span className="prof-marker">{this.state.url}</span>
                  </div>
                  <div className="profile-details">
                    <i className="fa fa-phone detail-fa" />{' '}
                    <span className="prof-marker">{this.state.tel}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="prof-tab-container">
              <ul className="nav nav-tabs">
                <li className="active prof-tab">
                  <a
                    className="prof-tag experience"
                    data-toggle="tab"
                    href="#experience"
                    style={{ backgroundColor: '#DC2F41' }}
                  >
                    Experience
                  </a>
                </li>
                <li className="prof-tab">
                  <a
                    className="prof-tag token-related"
                    data-toggle="tab"
                    href="#token-related"
                    style={{ backgroundColor: '#20A5D0' }}
                  >
                    Token Related
                  </a>
                </li>
                <li className="prof-tab">
                  <a
                    className="prof-tag achievements"
                    data-toggle="tab"
                    href="#achievements"
                    style={{ backgroundColor: '#F48543' }}
                  >
                    Achievements
                  </a>
                </li>
              </ul>

              <div className="tab-content prof-tab-content">
                <div id="experience" className="tab-pane fade in active">
                  {this.renderLevels()}
                </div>
                <div id="token-related" className="tab-pane fade">
                  <div className="wallet-header">
                    <h5 className="wallet-heading col-xs-12">
                      my WALLET ADDRESS
                      <span className="wallet-c-soon">(coming soon...)</span>
                    </h5>
                    <div className="col-xs-10">
                      <p className="wallet-address">asdasd123123as9al10skd8aj2</p>
                    </div>
                    <div className="col-xs-2">
                      <a className="pull-right">Change</a>
                    </div>
                  </div>
                  <hr className="token-hr" />
                  <div className="transaction-header">
                    <div className="transaction-heading col-md-2 col-xs-6">TRANSACTIONS</div>
                    <div className="col-md-10 col-xs-6 transaction-filter">
                      Sort
                      <select className="filter-transaction">
                        <option value="none">None</option>
                      </select>
                    </div>
                  </div>
                  {this.renderTransactions()}
                </div>
                <div id="achievements" className="tab-pane fade">
                  <div className="row redeem-token">
                    <div className="redeem-grid col-md-3 col-xs-8">
                      <input className="redeem-code-input" placeholder="Fill in your code" />
                    </div>
                    <div className="redeem-grid col-md-2 col-xs-4">
                      <button className="btn btn-default btn-redeem">REDEEM</button>
                    </div>
                    <div className="redeem-grid col-md-7 col-xs-12">
                      <input className="redeem-code-input" placeholder="TBC 20 SOQQ TOKENS" />
                    </div>
                  </div>
                  {this.renderAchievementsFilter()}
                  {this.renderAchievementsList()}
                </div>
              </div>
            </div>
          </div>
        )}
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
