/*
    author: Alexander Zolotov
*/
import React from 'react';

import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Modal from 'react-modal';
import { Redirect } from 'react-router';

import ActionLink from '~/src/components/common/ActionLink';

import Axios from 'axios';
import ConfigMain from '~/configs/main';

import '~/src/theme/css/treebrowser.css';

import { selectResultsCategory } from '~/src/redux/actions/fetchResults';

import { fetchResults, setSearchQuery } from '~/src/redux/actions/fetchResults';

import { userInteractionPush } from '~/src/redux/actions/userInteractions';

import TrendScannerComponent from '~/src/theme/components/trends/TrendScannerComponent';
import HangoutSubmitForm from '~/src/theme/components/progressiontrees/HangoutSubmitForm';
import TaskTypes from '~/src/common/TaskTypes';

import UserInteractions from '~/src/common/UserInteractions';

import { getPopupParentElement } from '~/src/common/PopupUtils.js';

import Countdown from 'react-countdown-now';

class SkillBreakdown extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      skillInfo: undefined,
      isHangoutFormVisible: false,
      TrendScannerComponentVisible: false,
      isIlluminateFormVisible: false,
      IsDisplayForm: 'block',
      redirectToTaskManagement: false,
      timeNow: Date.now(),
    };
    this.modalDefaultStyles = {};

    this.timeNowUpdateInterval = undefined;
  }

  updateTimeNow() {
    this.setState({ timeNow: Date.now() });
  }

  componentWillMount() {
    this.updateSkill(this.props.skillName);

    this.modalDefaultStyles = Modal.defaultStyles;

    Modal.defaultStyles.content.border = 'none';
    Modal.defaultStyles.content.background = 'transparent';
    Modal.defaultStyles.content.overflow = 'visible';
    Modal.defaultStyles.content.padding = '0';
    Modal.defaultStyles.content['maxWidth'] = '300px';
    Modal.defaultStyles.content['minHeight'] = '300px';
    Modal.defaultStyles.content['marginLeft'] = 'auto';
    Modal.defaultStyles.content['marginRight'] = 'auto';
    Modal.defaultStyles.content['left'] = '0';
    Modal.defaultStyles.content['top'] = '100';
    Modal.defaultStyles.content['right'] = '0';
  }

  componentDidMount() {
    this.timeNowUpdateInterval = setInterval(() => this.updateTimeNow(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timeNowUpdateInterval);
    Modal.defaultStyles = this.modalDefaultStyles;
  }

  updateSkill(name) {
    const url = `${ConfigMain.getBackendURL()}/skillGet?name=${name}`;
    const that = this;
    Axios.get(url)
      .then(function(response) {
        that.setState({ skillInfo: response.data });
      })
      .catch(function(error) {
        that.setState({ skillInfo: undefined });
      });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.skillInfo != this.state.skillInfo) {
      if (this.state.skillInfo) {
        if (this.props.userProfile && this.props.userProfile._id) {
          this.props.userInteractionPush(
            this.props.userProfile._id,
            UserInteractions.Types.PAGE_OPEN,
            UserInteractions.SubTypes.SKILL_VIEW,
            {
              skillId: this.state.skillInfo._id,
            },
          );
        }

        this.props.setSearchQuery(this.state.skillInfo.skill);

        this.props.fetchResults('jobs_indeed', this.state.skillInfo.skill);
        this.props.fetchResults('events_eventbrite', this.state.skillInfo.skill);
        this.props.fetchResults('courses_udemy', this.state.skillInfo.skill);
        this.props.fetchResults('gigs_freelancer', this.state.skillInfo.skill);
      }
    }

    if (prevState.isHangoutFormVisible != this.state.isHangoutFormVisible) {
      if (this.state.isHangoutFormVisible) {
        if (this.props.userProfile && this.props.userProfile._id) {
          this.props.userInteractionPush(
            this.props.userProfile._id,
            UserInteractions.Types.ACTION_EXECUTE,
            UserInteractions.SubTypes.DEEPDIVE_PREPARE,
            {
              skillId: this.state.skillInfo._id,
            },
          );
        }
      }
    }
  }

  toggleHangoutForm(skillInfo) {
    this.setState({ isHangoutFormVisible: true });
  }

  toggleIlluminateForm() {
    this.setState({ isIlluminateFormVisible: true });
  }

  toggleTrendScannerComponent() {
    this.setState({
      TrendScannerComponentVisible: true,
      isHangoutFormVisible: true,
    });
  }

  handleSelectCategory(e) {
    this.props.selectResultsCategory(e.currentTarget.id);
  }

  handleStartHangout(date) {
    const RandomInt = function RandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const hangout = {
      name: `Hangout for roadmap "${this.props.tree.name}"`,
      description: 'Hangout with John, and answer questions together',
      type: TaskTypes.DEEPDIVE,
      userName: `${this.props.userProfile.firstName} ${this.props.userProfile.lastName}`,
      userID: this.props.userProfile._id,
      isHidden: 0,
      creator: {
        _id: this.props.userProfile._id,
        firstName: this.props.userProfile.firstName,
        lastName: this.props.userProfile.lastName,
      },
      metaData: {
        subject: {
          roadmap: {
            _id: this.props.tree._id,
            name: this.props.tree.name,
          },
          skill: {
            _id: this.state.skillInfo._id,
            name: this.state.skillInfo.skill,
          },
        },
        participants: [
          {
            user: {
              _id: this.props.userProfile._id,
              firstName: this.props.userProfile.firstName,
              lastName: this.props.userProfile.lastName,
            },
            status: 'accepted',
            isCreator: true,
          },
        ], //userId, name, proposedTime(optional), status: sent/accepted/rejected
        ratings: [],
        time: date.getTime(),
        awardXP: RandomInt(30, 40),
      },
    };

    if (hangout.userName != '' && hangout.name != '' && hangout.description != '') {
      this.props.saveTask(hangout);

      if (this.props.userProfile && this.props.userProfile._id) {
        this.props.userInteractionPush(
          this.props.userProfile._id,
          UserInteractions.Types.ACTION_EXECUTE,
          UserInteractions.SubTypes.DEEPDIVE_START,
          {
            roadmapId: this.props.tree._id,
            skillId: this.state.skillInfo._id,
            deepdiveTime: date.getTime(),
          },
        );
      }
    }

    this.setState({ isHangoutFormVisible: false });
  }

  handleTimeChange(e) {
    e.preventDefault();
  }

  handleClose() {
    if (this.props.userProfile && this.props.userProfile._id && this.state.skillInfo) {
      this.props.userInteractionPush(
        this.props.userProfile._id,
        UserInteractions.Types.PAGE_CLOSE,
        UserInteractions.SubTypes.SKILL_VIEW,
        {
          skillId: this.state.skillInfo._id,
        },
      );
    }

    this.props.onCloseSkillBreakdown();
  }

  handleToggle() {
    this.setState({ IsDisplayForm: 'none' });
  }
  lastHangoutDateJoined() {
    let LatestHangoutDateJoined = undefined;

    if (this.props.userProfile.hangouts && this.props.userProfile.hangouts.length > 0) {
      const CurrentTree = this.props.tree;
      let hangoutsForCurrentTree = this.props.userProfile.hangouts.filter(hangout => {
        return hangout.treeId == CurrentTree._id;
      });

      if (hangoutsForCurrentTree.length > 0) {
        hangoutsForCurrentTree.sort((a, b) => {
          return a.dateJoined - b.dateJoined;
        });

        LatestHangoutDateJoined = hangoutsForCurrentTree[hangoutsForCurrentTree.length - 1].dateJoined;
      }
    }

    return LatestHangoutDateJoined;
  }

  onCloseModal() {
    this.setState({ isIlluminateFormVisible: false });
  }

  goToIlluminate(e) {
    e.preventDefault();
    this.setState({ redirectToTaskManagement: true });
  }

  render() {
    const that = this;
    const { redirectToTaskManagement } = this.state;

    const LatestHangoutDateJoined = this.lastHangoutDateJoined();

    const IsDeepdiveAbailable =
      !LatestHangoutDateJoined ||
      this.state.timeNow - LatestHangoutDateJoined >= this.props.tree.deepDiveIntervalLimit;

    const DeepDiveButtonText = !IsDeepdiveAbailable ? (
      <span>
        <span>DeepDive </span>
        <Countdown
          daysInHours={false}
          date={LatestHangoutDateJoined + this.props.tree.deepDiveIntervalLimit}
        />
      </span>
    ) : (
      <span>DeepDive</span>
    );

    const DeepdiveButtonClass = IsDeepdiveAbailable
      ? 'btn-md btn-outline-inverse deep-dive-button'
      : 'btn-md btn-outline-inverse deep-dive-button-disabled';

    if (redirectToTaskManagement) {
      return <Redirect to="/tasks" />;
    }
    return (
      <div className="container-fluid progress-browser-wrap" id="skill-break-down">
        <div className="col-md-1">
          <div className="skill-breakdown-solidity" style={{ display: this.state.IsDisplayForm }}>
            Solidity
          </div>
        </div>
        <div className="col-md-11">
          <div className="skillDescForm" style={{ display: this.state.IsDisplayForm }}>
            <div className="row">
              <div className="content-2-columns-left-title text-align-center">
                {this.props.skillName ? <span>{this.props.skillName}</span> : <span>Skill Breakdown</span>}
                <ActionLink
                  className="skill-breakdown-control pull-right"
                  id="button-arrow-back"
                  onClick={() => {
                    this.handleClose();
                  }}
                >
                  <span className="glyphicon glyphicon-arrow-left" />
                </ActionLink>
              </div>
            </div>
            {!this.state.skillInfo && (
              <div className="row">
                <div className="col-lg-12">
                  <h3>Skill not Found!!!</h3>
                </div>
              </div>
            )}
            <div className="row">
              <div className="col-lg-12 text-align-center">
                <p>{this.state.skillInfo && this.state.skillInfo.description}</p>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12">
                <h4>Related Sub-Skills</h4>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12">
                <ul id="related-topics">
                  {this.state.skillInfo &&
                    this.state.skillInfo.relatedTopics[0].split(',').map(function(skill, i) {
                      const skillNameTrimmed = skill.trim();
                      return (
                        <li key={i}>
                          <ActionLink onClick={() => that.updateSkill(skillNameTrimmed)}>
                            {skillNameTrimmed}
                          </ActionLink>
                        </li>
                      );
                    })}
                </ul>
              </div>
            </div>
            <div className="deep-dive-button-wrap">
              <button
                data-toggle="tooltip"
                title="A single player task to find out some basic questions around the topic!"
                type="button"
                className="btn-md btn-outline-inverse illuminate-button"
                onClick={() => this.toggleIlluminateForm()}
              >
                Illuminate
              </button>

              <button
                type="button"
                title="A 2 player task to combine forces to solve mutiple questions around this topic. Initiate one now! [1 per day]"
                className={DeepdiveButtonClass}
                onClick={IsDeepdiveAbailable ? () => this.toggleHangoutForm() : () => {}}
              >
                {DeepDiveButtonText}
              </button>
            </div>
            <div className="row">
              <Modal
                contentLabel="Illuminate"
                style={{ width: '200px' }}
                isOpen={this.state.isIlluminateFormVisible}
                onRequestClose={() => this.onCloseModal()}
              >
                <a
                  href="#"
                  className="glyphicon glyphicon-remove illuminate-popup-close-icon"
                  onClick={() => this.onCloseModal()}
                  parentSelector={getPopupParentElement}
                />
                <div className="container-fluid popup-new-project">
                  <span>
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="header">
                          <div>This will create a task in task manager!</div>
                        </div>
                      </div>
                    </div>
                  </span>
                  <hr />
                  <button
                    onClick={e => this.goToIlluminate(e)}
                    className="btn-md btn-outline-inverse illuminate-btn-go"
                  >
                    Go
                  </button>
                </div>
              </Modal>
            </div>
            <br />
          </div>
          <div className="row">
            {this.state.isHangoutFormVisible && (
              <HangoutSubmitForm
                skillInfo={this.state.skillInfo}
                onHandleStartHangout={date => this.handleStartHangout(date)}
                onTimeChange={e => handleTimeChange(e)}
                toogleTrenScan={() => this.toggleTrendScannerComponent()}
                handleToggle={() => this.handleToggle()}
              />
            )}
          </div>
          <br />
        </div>
        {this.state.TrendScannerComponentVisible && (
          <div className="row">
            <div className="col-lg-12">
              <div id="skill-breakdown-trend-scanner">
                <TrendScannerComponent
                  onHandleSelectCategory={e => this.handleSelectCategory(e)}
                  resultsSelectedCategory={this.props.resultsSelectedCategory}
                  isFetchInProgress={this.props.isFetchInProgress}
                  searchResults={this.props.searchResults}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

SkillBreakdown.propTypes = {
  userInteractionPush: PropTypes.func.isRequired,
  selectResultsCategory: PropTypes.func.isRequired,
  saveTask: PropTypes.func.isRequired,
  fetchResults: PropTypes.func.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
  resultsSelectedCategory: PropTypes.string.isRequired,
  searchResults: PropTypes.object.isRequired,
  isFetchInProgress: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  resultsSelectedCategory: state.resultsSelectedCategory,
  searchResults: state.searchResults,
  isFetchInProgress: state.isFetchInProgress,
});

const mapDispatchToProps = dispatch => ({
  userInteractionPush: bindActionCreators(userInteractionPush, dispatch),
  selectResultsCategory: bindActionCreators(selectResultsCategory, dispatch),
  fetchResults: bindActionCreators(fetchResults, dispatch),
  setSearchQuery: bindActionCreators(setSearchQuery, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SkillBreakdown);
