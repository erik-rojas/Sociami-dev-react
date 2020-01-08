/*
    author: Alexander Zolotov
*/

import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Icon } from 'react-fa';

import { withCookies, Cookies } from 'react-cookie';

import Axios from 'axios';

import PubSub from 'pubsub-js';

import ConfigMain from '~/configs/main';

import ActionLink from '~/src/components/common/ActionLink';

import TaskTypes from '~/src/common/TaskTypes';

import QuestionTypes from '~/src/common/QuestionTypes';

import QuestionAnswersFlow from '~/src/theme/components/tasks/QuestionAnswersFlow';

import '~/src/theme/appearance.css';
import '~/src/theme/layout.css';
import '~/src/theme/css/taskBrowser.css';
import _ from 'lodash';

import { setLastStartedTask, hangoutAnswersSave } from '~/src/redux/actions/tasks';

class AnswerQuestions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTask: this.props.currentTask,
      questions: [],

      answersMy: {},

      answersPartner: {},

      answersOtherUsers: [],

      isTaskLoading: false,
      isQuestionsLoading: false,

      isAnswersFetchFromServerInProgress: false,
      isAnswersFetchFromCookiesInProgress: false,

      isLoading: false,
    };

    this.getPartnerProfile = this.getPartnerProfile.bind(this);
  }

  getAnswerMy(questionId) {
    return this.state.answersMy && this.state.answersMy[questionId]
      ? this.state.answersMy[questionId].text
      : '';
  }

  getAnswerPartner(questionId) {
    return this.state.answersPartner && this.state.answersPartner[questionId]
      ? this.state.answersPartner[questionId].text
      : '';
  }

  handleAnswerInput(e) {
    if (e.target.id.startsWith('answer_your_')) {
      const questionId = e.target.id.replace('answer_your_', '');

      if (questionId) {
        let answersMyCopy = Object.assign({}, this.state.answersMy);
        answersMyCopy[questionId] = { text: e.target.value, timeChanged: Date.now() };

        this.setState({ answersMy: answersMyCopy });
      }
    }
  }

  handleAnswerCheckbox(e) {
    const questionId =
      e.target.parentElement &&
      e.target.parentElement.parentElement &&
      e.target.parentElement.parentElement.parentElement &&
      e.target.parentElement.parentElement.parentElement.id
        ? e.target.parentElement.parentElement.parentElement.id.replace('answer_your_', '')
        : undefined;

    if (questionId) {
      let answersMyCopy = Object.assign({}, this.state.answersMy);

      let optionsCopy =
        answersMyCopy[questionId] && answersMyCopy[questionId].options
          ? answersMyCopy[questionId].options.splice(0)
          : [];

      //force check other options out
      for (let i = 0; i < optionsCopy.length; ++i) {
        optionsCopy[i] = false;
      }

      optionsCopy[Number(e.target.id)] = e.target.checked;

      answersMyCopy[questionId] = { options: optionsCopy, timeChanged: Date.now() };

      this.setState({ answersMy: answersMyCopy });
    }
  }

  handleAnswerTrueFalse(e) {
    const questionId =
      e.target.parentElement &&
      e.target.parentElement.parentElement &&
      e.target.parentElement.parentElement.id
        ? e.target.parentElement.parentElement.id.replace('answer_your_', '')
        : undefined;

    if (questionId) {
      let answersMyCopy = Object.assign({}, this.state.answersMy);
      answersMyCopy[questionId] = {
        isTrue: e.target.value === 'true' && e.target.checked,
        timeChanged: Date.now(),
      };

      this.setState({ answersMy: answersMyCopy });
    }
  }

  handleQuestionsGetComplete(questions) {
    const currentTaskType = this.state.currentTask.type;

    const questionsFiltered = questions.filter(question => {
      return currentTaskType === TaskTypes.DECODE || question.type === QuestionTypes.SIMPLE;
    });

    let answersMy = {};

    questionsFiltered.forEach(question => {
      switch (question.type) {
        case QuestionTypes.TRUEFALSE: {
          answersMy[question._id] = { isTrue: false };
          break;
        }
        case QuestionTypes.MULTIPLECHOICE: {
          answersMy[question._id] = {
            options: question.answers.map(() => {
              return false;
            }),
          };
          break;
        }
        default: {
          answersMy[question._id] = { text: '' };
          break;
        }
      }
    });

    this.setState({
      questions: questionsFiltered,
      answersMy: answersMy,
      isQuestionsLoading: false,
    });
  }

  serverEventAnswerUpdated(msg, data) {
    console.log(`%cServer Event Received: ${msg}`, 'color:green;background:grey;');
    console.dir(data);
    if (data.eventType == 'answer_updated') {
      if (this.state.questions.length > 0) {
        const questionIds = this.state.questions.map(q => q._id).join(',');
        if (questionIds) {
          const Partner = this.getPartnerProfile();
          Axios.get(
            `${ConfigMain.getBackendURL()}/hangoutAnswersForQuestions?questionIds=${questionIds}&partnerId=${
              Partner.user._id
            }&myId=${this.props.userProfile._id}`,
          )
            .then(response => {
              this.setState({
                answersOtherUsers: response.data,
                isAnswersFetchFromServerInProgress: false,
              });
            })
            .catch(error => {
              console.log(error);
            });
        }
        const that = this;
        Axios.get(
          `${ConfigMain.getBackendURL()}/hangoutAnswerGetForTask?taskId=${this.state.currentTask._id}`,
        )
          .then(response => this.fetchUserAnswersFromServerMySuccess(response, that))
          .catch(error => {
            console.log(error);
          });
      }
    }
  }

  componentWillUnmount() {
    if (this.token_server_event_answer_updated) {
      PubSub.unsubscribe(this.token_server_event_answer_updated);
      this.token_server_event_answer_updated = undefined;
    }
  }

  componentWillMount() {
    if (!this.token_server_event_answer_updated) {
      this.token_server_event_answer_updated = PubSub.subscribe(
        'answer_updated',
        this.serverEventAnswerUpdated.bind(this),
      );
    }
  }

  componentDidMount() {
    const that = this;
    if (this.state.currentTask && this.state.currentTask.type === TaskTypes.DEEPDIVE) {
      that.setState({ isQuestionsLoading: true });
      Axios.get(
        `${ConfigMain.getBackendURL()}/questionsGet?roadmapSkill=${
          this.state.currentTask.metaData.subject.skill.name
        }&type=${this.state.currentTask.type}`,
      )
        .then(response => {
          that.handleQuestionsGetComplete(response.data);
          const questionIds = response.data.map(q => q._id).join(',');
          const Partner = that.getPartnerProfile();
          that.fetchAnswersOtherUsersFromServer(questionIds, Partner.user._id, this.props.userProfile._id);
        })
        .catch(error => {
          that.setState({ isQuestionsLoading: false });
          console.log(error);
        });

      this.fetchUserAnswersFromCookies();

      this.fetchUserAnswersFromServerMy();
    } else {
      that.setState({ isQuestionsLoading: true });

      Axios.get(
        `${ConfigMain.getBackendURL()}/questionsGet?roadmapSkill=${
          this.state.currentTask.metaData.subject.skill.name
        }&type=${this.state.currentTask.type}`,
      )
        .then(response => {
          that.handleQuestionsGetComplete(response.data);
        })
        .catch(error => {
          that.setState({ isQuestionsLoading: false });
          console.log(error);
        });
    }

    this.props.setLastStartedTask({});
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.isQuestionsLoading != prevState.isQuestionsLoading ||
      this.state.isTaskLoading != prevState.isTaskLoading ||
      prevState.isAnswersFetchFromCookiesInProgress != this.state.isAnswersFetchFromCookiesInProgress ||
      prevState.isAnswersFetchFromServerInProgress != this.state.isAnswersFetchFromServerInProgress ||
      prevProps.isTasksUpdateInProgress != this.props.isTasksUpdateInProgress
    ) {
      this.setState({
        isLoading:
          this.state.isQuestionsLoading ||
          this.state.isTaskLoading ||
          this.state.isAnswersFetchFromCookiesInProgress ||
          this.state.isAnswersFetchFromServerInProgress ||
          this.props.isTasksUpdateInProgress,
      });
    }

    if (this.state.answersMy != prevState.answersMy) {
      this.storeUserAnswersToCookies(this.state.answersMy);
    }

    if (prevProps.isTasksUpdateInProgress != this.props.isTasksUpdateInProgress) {
      /* deprecate this for now, add logic on when to show modal or when to call onSubmitComplete
      *  if (!this.props.isTasksUpdateInProgress) {
      *   this.props.onSubmitComplete();
      * }
      */
    }
  }

  fetchUserAnswersFromServerMy() {
    if (this.state.currentTask._id) {
      this.setState({ isAnswersFetchFromServerInProgress: true });
      const CurrentUserID = this.props.userProfile._id;

      const Partner = this.getPartnerProfile();

      const that = this;

      Axios.get(`${ConfigMain.getBackendURL()}/hangoutAnswerGetForTask?taskId=${this.state.currentTask._id}`)
        .then(response => this.fetchUserAnswersFromServerMySuccess(response, that))
        .catch(error => {
          that.setState({ isAnswersFetchFromServerInProgress: false });
          console.log(error);
        });
    }
  }

  getPartnerProfile() {
    const CurrentUserID = this.props.userProfile._id;

    const Partner = this.state.currentTask.metaData.participants.find(function(participant) {
      return participant.user._id != CurrentUserID;
    });

    return Partner;
  }

  fetchUserAnswersFromServerMySuccess(response, that) {
    const answers = response.data;

    const CurrentUserID = that.props.userProfile._id;

    const Partner = that.getPartnerProfile();

    const foundAnswersForUser = answers.userAnswers.find(function(userAnswer) {
      return userAnswer._id == CurrentUserID;
    });

    const foundAnswersForPartner = answers.userAnswers.find(function(userAnswer) {
      return Partner && userAnswer._id == Partner.user._id;
    });

    let newAnswersMy = Object.assign({}, that.state.answersMy);

    if (foundAnswersForUser) {
      newAnswersMy = foundAnswersForUser.answers;
    }

    let newAnswersPartner = Object.assign({}, that.state.answersPartner);

    if (foundAnswersForPartner) {
      newAnswersPartner = foundAnswersForPartner.answers;
    }

    this.storeUserAnswersToCookies(newAnswersMy);

    that.setState({
      answersMy: newAnswersMy,
      answersPartner: newAnswersPartner,
      isAnswersFetchFromServerInProgress: false,
    });
  }

  fetchAnswersOtherUsersFromServer(questionIds, partnerId, myId) {
    if (questionIds) {
      this.setState({ isAnswersFetchFromServerInProgress: true });
      Axios.get(
        `${ConfigMain.getBackendURL()}/hangoutAnswersForQuestions?questionIds=${questionIds}&partnerId=${partnerId}&myId=${myId}`,
      )
        .then(response => {
          this.setState({
            answersOtherUsers: response.data,
            isAnswersFetchFromServerInProgress: false,
          });
        })
        .catch(error => {
          this.setState({ isAnswersFetchFromServerInProgress: false });
          console.log(error);
        });
    }
  }

  storeUserAnswersToCookies(answersMy) {
    if (this.state.currentTask._id) {
      const { cookies } = this.props;

      let dateExpire = new Date();
      dateExpire.setTime(dateExpire.getTime() + ConfigMain.getCookiesExpirationPeriod());

      let options = { path: '/', expires: dateExpire };

      let answersForTask = cookies.get(`answers_for_task_${this.state.currentTask._id}`);
      if (!answersForTask) {
        answersForTask = {};
      }

      answersForTask[this.props.userProfile._id] = answersMy;

      cookies.set(`answers_for_task_${this.state.currentTask._id}`, answersForTask, options);
    }
  }

  fetchUserAnswersFromCookies() {
    if (this.state.currentTask._id) {
      this.setState({ isAnswersFetchFromCookiesInProgress: true });
      const { cookies } = this.props;
      const answersForTask = cookies.get(`answers_for_task_${this.state.currentTask._id}`);

      if (answersForTask && answersForTask[this.props.userProfile._id]) {
        this.setState({
          answersMy: answersForTask[this.props.userProfile._id],
          isAnswersFetchFromCookiesInProgress: false,
        });
      } else {
        this.setState({ isAnswersFetchFromCookiesInProgress: false });
      }
    }
  }

  handlePopupSubmit(e) {
    e.preventDefault();

    const that = this;
    const { props, state, _getAchievementWithRoadmap } = that;

    const body = {
      userId: props.userProfile._id,
      taskId: state.currentTask._id,
      roadmapId: _.get(this, 'state.currentTask.metaData.subject.roadmap._id'),
      answers: state.answersMy,
    };
    PubSub.publish('submitAnswerForTask', body.userId);
    props.hangoutAnswersSave(body, (err, saveResult) => {
      let filteredResult = saveResult.result;
      console.log('saveResult', saveResult);
      let foundAchievement = filteredResult.map(hangoutAnswer => _getAchievementWithRoadmap(hangoutAnswer));
      foundAchievement = foundAchievement.filter(found => found !== false);
      console.log('foundAchievement 123', foundAchievement);
      let foundCondition = [];
      foundAchievement.forEach(found => {
        const matchingCondition = found.conditions.filter(cond => cond._roadmap === body.roadmapId);
        if (matchingCondition && matchingCondition.length) {
          foundCondition.push(matchingCondition[0]);
        }
      });

      console.log('we found123', foundCondition);

      props.onSubmitComplete(saveResult);
      props.onBackToMyTasks();
    });
  }

  _getAchievementWithRoadmap(hangoutAnswer) {
    let found = false;
    if (hangoutAnswer._achievements && hangoutAnswer._achievements.length) {
      hangoutAnswer._achievements.forEach(achievement => {
        if (found === false && achievement.conditions && achievement.conditions.length) {
          achievement.conditions.forEach(condition => {
            // is object id
            if (condition._roadmap && condition._roadmap.length === 24) {
              found = achievement;
              return found;
            }
          });
        }
      });
    }

    return found;
  }

  handlePopupClose() {
    this.props.onSubmitComplete();
  }

  render() {
    const CurrentUserID = this.props.userProfile._id;

    const Partner = this.getPartnerProfile();

    let limit = 10;
    if (this.state.currentTask.type === TaskTypes.ILLUMINATE) {
      limit = 3;
    }
    const Questions =
      this.state.questions.length > 0 ? this.state.questions.slice(0, limit /*limit questions to 10*/) : [];
    return (
      <QuestionAnswersFlow
        onSubmit={e => this.handlePopupSubmit(e)}
        onCloseModal={() => this.handlePopupClose()}
        questions={Questions}
        partner={Partner}
        answersMy={this.state.answersMy}
        answersPartner={this.state.answersPartner}
        answersOtherUsers={this.state.answersOtherUsers}
        isLoading={this.state.isLoading}
        isSubmitting={this.props.isTasksUpdateInProgress}
        onBackToMyTasks={this.props.onBackToMyTasks}
        onHandleAnswerInput={e => this.handleAnswerInput(e)}
        currentTaskType={this.state.currentTask.type}
        onHandleAnswerCheckbox={e => this.handleAnswerCheckbox(e)}
        onHandleAnswerTrueFalse={e => this.handleAnswerTrueFalse(e)}
      />
    );
  }
}

AnswerQuestions.propTypes = {
  setLastStartedTask: PropTypes.func.isRequired,
  userProfile: PropTypes.object.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
  hangoutAnswersSave: PropTypes.func.isRequired,
  isTasksUpdateInProgress: PropTypes.bool,
};

const mapStateToProps = state => ({
  userProfile: state.userProfile.profile,
  isAuthorized: state.userProfile.isAuthorized,
  isTasksUpdateInProgress: state.tasks.isUpdateInProgress,
});

const mapDispatchToProps = dispatch => ({
  setLastStartedTask: bindActionCreators(setLastStartedTask, dispatch),
  hangoutAnswersSave: bindActionCreators(hangoutAnswersSave, dispatch),
});

//withRouter - is a workaround for problem of shouldComponentUpdate when using react-router-v4 with redux
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withCookies(AnswerQuestions));
