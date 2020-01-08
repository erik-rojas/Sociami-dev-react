/*
  author: Akshay Menon
*/

import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Icon } from 'react-fa';
import Async from 'async';
import Countdown from 'react-countdown-now';

import LeftNav from '~/src/theme/components/homepage/LeftNav';

import ActionLink from '~/src/components/common/ActionLink';
import DetailsPopup from '~/src/theme/components/DetailsPopupLatestTask';

import ProgressionTreesLanding from '~/src/theme/ProgressionTreesLanding';

import SkillCard from '~/src/theme/components/progressiontrees/SkillCard';

import { setSearchQuery } from '~/src/redux/actions/fetchResults';

import { fetchRoadmaps, fetchRoadmapsFromAdmin } from '~/src/redux/actions/roadmaps';
import { saveTask } from '~/src/redux/actions/tasks';
import Axios from 'axios';
import ConfigMain from '~/configs/main';

import { prepareTimers, showAllTimers, showTopTimers } from '~/src/redux/actions/timers';
import TaskTypes from '~/src/common/TaskTypes';
import UserInteractions from '~/src/common/UserInteractions';
import { userInteractionPush } from '~/src/redux/actions/userInteractions';

const MAX_LATEST_TASKS = 3;
const TaskTypesToNameMap = { find_mentor: 'Find Mentor' };
const profilePic = 'https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/userProfile/default-profile.png';

import '~/src/theme/css/heroesPage.css';

const RandomInt = function RandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

class Heroes extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isDetailsOpen: false,
      currentTask: {},
      quickStarts: {}
    };
    this.handleQuickStart = this.handleQuickStart.bind(this);
    this.handleSkillStart = this.handleSkillStart.bind(this);
    this.saveIlluminate = this.saveIlluminate.bind(this);
    this.saveDeepdive = this.saveDeepdive.bind(this);
  }

  componentWillMount() {
    mixpanel.track("View Heroes");
    this.props.onFetchAllTasks(false);
    this.props.fetchRoadmaps();
    this.props.fetchRoadmapsFromAdmin(this.props.isAuthorized ? this.props.userProfile._id : undefined);
    this.props.prepareTimers(this.props.roadmapsAdmin.data, this.props.userProfile._id);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.isAuthorized != this.props.isAuthorized) {
      if (this.props.isAuthorized) {
        this.props.fetchRoadmapsFromAdmin(this.props.userProfile._id);
      }
    }
  }

  handleCloseModal() {
    let copy = Object.assign({}, this.state, { isDetailsOpen: false });
    this.setState(copy);
  }

  handleOpenModal(task) {
    let copy = Object.assign({}, this.state, { isDetailsOpen: true, currentTask: task });
    this.setState(copy);
  }

  handleStartSearch(e) {
    e.preventDefault();
    this.props.onHandleStartSearch();
  }

  HandleChange(e) {
    this.props.setSearchQuery(e.target.value);
  }

  onViewTaskAuthor(task) {
    this.handleOpenModal(task);
  }

  renderTask(task) {
    return <h5>{task.name}</h5>;
  }

  taskTypeToName(taskType) {
    return TaskTypesToNameMap[taskType];
  }

  renderLatestTasks() {
    let that = this;

    let publishedTasks = [];

    publishedTasks = this.props.tasks.filter(function(task) {
      return !task.isHidden;
    });

    let latestTasks = publishedTasks.slice(0).sort(function(a, b) {
      return b.creationDate - a.creationDate;
    });

    return (
      <div className="row">
        {latestTasks.map(function(task, i) {
          if (i < MAX_LATEST_TASKS) {
            return (
              <div className="col-lg-4" key={i}>
                <ActionLink href="#" className="latest-task-tile" onClick={() => that.onViewTaskAuthor(task)}>
                  <div>
                    <p>{that.taskTypeToName(task.type)}</p>
                    <p>{task.roadmapName ? task.roadmapName : task.name}</p>
                  </div>
                </ActionLink>
              </div>
            );
          } else {
            return null;
          }
        })}
      </div>
    );
  }

  renderTasks() {
    if (this.props.tasks.length > 0) {
      const LatestTasks = this.renderLatestTasks();
      return this.renderLatestTasks();
    } else {
      return null;
    }
  }

  renderSearhForm() {
    const waitingText = this.props.isFetchInProgress ? <b>(Wait...)</b> : '';

    const TextInput = this.props.isFetchInProgress ? (
      <h6>Searching...</h6>
    ) : (
      <input
        type="text"
        id="search-query"
        name="query"
        autoComplete="off"
        placeholder="Key in a job or a skill you are exploring"
        onChange={e => this.HandleChange(e)}
        autoFocus
      />
    );

    return (
      <form className="form-inline" action="#" onSubmit={e => this.handleStartSearch(e)}>
        <div className="form-group">{TextInput}</div>
      </form>
    );
  }

  renderTimers() {
    if (this.props.timers.isTimersInProgress === false) {
      let timersCount = _.get(this.props.timers, 'data.length', 0);
      if (timersCount > 0) {
        let showFilter = undefined;
        if (this.props.timers.showMoreFilter) {
          showFilter = this.props.timers.displayAll ? (
            <a onClick={() => this.props.showTopTimers()} className="show-more">
              Show less
            </a>
          ) : (
            <a onClick={() => this.props.showAllTimers()} className="show-more">
              Show more
            </a>
          );
        }
        return (
          <div>
            {this.props.roadmapsAdmin.data.length > 0 &&
              this.props.timers.data.slice(0, this.props.timers.showIndex).map((item, index) => {
                return (
                  <p key={index} className="skill-in-progress">
                    <span>{item.name}</span>
                    (<Countdown daysInHours={false} date={item.date} />)
                  </p>
                );
              })}
            {showFilter}
          </div>
        );
      } else {
        return <span>No Active Timers</span>;
      }
    } else {
      return (
        <div>
          Loading Timers...<Icon spin name="spinner" />
        </div>
      );
    }
  }

  saveIlluminate(tree,skillInfo) {
    const that = this;
    const CurrentTree = tree;
    const illuminate = {
      name: `Illuminate for roadmap "${CurrentTree.name}"`,
      description: `Illuminate for roadmap "${CurrentTree.name}"`,
      type: TaskTypes.ILLUMINATE,
      userName: `${that.props.userProfile.firstName} ${that.props.userProfile.lastName}`,
      userID: that.props.userProfile._id,
      isHidden: 0,
      creator: {
        _id: that.props.userProfile._id,
        firstName: that.props.userProfile.firstName,
        lastName: that.props.userProfile.lastName,
      },
      metaData: {
        subject: {
          roadmap: {
            _id: CurrentTree._id,
            name: CurrentTree.name,
          },
          skill: {
            _id: skillInfo._id,
            name: skillInfo.skill,
          },
        },
        participants: [
          {
            user: {
              _id: that.props.userProfile._id,
              firstName: that.props.userProfile.firstName,
              lastName: that.props.userProfile.lastName,
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
    that.props.saveTask(illuminate);
  }

  saveDeepdive(tree,skillInfo) {
    const date = new Date();
    const CurrentTree = tree;
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
            _id: skillInfo._id,
            name: skillInfo.skill,
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
    this.props.saveTask(hangout);

    if (this.props.userProfile && this.props.userProfile._id) {
      this.props.userInteractionPush(
        this.props.userProfile._id,
        UserInteractions.Types.ACTION_EXECUTE,
        UserInteractions.SubTypes.DEEPDIVE_START,
        {
          roadmapId: CurrentTree._id,
          skillId: skillInfo._id,
          deepdiveTime: date.getTime(),
        },
      );
    }
  }

  handleQuickStart(tree) {
    this.setState( prevState => {
      const quickStarts = { ...prevState.quickStarts };
      quickStarts[tree.name] = true;
      return { quickStarts };
    });
    const randomTask = ["Illuminate","Deepdive"][Math.floor(Math.random() * 2)];
    const skills = tree.weightage1[0].split(',');
    const randomSkill = skills[Math.floor(Math.random() * skills.length)];
    this.handleSkillStart("Illuminate",randomSkill,tree);
  }

  handleSkillStart(task, skill, tree) {
    if(task !== 'Illuminate' && task !== 'Deepdive') {
      return;
    }
    const url = `${ConfigMain.getBackendURL()}/skillGet?name=${skill}`;
    const that = this;
    Axios.get(url)
      .then(function(response) {
        const skillInfo = response.data;
        if(task === 'Illuminate') {
          that.saveIlluminate(tree,skillInfo);
        } else if(task === 'Deepdive') {
          that.saveDeepdive(tree,skillInfo);
        }
      })
      .catch(function(error) {
      }).finally(()=>{
        this.setState( prevState => {
          const quickStarts = { ...prevState.quickStarts };
          quickStarts[tree.name] = false;
          return { quickStarts };
        });
      });
  }

  renderUserProgressionTrees() {
    return (
      <div className="progression-tree-skill-list">
        {this.props.roadmapsAdmin.data.length != 0 &&
          this.props.roadmapsAdmin.data.map((item, index) => {
            return <SkillCard key={index} skillItem={item} 
            quickStartProgress={this.state.quickStarts[item.name] === true} 
            onQuickStart={(skill,tree)=>this.handleQuickStart(skill,tree)} 
            onStart={(type,skill,tree)=>this.handleSkillStart(type,skill,tree)}
            userProfile={this.props.userProfile} timers={this.props.timers}
            />;
          })}
      </div>
    );
  }

  render() {
    //const SearchForm = this.renderSearhForm();
    const Tasks = this.renderTasks();
    return (
      <div
        className={`${this.props.userProfile.theme.toLowerCase()}-theme-wrapper profile-wrapper stories-wrapper main-bg`}>
        <div className='row'>
          <div className='container'>
            <div className='row'>
              <div className='row'>
                <LeftNav
                  accounting={this.props.accounting}
                  userProfile={this.props.userProfile}
                  profilePic={this.props.userProfile.pictureURL ? this.props.userProfile.pictureURL : profilePic}
                />

                <div className='ml-fixed'>
                  <div className="row progression-tree-header-box">
                    {/* <div className="progression-tree-header">
                      <b>My progression skills</b>
                    </div> */}
                    <div className="progression-tree-timers">
                      <div className="progression-tree-clock">
                        {this.renderTimers()}
                      </div>
                    </div>
                    {/* <a className="show-more-option">show more</a> */}
                  </div>
                  {this.renderUserProgressionTrees()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Heroes.propTypes = {
  isFetchInProgress: PropTypes.bool.isRequired,
  tasks: PropTypes.array.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
  roadmapsAdmin: PropTypes.object.isRequired,
};

const mapDispatchToProps = dispatch => ({
  setSearchQuery: bindActionCreators(setSearchQuery, dispatch),
  fetchRoadmaps: bindActionCreators(fetchRoadmaps, dispatch),
  fetchRoadmapsFromAdmin: bindActionCreators(fetchRoadmapsFromAdmin, dispatch),
  prepareTimers: bindActionCreators(prepareTimers, dispatch),
  showAllTimers: bindActionCreators(showAllTimers, dispatch),
  showTopTimers: bindActionCreators(showTopTimers, dispatch),
  saveTask: bindActionCreators(saveTask, dispatch),
  userInteractionPush: bindActionCreators(userInteractionPush, dispatch)
});

const mapStateToProps = state => ({
  isFetchInProgress: state.isFetchInProgress,
  tasks: state.tasks.data,
  roadmapsAdmin: state.roadmapsAdmin,
  timers: state.timers,
  saveTask
});

//withRouter - is a workaround for problem of shouldComponentUpdate when using react-router-v4 with redux
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Heroes);
