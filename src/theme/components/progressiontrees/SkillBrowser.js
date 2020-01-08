/*
    author: Alexander Zolotov
*/
import React from 'react';
import 'url-search-params-polyfill';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Modal from 'react-modal';
import { Redirect } from 'react-router';

import { Link } from 'react-router-dom';

import { Icon } from 'react-fa';

import ActionLink from '~/src/components/common/ActionLink';

import Axios from 'axios';
import ConfigMain from '~/configs/main';

import { saveTask } from '~/src/redux/actions/tasks';

import '~/src/theme/css/treebrowser.css';
import '~/src/theme/css/SkillBrowser.css';

import { selectResultsCategory } from '~/src/redux/actions/fetchResults';

import { fetchResults, setSearchQuery } from '~/src/redux/actions/fetchResults';

import { userInteractionPush } from '~/src/redux/actions/userInteractions';

import TrendScannerComponent from '~/src/theme/components/trends/TrendScannerComponent';
import HangoutSubmitForm from '~/src/theme/components/progressiontrees/HangoutSubmitForm';
import TaskTypes from '~/src/common/TaskTypes';

import UserInteractions from '~/src/common/UserInteractions';

import { getPopupParentElement } from '~/src/common/PopupUtils.js';

import Countdown from 'react-countdown-now';
import _ from 'lodash';
import Moment from 'moment';
import Async from 'async';

const RandomInt = function RandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

class SkillBrowser extends React.Component {
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
      HangoutPeriodLapsed: true,
      IlluminatePeriodLapsed: true,
      isLoading: true,
      tree: this.props.location.state.tree,
    };
    this.modalDefaultStyles = {};

    this.timeNowUpdateInterval = undefined;
  }

  updateTimeNow() {
    const LatestHangoutDateJoined = this.lastHangoutDateJoined();
    const LatestIlluminateDateAnswered = this.lastIlluminateDateAnswered();
    const CurrentTree = this.state.tree;

    const HangoutPeriodLapsed =
      !LatestHangoutDateJoined || Date.now() - LatestHangoutDateJoined >= CurrentTree.deepDiveIntervalLimit;
    if (HangoutPeriodLapsed !== this.state.HangoutPeriodLapsed) {
      this.setState({ HangoutPeriodLapsed: HangoutPeriodLapsed });
    }
    const IlluminatePeriodLapsed =
      !LatestIlluminateDateAnswered ||
      Date.now() - LatestIlluminateDateAnswered >= CurrentTree.deepDiveIntervalLimit;
    if (IlluminatePeriodLapsed !== this.state.IlluminatePeriodLapsed) {
      this.setState({ IlluminatePeriodLapsed: IlluminatePeriodLapsed });
    }
  }

  isTreeAdded() {
    const CurrentTree = this.state.tree;

    return this.props.userProfile.progressionTrees.find(tree => {
      return tree._id == CurrentTree._id;
    });
  }

  componentWillMount() {
    const URLParams = new URLSearchParams(this.props.location.search);
    const name = URLParams.get('name');

    if (name) {
      this.setState({ isLoading: true });
      Async.parallel(
        [
          Async.apply(this.updateSkill.bind(this), name),
          Async.apply(this.updateIlluminateTimer.bind(this)),
          Async.apply(this.updateDeepdiveTimer.bind(this)),
          Async.apply(this.updateDecodeTimer.bind(this)),
        ],
        () => {
          this.setState({ isLoading: false });
        },
      );
    }
    this.modalDefaultStyles = Modal.defaultStyles;

    Modal.defaultStyles.content.border = 'none';
    Modal.defaultStyles.content.background = 'transparent';
    Modal.defaultStyles.content.overflow = 'visible';
    Modal.defaultStyles.content.padding = '0';
    Modal.defaultStyles.content['maxWidth'] = '400px';
    Modal.defaultStyles.content['minHeight'] = '300px';
    Modal.defaultStyles.content['marginLeft'] = 'auto';
    Modal.defaultStyles.content['marginRight'] = 'auto';
    Modal.defaultStyles.content['left'] = '0px';
    Modal.defaultStyles.content['top'] = '150px';
    Modal.defaultStyles.content['right'] = '0px';
  }

  componentDidMount() {
    this.timeNowUpdateInterval = setInterval(() => this.updateTimeNow(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timeNowUpdateInterval);
    Modal.defaultStyles = this.modalDefaultStyles;
  }

  updateSkill(name, callback) {
    const url = `${ConfigMain.getBackendURL()}/skillGet?name=${name}`;
    const that = this;
    that.setState({ isLoading: true, isHangoutFormVisible: false });

    Axios.get(url)
      .then(function(response) {
        that.setState({ skillInfo: response.data });
        callback();
      })
      .catch(function(error) {
        that.setState({ skillInfo: undefined });
        callback();
      });
  }

  updateIlluminateTimer(callback) {
    const url = `${ConfigMain.getBackendURL()}/timer?roadmapId=${_.get(
      this,
      'state.tree._id',
    )}&type=Illuminate`;
    this.setState({ isLoading: true, isIlluminateFormVisible: false });
    Axios.get(url)
      .then(timerResp => {
        const illuminateTimer = _.get(timerResp, 'data');
        this.setState({ illuminateTimer });
        const trackerUrl = `${ConfigMain.getBackendURL()}/timers/track?timerId=${_.get(
          illuminateTimer,
          '_id',
        )}&userId=${_.get(this, 'props.userProfile._id')}`;
        Axios.get(trackerUrl).then(tracker => {
          this.setState({ illuminateTracker: _.get(tracker, 'data') });
          callback();
        });
      })
      .catch(err => {
        callback();
      });
  }

  updateDecodeTimer(callback) {
    const url = `${ConfigMain.getBackendURL()}/timer?roadmapId=${_.get(this, 'state.tree._id')}&type=Decode`;
    this.setState({ isLoading: true });
    Axios.get(url)
      .then(timerResp => {
        const decodeTimer = _.get(timerResp, 'data');
        this.setState({ decodeTimer });
        const trackerUrl = `${ConfigMain.getBackendURL()}/timers/track?timerId=${_.get(
          decodeTimer,
          '_id',
        )}&userId=${_.get(this, 'props.userProfile._id')}`;
        Axios.get(trackerUrl).then(tracker => {
          this.setState({ decodeTracker: _.get(tracker, 'data') });
          callback();
        });
      })
      .catch(err => {
        callback();
      });
  }

  updateDeepdiveTimer(callback) {
    const url = `${ConfigMain.getBackendURL()}/timer?roadmapId=${_.get(
      this,
      'state.tree._id',
    )}&type=Deepdive`;
    this.setState({ isLoading: true, isHangoutFormVisible: false });
    Axios.get(url)
      .then(timerResp => {
        const deepdiveTimer = _.get(timerResp, 'data');
        this.setState({ deepdiveTimer });
        const trackerUrl = `${ConfigMain.getBackendURL()}/timers/track?timerId=${_.get(
          deepdiveTimer,
          '_id',
        )}&userId=${_.get(this, 'props.userProfile._id')}`;
        Axios.get(trackerUrl).then(tracker => {
          this.setState({ deepdiveTracker: _.get(tracker, 'data') });
          callback();
        });
      })
      .catch(err => {
        callback();
      });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.location.search != this.props.location.search) {
      const URLParams = new URLSearchParams(this.props.location.search);
      const name = URLParams.get('name');

      if (name) {
        this.setState({ isLoading: true });
        Async.parallel(
          [
            Async.apply(this.updateSkill.bind(this), name),
            Async.apply(this.updateIlluminateTimer.bind(this)),
            Async.apply(this.updateDeepdiveTimer.bind(this)),
          ],
          () => {
            this.setState({ isLoading: false });
          },
        );
      }
    }

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

        /* this.props.setSearchQuery(this.state.skillInfo.skill);

         this.props.fetchResults("jobs_indeed", this.state.skillInfo.skill);
         this.props.fetchResults("events_eventbrite", this.state.skillInfo.skill);
         this.props.fetchResults("courses_udemy", this.state.skillInfo.skill);
         this.props.fetchResults("gigs_freelancer", this.state.skillInfo.skill);*/
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

    if (prevProps.isTaskSaveInProgress && !this.props.isTaskSaveInProgress) {
      if (
        this.props.lastSavedTask &&
        (this.props.lastSavedTask.type == TaskTypes.ILLUMINATE ||
          this.props.lastSavedTask.type == TaskTypes.DECODE)
      )
        this.setState({ redirectToTaskManagement: true });
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
    const CurrentTree = this.state.tree;

    const hangout = {
      name: `Hangout for roadmap "${CurrentTree.name}"`,
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
            _id: CurrentTree._id,
            name: CurrentTree.name,
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
            roadmapId: CurrentTree._id,
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

    this.props.history.goBack();
  }

  handleToggle() {
    this.setState({ IsDisplayForm: 'none' });
  }

  lastIlluminateDateAnswered() {
    let LatestIlluminateDateAnswered = undefined;

    if (this.props.userProfile.illuminates && this.props.userProfile.illuminates.length > 0) {
      const CurrentTree = this.state.tree;
      let illuminatessForCurrentTree = this.props.userProfile.illuminates.filter(illuminate => {
        return illuminate.treeId == CurrentTree._id;
      });

      if (illuminatessForCurrentTree.length > 0) {
        illuminatessForCurrentTree.sort((a, b) => {
          return a.dateJoined - b.dateJoined;
        });

        LatestIlluminateDateAnswered =
          illuminatessForCurrentTree[illuminatessForCurrentTree.length - 1].dateJoined;
      }
    }

    return LatestIlluminateDateAnswered;
  }

  lastHangoutDateJoined() {
    let LatestHangoutDateJoined = undefined;

    if (this.props.userProfile.hangouts && this.props.userProfile.hangouts.length > 0) {
      const CurrentTree = this.state.tree;
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
    this.setState({ isIlluminateFormVisible: false, isHangoutFormVisible: false });
  }

  goToIlluminate(e) {
    const CurrentTree = this.state.tree;

    const illuminate = {
      name: `Illuminate for roadmap "${CurrentTree.name}"`,
      description: `Illuminate for roadmap "${CurrentTree.name}"`,
      type: TaskTypes.ILLUMINATE,
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
            _id: CurrentTree._id,
            name: CurrentTree.name,
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
        ],
        ratings: [],
        time: Date.now(),
        awardXP: RandomInt(30, 40),
      },
    };

    if (illuminate.userName != '' && illuminate.name != '' && illuminate.description != '') {
      this.props.saveTask(illuminate);
    }
  }

  goToDecode(e) {
    const CurrentTree = this.state.tree;

    if (!this.isActivityUnlocked(CurrentTree._id, 'decode')) {
      return;
    }

    const decode = {
      name: `Decode roadmap "${CurrentTree.name}"`,
      description: `Decode for roadmap "${CurrentTree.name}"`,
      type: TaskTypes.DECODE,
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
            _id: CurrentTree._id,
            name: CurrentTree.name,
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
        ],
        ratings: [],
        time: Date.now(),
        awardXP: RandomInt(30, 40),
      },
    };

    if (decode.userName != '' && decode.name != '' && decode.description != '') {
      this.props.saveTask(decode);
    }
  }

  flipSkillCard(e) {
    e.target.parentNode.parentNode.parentNode.parentNode.classList.toggle('hover');
  }

  nextRefresh(type) {
    const timer = _.get(this, `state.${_.lowerCase(type)}Timer`);
    const sgOffset = Moment()
      .utcOffset('+08:00')
      .startOf('day');
    let nextRefresh;

    switch (_.get(timer, 'refresh')) {
      case 'Daily':
        nextRefresh = sgOffset.add(1, 'day');
        break;
      case 'Weekly':
        nextRefresh = sgOffset.day(8);
        break;
      case 'Monthly':
        nextRefresh = sgOffset.startOf('month').add(1, 'month');
        break;
    }

    return nextRefresh.toDate();
  }

  redirectToTaskMngt() {
    this.setState({ redirectToTaskManagement: true });
  }

  getTaskUnlockLevelRequirement(type) {
    let level = 1;

    if (this.props.taskActivityUnlockRequirements && this.props.taskActivityUnlockRequirements[type]) {
      level = this.props.taskActivityUnlockRequirements[type].minLevel;
    }
    return level;
  }

  isActivityUnlocked(treeId, type) {
    let isUnlocked = true;

    const progressionForProgressionTree = this.props.progressionTreeLevels.find(treeLevel => {
      return treeLevel._id === treeId;
    });

    if (progressionForProgressionTree) {
      isUnlocked = progressionForProgressionTree.level >= this.getTaskUnlockLevelRequirement(type);
    }

    return isUnlocked;
  }

  RenderDecodeFlipcard() {
    const CurrentTree = this.state.tree;

    const decodeTrackerCount = _.get(this, 'state.decodeTracker.count', 0);
    const decodeTimerQuota = _.get(this, 'state.decodeTimer.quota', 0);
    const IsDecodeAvailable = !decodeTrackerCount || decodeTrackerCount < decodeTimerQuota;

    if (!this.isActivityUnlocked(CurrentTree._id, 'decode')) {
      return (
        <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12 pskill-card-item">
          <div className="pskill-card-lock">
            <div className="pskill-card-body">
              <h4 className="pskill-card-title-lock">{this.getTaskUnlockLevelRequirement('decode')}</h4>
              <h4 className="pskill-card-subtitle-lock">level</h4>
              <h3 className="pskill-card-heading">DECODE</h3>
              <p className="pskill-card-text">
                A single player activity with pre-defined answers to validate your understanding of a topic
              </p>
              <p className="pskill-duration" style={{ color: 'black' }}>
                Once a week
              </p>
              <p className="pskill-reward" style={{ color: 'black' }}>
                Rewards : 5 SOQQ Token
              </p>
            </div>
          </div>
        </div>
      );
    } else if (!IsDecodeAvailable) {
      return (
        <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12 pskill-card-item">
          <div className="pskill-timer">
            <div className="pskill-card-front pskill-timer-active">
              <div className="pskill-card-body">
                <h4 className="pskill-card-title">{this.getTaskUnlockLevelRequirement('decode')}</h4>
                <h4 className="pskill-card-subtitle">level</h4>
                <h3 className="pskill-card-heading">DECODE</h3>
                <p className="pskill-card-text">
                  A single player activity with pre-defined answers to validate your understanding of a topic
                </p>
              </div>
              <div className="pskill-footer">
                <p className="pskill-duration">Once a week</p>
                <p className="pskill-reward">Rewards : 5 SOQQ Token</p>
              </div>
              <div className="pskill-btn-group">
                <button disabled="disabled" className="pskill-btn pskill-start">
                  START
                </button>
                <button disabled="disabled" className="pskill-btn pskill-view">
                  VIEW
                </button>
              </div>
            </div>
            <div id="loader-wrapper">
              <div id="loader" />
            </div>
            <div className="pskill-timer-text">
              <Countdown daysInHours={false} date={this.nextRefresh('decode')} />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12 pskill-card-item">
        <div className="pskill-flipper">
          <div className="pskill-card-front">
            <div className="pskill-card-body">
              <h4 className="pskill-card-title">{this.getTaskUnlockLevelRequirement('decode')}</h4>
              <h4 className="pskill-card-subtitle">level</h4>
              <h3 className="pskill-card-heading">DECODE</h3>
              <p className="pskill-card-text">
                A single player activity with pre-defined answers to validate your understanding of a topic
              </p>
            </div>
            <div className="pskill-footer">
              <p className="pskill-duration">Once a week</p>
              <p className="pskill-reward">Rewards : 5 SOQQ Token</p>
            </div>
            <div className="pskill-btn-group">
              <button className="pskill-btn pskill-start" onClick={e => this.goToDecode(e)}>
                START
              </button>
              <button className="pskill-btn pskill-view" onClick={e => this.flipSkillCard(e)}>
                VIEW
              </button>
            </div>￼
          </div>
          <div className="pskill-card-back">
            <div className="pskill-card-body">
              <h4 className="sample-question-header">SAMPLE QUESTIONS</h4>
              <ul className="sample-question">
                <li>What is digitisation?</li>
                <li>How is it used?</li>
                <li>Why should companies look into it?</li>
              </ul>
            </div>
            <div className="pskill-btn-group">
              <button className="pskill-btn pskill-start" onClick={() => this.goToDecode()}>
                START
              </button>
              <button className="pskill-btn pskill-view" onClick={e => this.flipSkillCard(e)}>
                BACK
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    if (this.state.isLoading) {
      return (
        <div className="container-fluid progress-browser-wrap" id="skill-break-down">
          <div className="col-md-1">
            <div className="skill-breakdown-solidity">
              Loading...<Icon spin name="spinner" />
            </div>
          </div>
        </div>
      );
    }

    const that = this;
    const { redirectToTaskManagement } = this.state;

    const LatestHangoutDateJoined = this.lastHangoutDateJoined();
    const LatestIlluminateDateAnswered = this.lastIlluminateDateAnswered();
    const CurrentTree = this.state.tree;

    // const IsDeepdiveAvailable = this.state.HangoutPeriodLapsed;
    // const IsIlluminateAvailable = this.state.IlluminatePeriodLapsed;

    const deepdiveTrackerCount = _.get(this, 'state.deepdiveTracker.count', 0);
    const deepdiveTimerQuota = _.get(this, 'state.deepdiveTimer.quota', 0);
    const IsDeepdiveAvailable = !deepdiveTrackerCount || deepdiveTrackerCount < deepdiveTimerQuota;

    const illuminateTrackerCount = _.get(this, 'state.illuminateTracker.count', 0);
    const illuminateTimerQuota = _.get(this, 'state.illuminateTimer.quota', 0);
    const IsIlluminateAvailable = !illuminateTrackerCount || illuminateTrackerCount < illuminateTimerQuota;

    // const IsDeepdiveAvailable = !LatestHangoutDateJoined || this.state.timeNow - LatestHangoutDateJoined >= CurrentTree.deepDiveIntervalLimit;
    // const IsIlluminateAvailable = !LatestIlluminateDateAnswered || this.state.timeNow - LatestIlluminateDateAnswered >= CurrentTree.deepDiveIntervalLimit;
    const DeepDiveButtonText = !IsDeepdiveAvailable ? (
      <span>
        <span>DeepDive </span>
        <Countdown daysInHours={false} date={LatestHangoutDateJoined + CurrentTree.deepDiveIntervalLimit} />
      </span>
    ) : (
      <span>DeepDive</span>
    );

    const IlluminateButtonText = !IsIlluminateAvailable ? (
      <span>
        <span>Illuminate </span>
        <Countdown
          daysInHours={false}
          date={LatestIlluminateDateAnswered + CurrentTree.deepDiveIntervalLimit}
        />
      </span>
    ) : (
      <span>Illuminate</span>
    );

    const IlluminateTimerText = !IsIlluminateAvailable ? (
      <Countdown daysInHours={false} date={LatestHangoutDateJoined + CurrentTree.deepDiveIntervalLimit} />
    ) : null;
    const DeepDiveTimerText = !IsDeepdiveAvailable ? (
      <Countdown daysInHours={false} date={LatestHangoutDateJoined + CurrentTree.deepDiveIntervalLimit} />
    ) : null;

    const DeepdiveButtonClass = IsDeepdiveAvailable
      ? 'btn-md btn-outline-inverse deep-dive-button'
      : 'btn-md btn-outline-inverse deep-dive-button-disabled';

    const IlluminateButtonClass = IsIlluminateAvailable
      ? 'btn-md btn-outline-inverse illuminate-button'
      : 'btn-md btn-outline-inverse illuminate-button-disabled';

    if (redirectToTaskManagement) {
      return <Redirect to="/tasks" />;
    }

    const DecodeFlipCard = this.RenderDecodeFlipcard();

    let IlluminateFlipCard;
    let DeepDiveFlipCard;
    if (IsIlluminateAvailable) {
      IlluminateFlipCard = (
        <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12 pskill-card-item">
          <div className="pskill-flipper">
            <div className="pskill-card-front">
              <div className="pskill-card-body">
                <h4 className="pskill-card-title">{this.getTaskUnlockLevelRequirement('illuminate')}</h4>
                <h4 className="pskill-card-subtitle">level</h4>
                <h3 className="pskill-card-heading">ILLUMINATE</h3>
                <p className="pskill-card-text">
                  A single player activity for you to research and answer 3 questions posted by the system in
                  30 mins
                </p>
              </div>
              <div className="pskill-footer">
                <p className="pskill-duration">Once a day</p>
                <p className="pskill-reward">Rewards : 1 SOQQ Token</p>
              </div>
              <div className="pskill-btn-group">
                <button className="pskill-btn pskill-start" onClick={e => this.goToIlluminate(e)}>
                  START
                </button>
                <button className="pskill-btn pskill-view" onClick={e => this.flipSkillCard(e)}>
                  VIEW
                </button>
              </div>
            </div>
            <div className="pskill-card-back">
              <div className="pskill-card-body">
                <h4 className="sample-question-header">SAMPLE QUESTIONS</h4>
                <ul className="sample-question">
                  <li>What is digitisation?</li>
                  <li>How is it used?</li>
                  <li>Why should companies look into it?</li>
                </ul>
              </div>
              <div className="pskill-btn-group">
                <button className="pskill-btn pskill-start" onClick={() => this.toggleIlluminateForm()}>
                  START
                </button>
                <button className="pskill-btn pskill-view" onClick={e => this.flipSkillCard(e)}>
                  BACK
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      IlluminateFlipCard = (
        <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12 pskill-card-item">
          <div className="pskill-timer">
            <div className="pskill-card-front pskill-timer-active">
              <div className="pskill-card-body">
                <h4 className="pskill-card-title">{this.getTaskUnlockLevelRequirement('illuminate')}</h4>
                <h4 className="pskill-card-subtitle">level</h4>
                <h3 className="pskill-card-heading">ILLUMINATE</h3>
                <p className="pskill-card-text">
                  A single player activity for you to research and answer 3 questions posted by the system in
                  30 mins
                </p>
              </div>
              <div className="pskill-footer">
                <p className="pskill-duration">Once a day</p>
                <p className="pskill-reward">Rewards : 1 SOQQ Token</p>
              </div>
              <div className="pskill-btn-group">
                <button disabled="disabled" className="pskill-btn pskill-start">
                  START
                </button>
                <button disabled="disabled" className="pskill-btn pskill-view">
                  VIEW
                </button>
              </div>
            </div>
            <div id="loader-wrapper">
              <div id="loader" />
            </div>
            <div className="pskill-timer-text">
              <Countdown daysInHours={false} date={this.nextRefresh('illuminate')} />
            </div>
          </div>
        </div>
      );
    }

    if (IsDeepdiveAvailable) {
      DeepDiveFlipCard = (
        <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12 pskill-card-item">
          <div className="pskill-flipper">
            <div className="pskill-card-front">
              <div className="pskill-card-body">
                <h4 className="pskill-card-title">{this.getTaskUnlockLevelRequirement('deepdive')}</h4>
                <h4 className="pskill-card-subtitle">level</h4>
                <h3 className="pskill-card-heading">DEEP DIVE</h3>
                <p className="pskill-card-text">
                  A 2 player activity for you and a friend to research and answer 10 questions posted by the
                  system in 30 mins
                </p>
              </div>
              <div className="pskill-footer">
                <p className="pskill-duration">Once a week</p>
                <p className="pskill-reward">Rewards : 10 SOQQ Token</p>
              </div>
              <div className="pskill-btn-group">
                <button className="pskill-btn pskill-start btn" onClick={() => this.toggleHangoutForm()}>
                  START
                </button>
                <button className="pskill-btn pskill-view" onClick={e => this.flipSkillCard(e)}>
                  VIEW
                </button>
              </div>
            </div>
            <div className="pskill-card-back">
              <div className="pskill-card-body">
                <h4 className="sample-question-header">SAMPLE QUESTIONS</h4>
                <ul className="sample-question">
                  <li>What is digitisation?</li>
                  <li>How is it used?</li>
                  <li>Why should companies look into it?</li>
                </ul>
              </div>
              <div className="pskill-btn-group">
                <button className="pskill-btn pskill-start btn" onClick={() => this.toggleHangoutForm()}>
                  START
                </button>
                <button className="pskill-btn pskill-view" onClick={e => this.flipSkillCard(e)}>
                  BACK
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      DeepDiveFlipCard = (
        <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12 pskill-card-item">
          <div className="pskill-timer">
            <div className="pskill-card-front pskill-timer-active">
              <div className="pskill-card-body">
                <h4 className="pskill-card-title">{this.getTaskUnlockLevelRequirement('deepdive')}</h4>
                <h4 className="pskill-card-subtitle">level</h4>
                <h3 className="pskill-card-heading">DEEPDIVE</h3>
                <p className="pskill-card-text">
                  A 2 player activity for you and a friend to research and answer 10 questions posted by the
                  system in 30 mins
                </p>
              </div>
              <div className="pskill-footer">
                <p className="pskill-duration">Once a week</p>
                <p className="pskill-reward">Rewards : 10 SOQQ Token</p>
              </div>
              <div className="pskill-btn-group">
                <button disabled="disabled" className="pskill-btn pskill-start">
                  START
                </button>
                <button disabled="disabled" className="pskill-btn pskill-view">
                  VIEW
                </button>
              </div>
            </div>
            <div id="loader-wrapper">
              <div id="loader" />
            </div>
            <div className="pskill-timer-text">
              <Countdown daysInHours={false} date={this.nextRefresh('deepdive')} />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="skill-break-down">
        <div className="skill-browser-header row">
          {this.state.skillInfo.skill ? (
            <h3 className="my-progress-heading pull-left">{this.state.skillInfo.skill}</h3>
          ) : (
            <span>Skill Breakdown</span>
          )}
          <ActionLink
            className="skill-breakdown-control pull-right"
            id="button-arrow-back"
            onClick={() => this.handleClose()}
          >
            <span className="glyphicon glyphicon-arrow-left" />
          </ActionLink>
        </div>
        <div className="skill-browser-desc row">
          <p>{this.state.skillInfo && this.state.skillInfo.description}</p>
        </div>
        <br />
        <div className="related-subskills-header row">RELATED SUB-SKILLS</div>
        <div id="related-topics row">
          {this.state.skillInfo &&
            this.state.skillInfo.relatedTopics[0].split(',').map(function(skill, i) {
              const skillNameTrimmed = skill.trim();
              return (
                <div className="row" key={i}>
                  <span className="fa fa-circle-o" style={{ color: 'red' }} />
                  <Link
                    className="related-topic"
                    key={i}
                    to={{
                      pathname: `/skillBrowser`,
                      state: that.props.location.state,
                      search: `?name=${skillNameTrimmed}`,
                    }}
                  >
                    {skillNameTrimmed}
                  </Link>
                </div>
              );
            })}
        </div>
        <br />
        <div className="skill-browser-header row" style={{ borderBottom: '1px solid #868686' }}>
          <h3 className="my-progress-heading pull-left">MY PROGRESSION SKILL</h3>
        </div>
        <div className="my-progression-skillset row">
          {this.isTreeAdded() && IlluminateFlipCard}

          {this.isTreeAdded() && DeepDiveFlipCard}

          {this.isTreeAdded() && DecodeFlipCard}

          {/*<div className="col-lg-3 col-md-4 col-sm-6 col-xs-12 pskill-card-item">
                <div className="pskill-card-lock">
                    <div className="pskill-card-body">
                        <h4 className="pskill-card-title-lock">5</h4>
                        <h4 className="pskill-card-subtitle-lock">level</h4>
                        <h3 className="pskill-card-heading">DECODE</h3>
                        <p className="pskill-card-text">A single player activity with pre-defined
                                  answers to validate your understanding of a topic</p>
                        <p className="pskill-duration" style={{color:'black'}}>Once a week</p>
                        <p className="pskill-reward" style={{color:'black'}}>Rewards : 5 SOQQ Token</p>
                    </div>
                </div>
        </div>*/}

          <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12 pskill-card-item">
            <div className="pskill-card-lock">
              <div className="pskill-card-body">
                <h4 className="pskill-card-title-lock">9</h4>
                <h4 className="pskill-card-subtitle-lock">level</h4>
                <h3 className="pskill-card-heading">BRAINSTORM</h3>
                <p className="pskill-card-text">
                  Group player activity to brainstorm solutions for a specific use case
                </p>
                <p className="pskill-duration" style={{ color: 'black' }}>
                  Once a week
                </p>
                <p className="pskill-reward" style={{ color: 'black' }}>
                  Rewards : 10 SOQQ Token
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <Modal
            contentLabel="Illuminate"
            style={{ width: '200px' }}
            isOpen={this.state.isIlluminateFormVisible}
            onRequestClose={() => this.onCloseModal()}
          >
            <ActionLink
              href="#"
              className="glyphicon glyphicon-remove modal-close-button"
              onClick={() => this.onCloseModal()}
            />

            <div className="modal-popup">
              <br />
              <div className="row text-center">
                <i className="fa fa-3x fa-check-circle" style={{ color: 'green' }} />
                <br />
              </div>
              <p className="text-center">Your Task has been started (flexible)</p>
              <br />
              <div className="row text-center">
                <Countdown
                  daysInHours={false}
                  date={Date.now() + 3000}
                  onComplete={() => this.redirectToTaskMngt()}
                />
              </div>
              {/* <div className="row text-center">
                        <button onClick={(e)=> this.goToIlluminate(e) }
                        className="btn-md btn-outline-inverse illuminate-go-btn">Go To Task Manager</button>
                    </div> */}
            </div>
          </Modal>

          <div className="row">
            <HangoutSubmitForm
              isHangoutFormVisible={this.state.isHangoutFormVisible}
              skillInfo={this.state.skillInfo}
              onHandleStartHangout={date => this.handleStartHangout(date)}
              onTimeChange={e => handleTimeChange(e)}
              toogleTrenScan={() => this.toggleTrendScannerComponent()}
              handleToggle={() => this.handleToggle()}
              onCloseModal={() => this.onCloseModal()}
            />
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
      </div>
    );
  }
}

SkillBrowser.propTypes = {
  userInteractionPush: PropTypes.func.isRequired,
  selectResultsCategory: PropTypes.func.isRequired,
  saveTask: PropTypes.func.isRequired,
  fetchResults: PropTypes.func.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
  resultsSelectedCategory: PropTypes.string.isRequired,
  searchResults: PropTypes.object.isRequired,
  isFetchInProgress: PropTypes.bool.isRequired,
  lastSavedTask: PropTypes.object.isRequired,
  taskActivityUnlockRequirements: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  resultsSelectedCategory: state.resultsSelectedCategory,
  searchResults: state.searchResults,
  saveTask,
  isFetchInProgress: state.isFetchInProgress,
  isTaskSaveInProgress: state.tasks.isSaveInProgress,
  lastSavedTask: state.lastSavedTask,
  taskActivityUnlockRequirements: state.progression.taskActivityUnlockRequirements,
  progressionTreeLevels: state.userProfile.profile.progressionTreeLevels,
});

const mapDispatchToProps = dispatch => ({
  userInteractionPush: bindActionCreators(userInteractionPush, dispatch),
  selectResultsCategory: bindActionCreators(selectResultsCategory, dispatch),
  fetchResults: bindActionCreators(fetchResults, dispatch),
  setSearchQuery: bindActionCreators(setSearchQuery, dispatch),
  saveTask: bindActionCreators(saveTask, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SkillBrowser);
