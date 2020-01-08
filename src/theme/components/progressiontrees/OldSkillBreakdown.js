/*
    author: Alexander Zolotov
*/
import React from 'react';

import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ActionLink from '~/src/components/common/ActionLink';

import Axios from 'axios';
import ConfigMain from '~/configs/main';

import '~/src/theme/css/treebrowser.css';

import { selectResultsCategory } from '~/src/redux/actions/fetchResults';

import { fetchResults, setSearchQuery } from '~/src/redux/actions/fetchResults';

import TrendScannerComponent from '~/src/theme/components/trends/TrendScannerComponent';
import HangoutSubmitForm from '~/src/theme/components/progressiontrees/HangoutSubmitForm';

import TaskTypes from '~/src/common/TaskTypes';

class SkillBreakdown extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      skillInfo: undefined,
      isHangoutFormVisible: false,
    };
  }

  componentWillMount() {
    this.updateSkill(this.props.skillName);
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
        this.props.setSearchQuery(this.state.skillInfo.skill);

        this.props.fetchResults('jobs_indeed', this.state.skillInfo.skill);
        this.props.fetchResults('events_eventbrite', this.state.skillInfo.skill);
        this.props.fetchResults('courses_udemy', this.state.skillInfo.skill);
        this.props.fetchResults('gigs_freelancer', this.state.skillInfo.skill);
      }
    }
  }

  toggleHangoutForm(skillInfo) {
    this.setState({ isHangoutFormVisible: !this.state.isHangoutFormVisible });
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
    }

    this.setState({ isHangoutFormVisible: false });
  }

  handleTimeChange(e) {
    e.preventDefault();
  }

  render() {
    const that = this;
    return (
      <div className="container-fluid" id="skill-break-down">
        <div className="row">
          <div className="content-2-columns-left-title">
            <span>Skill Breakdown</span>
            <ActionLink
              className="skill-breakdown-control pull-right"
              id="button-arrow-back"
              onClick={() => this.props.onCloseSkillBreakdown()}
            >
              <span className="glyphicon glyphicon-arrow-left" />
            </ActionLink>
            <button
              type="button"
              className="btn btn-md btn-outline-inverse skill-breakdown-control pull-right"
              onClick={() => this.toggleHangoutForm()}
            >
              Hangout
            </button>
          </div>
        </div>
        {!this.state.skillInfo && (
          <div className="row">
            <div className="col-lg-12">
              <h3>Skill not Found!!!</h3>
            </div>
          </div>
        )}
        {this.state.isHangoutFormVisible && (
          <HangoutSubmitForm
            skillInfo={this.state.skillInfo}
            onHandleStartHangout={date => this.handleStartHangout(date)}
            onTimeChange={e => handleTimeChange(e)}
          />
        )}
        <div className="row">
          <div className="col-lg-12">
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
        {!this.state.isHangoutFormVisible && (
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
  selectResultsCategory: bindActionCreators(selectResultsCategory, dispatch),
  fetchResults: bindActionCreators(fetchResults, dispatch),
  setSearchQuery: bindActionCreators(setSearchQuery, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SkillBreakdown);
