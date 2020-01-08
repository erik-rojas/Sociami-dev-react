/*
    author: Alexander Zolotov
*/

import React, { Component } from 'react';
import 'url-search-params-polyfill';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Icon } from 'react-fa';

import { withCookies, Cookies } from 'react-cookie';

import Axios from 'axios';

import ConfigMain from '~/configs/main';

import ActionLink from '~/src/components/common/ActionLink';

// import PopupAnswers from '~/src/theme/components/tasks/PopupHangoutAnswers';

import '~/src/theme/appearance.css';
import '~/src/theme/layout.css';
import '~/src/theme/css/taskBrowser.css';

import { setLastStartedTask } from '~/src/redux/actions/tasks';

class TaskBrowser extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTask: undefined,
      questions: [],

      answersMy: {},

      answersPartner: {},

      isTaskLoading: false,
      isQuestionsLoading: false,

      isAnswersFetchFromServerInProgress: false,
      isAnswersFetchFromCookiesInProgress: false,

      isLoading: false,

      isSubmitted: false,

      isPopupOpen: true,
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

  handleSubmit(e) {
    e.preventDefault();

    const that = this;

    const body = {
      userId: this.props.userProfile._id,

      taskId: this.state.currentTask._id,

      answers: this.state.answersMy,
    };

    Axios.post(`${ConfigMain.getBackendURL()}/hangoutAnswersSave`, body)
      .then(response => {
        that.setState({ isSubmitted: true });
      })
      .catch(error => {
        that.setState({ isSubmitted: true });
        console.log(error);
      });
  }

  componentDidMount() {
    this.props.setLastStartedTask({});
    const URLParams = new URLSearchParams(this.props.location.search);

    const taskId = URLParams.get('id');

    const that = this;

    if (taskId) {
      that.setState({ isTaskLoading: true });
      Axios.get(`${ConfigMain.getBackendURL()}/taskGetById?id=${taskId}`)
        .then(response => {
          that.setState({ currentTask: response.data, isTaskLoading: false });
        })
        .catch(error => {
          that.setState({ isTaskLoading: false });
          console.log(error);
        });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const that = this;

    if (prevState.currentTask != this.state.currentTask) {
      if (this.state.currentTask && this.state.currentTask.type == 'hangout') {
        that.setState({ isQuestionsLoading: true });
        Axios.get(
          `${ConfigMain.getBackendURL()}/questionsGet?roadmapSkill=${
            this.state.currentTask.metaData.subject.skill.name
          }`,
        )
          .then(response => {
            that.setState({ questions: response.data, isQuestionsLoading: false });
          })
          .catch(error => {
            that.setState({ isQuestionsLoading: false });
            console.log(error);
          });

        this.fetchUserAnswersFromCookies();

        this.fetchUserAnswersFromServerMy();
      }
    }

    if (
      this.state.isQuestionsLoading != prevState.isQuestionsLoading ||
      this.state.isTaskLoading != prevState.isTaskLoading ||
      prevState.isAnswersFetchFromCookiesInProgress != this.state.isAnswersFetchFromCookiesInProgress ||
      prevState.isAnswersFetchFromServerInProgress != this.state.isAnswersFetchFromServerInProgress
    ) {
      this.setState({
        isLoading:
          this.state.isQuestionsLoading ||
          this.state.isTaskLoading ||
          this.state.isAnswersFetchFromCookiesInProgress ||
          this.state.isAnswersFetchFromServerInProgress,
      });
    }

    if (this.state.answersMy != prevState.answersMy) {
      this.storeUserAnswersToCookies(this.state.answersMy);
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

  handlePopupSubmit() {
    this.setState({ isPopupOpen: false });
  }

  handlePopupClose() {
    this.setState({ isPopupOpen: false });
  }

  renderQuestions() {
    if (!this.props.isAuthorized) {
      return (
        <div className="row" key={i}>
          <div className="col-lg-12" />
        </div>
      );
    }

    const CurrentUserID = this.props.userProfile._id;

    const Questions = this.state.questions.length > 0 ? this.state.questions : [];

    const Partner = this.getPartnerProfile();

    const that = this;

    return (
      <div id="questions-list">
        <div className="container-fluid">
          {Questions.map(function(question, i) {
            const AnswerMy = that.getAnswerMy([question._id]);
            const AnswerPartner = that.getAnswerPartner([question._id]);

            return (
              <div className="row" key={i}>
                <div className="col-lg-12">
                  {i + 1}) {question.question}
                </div>
                <div className="col-lg-6">
                  <div>{'You'}</div>
                  <div className="form-group">
                    <textarea
                      id={`answer_your_${question._id}`}
                      className="form-control validate-field required question-text-area"
                      name="answer_your"
                      onChange={e => that.handleAnswerInput(e)}
                      value={AnswerMy}
                    />
                  </div>
                </div>
                <div className="col-lg-6">
                  <div>{Partner.user.firstName}</div>
                  <div className="form-group">
                    <textarea
                      readOnly={true}
                      id={`answer_partner_${question._id}`}
                      className="form-control validate-field required question-text-area"
                      name="answer_partner"
                      onChange={e => {}}
                      value={AnswerPartner}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  render() {
    if (!this.props.isAuthorized) {
      return (
        <div id="main-content_1">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12 content-2-columns-left-title">
                <h3>Please log-in</h3>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (this.state.isLoading) {
      return (
        <div id="main-content_1">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12 content-2-columns-left-title">
                <h3>
                  <Icon spin name="spinner" />Fetching data...
                </h3>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (this.state.isSubmitted) {
      return (
        <div id="main-content_1">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12 content-2-columns-left-title">
                <h3>Thank you for submitting your answers</h3>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (!this.state.currentTask) {
      return (
        <div id="main-content_1">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12 content-2-columns-left-title" />
            </div>
          </div>
        </div>
      );
    }

    const CurrentUserID = this.props.userProfile._id;

    const Partner = this.getPartnerProfile();

    /* if (this.state.isPopupOpen) {
      const Questions = this.state.questions.length > 0 ? this.state.questions : [];

       const Partner = this.getPartnerProfile();

      return (
        <PopupAnswers onSubmit={()=>this.handlePopupSubmit()} 
          onCloseModal={()=>this.handlePopupClose()}
          questions={Questions} partner={Partner}/>
      );
    }*/

    return (
      <div id="main-content_1">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12 content-2-columns-left-title">
              <span>Your meeting with {Partner.user.firstName}</span>
              <div id="actions" className="pull-right">
                <ActionLink href="#" onClick={() => {}} className="organizer-action-link">
                  Cancel
                </ActionLink>
                <ActionLink href="#" onClick={() => {}} className="organizer-action-link">
                  Reschedule
                </ActionLink>
                <button
                  type="button"
                  className="btn btn-ьв btn-outline-inverse"
                  onClick={e => this.handleSubmit(e)}
                >
                  Submit
                </button>
              </div>
              <ActionLink
                className="skill-breakdown-control pull-right"
                id="button-arrow-back"
                onClick={this.props.history.goBack}
              >
                <span className="glyphicon glyphicon-arrow-left" />
              </ActionLink>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">{this.renderQuestions()}</div>
          </div>
        </div>
      </div>
    );
  }
}

TaskBrowser.propTypes = {
  setLastStartedTask: PropTypes.func.isRequired,
  userProfile: PropTypes.object.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  userProfile: state.userProfile.profile,
  isAuthorized: state.userProfile.isAuthorized,
});

const mapDispatchToProps = dispatch => ({
  setLastStartedTask: bindActionCreators(setLastStartedTask, dispatch),
});

//withRouter - is a workaround for problem of shouldComponentUpdate when using react-router-v4 with redux
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withCookies(TaskBrowser));
