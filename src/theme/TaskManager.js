/*
    author: Alexander Zolotov
*/

import React, { Component } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';

import Axios from 'axios';

import ConfigMain from '~/configs/main';

import PropTypes from 'prop-types';

import TaskScanner from '~/src/theme/components/tasks/TaskScanner';
import TasksMyComponent from '~/src/theme/components/tasks/TasksMy';
import HeaderTaskManager from '~/src/theme/components/tasks/HeaderTaskManager';
import Achievement from '~/src/theme/components/tasks/Achievement';

import AnswerQuestions from '~/src/theme/components/tasks/AnswerQuestions';

import DetailsPopup from '~/src/components/common/DetailsPopup';

import TaskTypes from '~/src/common/TaskTypes';

import {
  fetchTasksInitiate,
  fetchTasksComplete,
  hangoutJoin,
  taskStatusChange,
  taskLeave,
  rateTaskPartner,
  taskAssign,
  taskJoinStatusChange,
  setActiveHangout,
  resetActiveHangout,
} from '~/src/redux/actions/tasks';

import { openSignUpForm, fetchUserTasks } from '~/src/redux/actions/authorization';

import { projectsFetch } from '~/src/redux/actions/projects';

import { fetchRoadmapsFromAdmin } from '~/src/redux/actions/roadmaps';

const TasksAll = { type: 'all', label: 'Active' };
const TasksConfirmed = { type: 'confirmed', label: 'Confirmed' };
const TasksMy = { type: 'takks_my', label: 'Mine' };
const TasksOthers = { type: 'tasks_others', label: 'Others' };
const TasksSentRequests = { type: 'sent_requests', label: 'Sent Requests' };
const TasksCompleted = { type: 'completed', label: 'Completed' };

const Filters = [TasksAll, TasksConfirmed, TasksMy, TasksOthers, TasksSentRequests, TasksCompleted];

const BackendURL = ConfigMain.getBackendURL();

class TaskManager extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      scannerQuery: '',
      timeNow: Date.now(),
      isScannerExpanded: !this.props.isAuthorized,
      isAnswerSubmitComplete: false,
      activeHangout: undefined,
      isAnswerQuestionsOpen: false,

      //
      filterCurrent: Filters[0],
    };

    this.redirectLocation = undefined;

    //this is for making task 'Start' button available in real time
    this.timeNowUpdateInterval = undefined;
  }

  groupTasksByProjects(tasks) {
    let results = [];

    let projects = {};

    for (let i = 0; i < tasks.length; ++i) {
      if (tasks[i].type == TaskTypes.PROJECT_MILESTONE) {
        if (!projects.hasOwnProperty(tasks[i].metaData.projectId)) {
          projects[tasks[i].metaData.projectId] = {
            _id: tasks[i].metaData.projectId,
            name: tasks[i].metaData.projectName,
            milestones: [],
          };
        }

        projects[tasks[i].metaData.projectId].milestones.push(tasks[i]);
      } else {
        results.push(tasks[i]);
      }
    }

    for (let tasksGrouped in projects) {
      results.push(projects[tasksGrouped]);
    }

    return results;
  }

  getTasksAssignedToMe() {
    const tasksGroupedByProjects = this.groupTasksByProjects(this.props.tasksAssignedToCurrentUser);
    return tasksGroupedByProjects;
  }

  getTasksCreatedByMe() {
    const tasksGroupedByProjects = this.groupTasksByProjects(this.props.tasksCreatedCurrentUser);
    return tasksGroupedByProjects;
  }

  getMyTasksAll() {
    const tasksAssignedToMe = this.getTasksAssignedToMe();
    const tasksCreatedByMe = this.getTasksCreatedByMe();

    return tasksAssignedToMe.concat(tasksCreatedByMe);
  }

  getHangoutsAll() {
    const hangoutsAll = this.props.tasks.filter(function(task) {
      return task.type == 'hangout';
    });

    return hangoutsAll;
  }

  handleChange(e) {
    e.preventDefault();
    this.setState({ scannerQuery: e.target.value });
  }

  handleHangoutRate(hangout, userId, rate) {
    if (rate == 'good' || rate == 'bad') {
      const rateNumber = rate == 'good' ? 10 : 1;

      this.props.rateTaskPartner(hangout._id, this.props.userProfile._id, userId, rateNumber);
    }
  }

  hangoutActionPerform(action, hangout) {
    switch (action) {
      case 'start': {
        if (this.state.timeNow >= hangout.metaData.time) {
          this.props.taskStatusChange(hangout._id, 'started');
        }
        break;
      }
      case 'cancel': {
        this.props.taskStatusChange(hangout._id, 'canceled');
        break;
      }
      case 'leave': {
        this.props.taskLeave(hangout._id, {
          _id: this.props.userProfile._id,
          firstName: this.props.userProfile.firstName,
          lastName: this.props.userProfile.lastName,
        });
        break;
      }
      case 'reschedule': {
        this.props.taskStatusChange(hangout._id, 'rescheduled');
        break;
      }
      case 'answer_questions': {
        this.props.setActiveHangout(hangout);
        break;
      }
      default:
        break;
    }
  }

  fetchUserTasks() {
    if (this.props.isAuthorized) {
      this.props.fetchUserTasks(this.props.userProfile._id);
    }
  }

  componentWillMount() {
    this.fetchUserTasks();
    if (!this.props.isAuthorized) {
      this.props.onFetchAllTasks(false);
    } else {
      this.props.onFetchAllTasks(true);
    }
    this.props.fetchRoadmapsFromAdmin(this.props.isAuthorized ? this.props.userProfile._id : undefined);
  }

  componentDidMount() {
    this.timeNowUpdateInterval = setInterval(() => this.updateTimeNow(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timeNowUpdateInterval);
  }

  updateTimeNow() {
    this.setState({ timeNow: Date.now() });
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevProps.isAuthorized && this.props.isAuthorized) {
      this.fetchUserTasks();

      this.props.onFetchAllTasks(true);

      this.props.fetchRoadmapsFromAdmin(this.props.userProfile._id);
    }

    if (prevProps.isTaskSaveInProgress && !this.props.isTaskSaveInProgress) {
      if (this.props.lastStartedTask._id) {
        this.hangoutActionPerform('answer_questions', this.props.lastStartedTask);
      }

      this.fetchUserTasks();
      this.props.onFetchAllTasks(false);
    }

    if (
      prevProps.userTasks.length != this.props.userTasks.length ||
      prevProps.tasks.length != this.props.tasks.length ||
      (prevProps.isTaskSaveInProgress != this.props.isTaskSaveInProgress ||
        prevProps.isTasksFetchInProgress != this.props.isTasksFetchInProgress ||
        prevProps.isUserTasksLoading != this.props.isUserTasksLoading)
    ) {
      let tasks = [];

      const CurrentUserID = this.props.userProfile._id;

      tasks = this.props.tasks.filter(function(task) {
        return task.type == 'hangout' && task.creator._id == CurrentUserID;
      });

      if (tasks.length == 0) {
        tasks = this.props.tasks.filter(function(task) {
          return (
            task.type == 'hangout' &&
            task.metaData.participants.findIndex(function(participant) {
              return participant.user._id == CurrentUserID && participant.status == 'pending';
            }) != -1
          );
        });
      }

      this.setState({
        isScannerExpanded:
          !this.props.isAuthorized || (this.props.userTasks.length == 0 && tasks.length == 0),
      });
    }
  }

  handleSaveNewTaskSuccess(response) {
    this.props.fetchTasksComplete();
    this.props.onFetchAllTasks(false);
  }

  handleSaveNewTaskError(error) {
    this.props.fetchTasksComplete();
    this.props.onFetchAllTasks(false);
  }

  handleOpenConfirmTaskDetailsPopup(item) {
    if (this.props.isAuthorized && item.userID != this.props.userProfile._id) {
      let copy = Object.assign({}, this.state, { isDetailsPopupOpen: true, detailsPopupItem: item });
      this.setState(copy);
    }
  }

  handleExpandScanner(expand) {
    if (this.props.isAuthorized) {
      this.setState({ isScannerExpanded: expand });
    }
  }

  handleCloseConfirmTaskDetailsPopup() {
    this.setState({ isDetailsPopupOpen: false });
  }

  handleAcceptConfirm(item) {
    if (this.state.detailsPopupItem.type != TaskTypes.DEEPDIVE) {
      const Assignee = {
        _id: this.props.userProfile._id,
        firstName: this.props.userProfile.firstName,
        lastName: this.props.userProfile.lastName,
      };

      this.props.taskAssign(this.state.detailsPopupItem._id, Assignee);
    } else {
      this.props.hangoutJoin(this.state.detailsPopupItem._id, {
        _id: this.props.userProfile._id,
        firstName: this.props.userProfile.firstName,
        lastName: this.props.userProfile.lastName,
      });
    }

    this.handleCloseConfirmTaskDetailsPopup();
  }

  handleOpenCancelTaskDetailsPopup(item) {
    if (this.props.isAuthorized && item.userID != this.props.userProfile._id) {
      let copy = Object.assign({}, this.state, {
        isDetailsPopupOpenCancelTask: true,
        detailsPopupItem: item,
      });
      this.setState(copy);
    }
  }

  handleCloseCancelTaskDetailsPopup(item) {
    let copy = Object.assign({}, this.state, { isDetailsPopupOpenCancelTask: false });
    this.setState(copy);
    this.props.onFetchAllTasks(false);
    this.fetchUserTasks();
  }

  handleAcceptCancel(item) {
    let userID = this.props.userProfile ? this.props.userProfile._id : undefined; //"59fdda7f82fff92dc7527d28";
    var params = {
      _id: this.state.detailsPopupItem._id,
      taskAsigneeId: userID,
    };
    const body = {
      _id: this.state.detailsPopupItem._id,
      assignee: {
        _id: this.props.userProfile._id,
        firstName: this.props.userProfile.firstName,
        lastName: this.props.userProfile.lastName,
      },
    };

    Axios.post(`${ConfigMain.getBackendURL()}/taskCancel`, body)
      .then(response => this.handleCloseCancelTaskDetailsPopup(response))
      .catch(error => this.handleCloseCancelTaskDetailsPopup(error));
  }

  hangoutRequestAccept(hangout, user) {
    this.props.taskJoinStatusChange(hangout._id, 'accepted', user);
  }

  hangoutRequestReject(hangout, user) {
    this.props.taskJoinStatusChange(hangout._id, 'rejected', user);
  }

  getMyTasksAndHangouts() {
    let tasks = [];

    const CurrentUserID = this.props.userProfile._id;

    const that = this;

    const filterMy = task => {
      return (task.creator && task.creator._id == CurrentUserID) || task.userID == CurrentUserID;
    };

    const filterOthers = task => {
      return (
        !filterMy(task) &&
        (task.type == 'hangout' &&
          (task.creator._id == CurrentUserID ||
            task.metaData.participants.findIndex(function(participant) {
              return participant.user._id == CurrentUserID && participant.status != 'pending';
            }) != -1))
      );
    };

    const filterConfirmed = task => {
      if (task.type == 'hangout') {
        return (
          task.creator._id != CurrentUserID &&
          task.metaData.participants.findIndex(function(participant) {
            return participant.user._id == CurrentUserID && participant.status == 'accepted';
          }) != -1
        );
      }

      return false;
    };

    const filterSentRequests = task => {
      if (task.type == 'hangout') {
        return (
          task.status == 'None' &&
          task.creator._id != CurrentUserID &&
          task.metaData.participants.findIndex(function(participant) {
            return participant.user._id == CurrentUserID && participant.status != 'accepted';
          }) != -1
        );
      }

      return false;
    };

    const filterCompleted = task => {
      if (task.status != 'complete') {
        return false;
      }

      if (
        task.type == TaskTypes.DEEPDIVE ||
        task.type == TaskTypes.DECODE ||
        task.type == TaskTypes.ILLUMINATE
      ) {
        return (
          task.creator._id == CurrentUserID ||
          task.metaData.participants.findIndex(function(participant) {
            return participant.user._id == CurrentUserID && participant.status == 'accepted';
          }) != -1
        );
      } else {
        return (
          task.creator._id == CurrentUserID ||
          task.assignees.findIndex(function(assignee) {
            return assignee._id == CurrentUserID;
          }) != -1
        );
      }
    };

    const filterAll = task => {
      return (
        !filterCompleted(task) &&
        (filterMy(task) || filterOthers(task) || filterConfirmed(task) || filterSentRequests(task))
      );
    };

    switch (this.state.filterCurrent.type) {
      case TasksConfirmed.type: {
        tasks = this.props.tasks.filter(filterConfirmed);
        break;
      }
      case TasksSentRequests.type: {
        tasks = this.props.tasks.filter(filterSentRequests);
        break;
      }
      case TasksCompleted.type: {
        tasks = this.props.tasks.filter(filterCompleted);
        break;
      }
      case TasksOthers.type: {
        tasks = this.props.tasks.filter(filterOthers);
        break;
      }
      case TasksMy.type: {
        tasks = this.props.tasks.filter(filterMy);
        break;
      }
      default:
        tasks = this.props.tasks.filter(filterAll);
        break;
    }

    if (tasks.length > 0) {
      //sort descending by date
      tasks.sort((task1, task2) => {
        return task2.date - task1.date;
      });
    }

    return tasks;
  }

  getTaskScannerTasks() {
    let tasksFiltered = [];
    const currentUserId = this.props.userProfile._id;

    if (this.props.isAuthorized) {
      tasksFiltered = this.props.tasks.filter(function(task) {
        return (
          task.userID != currentUserId &&
          (!task.assignees ||
            !task.assignees.find(function(assignee) {
              return assignee._id == currentUserId;
            })) &&
          (task.type != 'hangout' ||
            ((task.status == 'None' || task.status == 'cancelled') &&
              task.metaData.participants.findIndex(function(participant) {
                return participant.user._id == currentUserId;
              }) == -1))
        );
      });
    } else {
      tasksFiltered = this.props.tasks;
    }

    if (this.props.roadmapsAdmin.data.length > 0) {
      const roadmapsLocked = this.props.roadmapsAdmin.data.filter(function(roadmap) {
        return roadmap.isLocked;
      });

      if (roadmapsLocked.length > 0) {
        for (let i = 0; i < tasksFiltered.length; ++i) {
          if (tasksFiltered[i].type == 'hangout') {
            tasksFiltered[i].isLocked =
              roadmapsLocked.findIndex(function(roadmap) {
                return roadmap._id == tasksFiltered[i].metaData.subject.roadmap._id;
              }) != -1;
          }
        }
      }
    }

    return tasksFiltered;
  }

  handleFilterChange(newFilter) {
    this.setState({ filterCurrent: newFilter });
  }

  handleAnswersSubmitComplete() {
    this.setState({ isAnswerSubmitComplete: true });
    setTimeout(() => {
      this.setState({ isAnswerSubmitComplete: false });
    }, 10000);
    this.props.resetActiveHangout();
  }

  handleBackToMyTasks() {
    this.props.resetActiveHangout();
  }

  filterTasksScanner(tasksScanner) {
    let foundTasks = [];
    const scannerQuery = this.state.scannerQuery.toLowerCase();
    if (scannerQuery != '') {
      foundTasks = tasksScanner.filter(function(task) {
        return (
          (this.props.userProfile._id == undefined || task.userID != this.props.userProfile._id) &&
          task.name &&
          task.name.toLowerCase().startsWith(scannerQuery)
        );
      });
    } else {
      foundTasks = tasksScanner;
    }
    return foundTasks.filter(task => {
      return task.type == TaskTypes.DEEPDIVE;
    });
  }

  render() {
    const myTasks = this.getMyTasksAndHangouts();

    const tasksScanner = this.getTaskScannerTasks();

    const tasksScannerFiltered = this.filterTasksScanner(tasksScanner);

    const MyTasksColClass = this.state.isScannerExpanded ? 'col-md-4 expand-deep' : 'col-md-8 expand-deep';
    const ScannerColClass = this.state.isScannerExpanded
      ? 'col-md-8 expand-tokens open-tokens-mobile'
      : 'col-md-4 expand-tokens close-tokens-mobile';

    return (
      <div>
        {this.state.isAnswerSubmitComplete ?
          (<Achievement />)
        : (
          <div className="row content-wrap">
            <div className={MyTasksColClass}>
              {this.props.activeHangout ? (
                <div>
                  <AnswerQuestions
                    currentTask={this.props.activeHangout}
                    onBackToMyTasks={this.handleBackToMyTasks.bind(this)}
                    onSubmitComplete={() => this.handleAnswersSubmitComplete()}
                  />
                </div>
              ) : (
                <div>
                  <DetailsPopup
                    modalIsOpen={this.state.isDetailsPopupOpen}
                    onConfirm={item => this.handleAcceptConfirm(item)}
                    onCloseModal={() => this.handleCloseConfirmTaskDetailsPopup()}
                    item={this.state.detailsPopupItem}
                    item="accept_confirmation"
                    task={this.state.detailsPopupItem}
                  />

                  <DetailsPopup
                    modalIsOpen={this.state.isDetailsPopupOpenCancelTask}
                    onConfirm={item => this.handleAcceptCancel(item)}
                    onCloseModal={() => this.handleCloseCancelTaskDetailsPopup()}
                    item={this.state.detailsPopupItem}
                    item="cancel_confirmation"
                    task={this.state.detailsPopupItem}
                  />
                  <HeaderTaskManager
                    filters={Filters}
                    onFilterChange={newFilter => this.handleFilterChange(newFilter)}
                    filterCurrent={this.state.filterCurrent}
                  />
                  <TasksMyComponent
                    tasks={myTasks}
                    handleOpenCancelTaskDetailsPopup={task => this.handleOpenCancelTaskDetailsPopup(task)}
                    onHangoutActionPerform={(action, hangout) => this.hangoutActionPerform(action, hangout)}
                    onHangoutRate={(hangout, userId, rate) => this.handleHangoutRate(hangout, userId, rate)}
                    assignedTasks={this.props.tasksAssignedToCurrentUser}
                    currentUserID={this.props.userProfile._id}
                    timeNow={this.state.timeNow}
                    isAuthorized={this.props.isAuthorized}
                    isCollapsed={this.state.isScannerExpanded}
                    userProfile={this.props.userProfile}
                    currentUserID={this.props.userProfile._id}
                    onHangoutRequestAccept={(hangout, user) => this.hangoutRequestAccept(hangout, user)}
                    onHangoutRequestReject={(hangout, user) => this.hangoutRequestReject(hangout, user)}
                  />
                </div>
              )}
            </div>
            <div className={[ScannerColClass, tasksScannerFiltered.length > 0 ? 'show' : 'hidden'].join(' ')}>
              <TaskScanner
                tasks={tasksScanner}
                scannerQuery={this.state.scannerQuery}
                currentUserID={this.props.userProfile._id}
                handleOpenConfirmTaskDetailsPopup={task => this.handleOpenConfirmTaskDetailsPopup(task)}
                handleChange={e => this.handleChange(e)}
                onExpand={expand => this.handleExpandScanner(expand)}
                isExpanded={this.state.isScannerExpanded}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}

TaskManager.propTypes = {
  tasks: PropTypes.array.isRequired,

  roadmapsAdmin: PropTypes.object.isRequired,

  tasksCreatedCurrentUser: PropTypes.array.isRequired,
  tasksAssignedToCurrentUser: PropTypes.array.isRequired,
  isUserTasksLoading: PropTypes.bool.isRequired,

  projects: PropTypes.array.isRequired,
  isTasksFetchInProgress: PropTypes.bool.isRequired,
  isTaskSaveInProgress: PropTypes.bool.isRequired,
  isTaskUpdateInProgress: PropTypes.bool.isRequired,

  openSignUpForm: PropTypes.func.isRequired,
  hangoutJoin: PropTypes.func.isRequired,
  taskStatusChange: PropTypes.func.isRequired,
  taskLeave: PropTypes.func.isRequired,
  taskAssign: PropTypes.func.isRequired,
  fetchTasksInitiate: PropTypes.func.isRequired,
  rateTaskPartner: PropTypes.func.isRequired,
  fetchTasksComplete: PropTypes.func.isRequired,
  fetchUserTasks: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  userProfile: state.userProfile.profile,
  isAuthorized: state.userProfile.isAuthorized,
  tasks: state.tasks.data,

  roadmapsAdmin: state.roadmapsAdmin,

  userTasks: state.userProfile.tasks,

  tasksCreatedCurrentUser: state.userProfile.tasks.created,
  tasksAssignedToCurrentUser: state.userProfile.tasks.assigned,
  isUserTasksLoading: state.userProfile.tasks.isLoading,
  activeHangout: state.tasks.activeHangout,

  projects: state.projects,
  isTasksFetchInProgress: state.tasks.isFetchInProgress,
  isTaskSaveInProgress: state.tasks.isSaveInProgress,
  isTaskUpdateInProgress: state.tasks.isUpdateInProgress,
  lastStartedTask: state.lastStartedTask,
});

const mapDispatchToProps = dispatch => ({
  openSignUpForm: bindActionCreators(openSignUpForm, dispatch),
  hangoutJoin: bindActionCreators(hangoutJoin, dispatch),
  taskStatusChange: bindActionCreators(taskStatusChange, dispatch),
  taskLeave: bindActionCreators(taskLeave, dispatch),
  fetchTasksInitiate: bindActionCreators(fetchTasksInitiate, dispatch),
  fetchTasksComplete: bindActionCreators(fetchTasksComplete, dispatch),
  fetchUserTasks: bindActionCreators(fetchUserTasks, dispatch),
  setActiveHangout: bindActionCreators(setActiveHangout, dispatch),
  resetActiveHangout: bindActionCreators(resetActiveHangout, dispatch),
  rateTaskPartner: bindActionCreators(rateTaskPartner, dispatch),
  taskAssign: bindActionCreators(taskAssign, dispatch),
  fetchRoadmapsFromAdmin: bindActionCreators(fetchRoadmapsFromAdmin, dispatch),
  taskJoinStatusChange: bindActionCreators(taskJoinStatusChange, dispatch),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(TaskManager),
);
