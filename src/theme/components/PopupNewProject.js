import React from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';

import '~/src/theme/css/popupProjectManagement.css';

import Axios from 'axios';

import ConfigMain from '~/configs/main';

import PopupConfirmWithdraw from '~/src/theme/components/PopupConfirmation';
import NewProjectForm from '~/src/theme/components/PopupNewProjectForm';

import { getPopupParentElement } from '~/src/common/PopupUtils.js';

import TaskTypes from '~/src/common/TaskTypes';

const arrayDifference = function(arrayFirst, arraySecond) {
  let difference = [];

  if (!arraySecond || arraySecond.length == 0) {
    difference = difference.concat(arrayFirst);
  } else {
    for (let i = 0; i < arrayFirst.length; ++i) {
      const foundIndex = arraySecond
        .map(function(x) {
          return x._id;
        })
        .indexOf(arrayFirst[i]._id);
      if (foundIndex < 0) {
        difference.push(arrayFirst[i]);
      }
    }
  }

  return difference;
};

class PopupNewProject extends React.Component {
  constructor(props) {
    super(props);
    this.modalDefaultStyles = {};

    this.initialStateProject = this.props.project
      ? this.props.project
      : {
          id: undefined,
          name: '',
          description: '',
          nature: '',
          creationDate: undefined,
          milestones: [],
        };

    this.initialStateMilestone = {
      name: '',
      description: '',
      price: 1,
      date: Date.now() + 60 * 60 * 24,
    };

    this.state = {
      project: this.initialStateProject,
      milestoneTemp: this.initialStateMilestone,
      //confirmation popup
      confirmWithdrawPopupOpen: false,
      assigneeName: '',
      milestoneIdToRemove: undefined,
      isOperationInProgress: false,
    };
  }

  componentWillMount() {
    if (this.props.userProfile) {
      this.props.fetchRoadmapsDetailsByIds(this.props.userProfile.roadmaps);
    }

    this.modalDefaultStyles = Modal.defaultStyles;

    Modal.defaultStyles.content.border = '7px solid grey';
    Modal.defaultStyles.content.background = 'transparent';
    Modal.defaultStyles.content.color = 'initial';
    Modal.defaultStyles.content.overflow = 'auto';
    Modal.defaultStyles.content.padding = '0';
    Modal.defaultStyles.content['minWidth'] = '260px';
    Modal.defaultStyles.content['maxWidth'] = '800px';
    Modal.defaultStyles.content['height'] = 'initial';
    Modal.defaultStyles.content['minHeight'] = '500px';
    Modal.defaultStyles.content['marginLeft'] = 'auto';
    Modal.defaultStyles.content['marginRight'] = 'auto';
    Modal.defaultStyles.content['left'] = '0';
    Modal.defaultStyles.content['right'] = '0';
    Modal.defaultStyles.content['width'] = '700px';
  }

  componentWillUnmount() {
    Modal.defaultStyles = this.modalDefaultStyles;
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.lastSavedTask._id != this.props.lastSavedTask._id &&
      this.props.lastSavedTask._id != undefined
    ) {
      this.handleNewMilestoneAdded();
    }

    if (prevProps.isTasksUpdateInProgress && !this.props.isTasksUpdateInProgress) {
      this.updateMilestones();
    } else {
      if (prevProps.isTaskSaveInProgress && !this.props.isTaskSaveInProgress) {
        this.handleMilestoneDeleted();
      }
    }
  }

  handleNewMilestoneAdded() {
    let projectCopy = Object.assign({}, this.state.project);

    let lastSavedTask = this.props.lastSavedTask;

    let foundIndex = projectCopy.milestones.findIndex(function(currentMilestone) {
      return currentMilestone._id == lastSavedTask._id;
    });

    if (foundIndex < 0) {
      projectCopy.milestones.push(lastSavedTask);
    }

    let copy = Object.assign({}, this.state, { project: projectCopy });
    this.setState(copy);
  }

  handleMilestoneDeleted() {
    let projectCopy = Object.assign({}, this.state.project);

    const milestonesToRemove = arrayDifference(this.state.project.milestones, this.props.tasks);

    if (milestonesToRemove && milestonesToRemove.length > 0) {
      for (let i = 0; i < milestonesToRemove.length; ++i) {
        let foundIndex = projectCopy.milestones.findIndex(function(currentMilestone) {
          return currentMilestone._id == milestonesToRemove[i]._id;
        });

        if (foundIndex >= 0) {
          projectCopy.milestones.splice(foundIndex, 1);
        }
      }

      let copy = Object.assign({}, this.state, { project: projectCopy });
      this.setState(copy);
    }
  }

  updateMilestones() {
    const tasks = this.props.tasks;
    if (tasks.length > 0) {
      let tasksMap = {};

      for (let i = 0; i < tasks.length; ++i) {
        tasksMap[tasks[i]._id] = tasks[i];
      }

      //update this.state.project.milestones array from created map, using milestone._id as a key
      let projectCopy = Object.assign({}, this.state.project);

      for (let i = 0; i < projectCopy.milestones.length; ++i) {
        const taskFromMap = tasksMap[projectCopy.milestones[i]._id];
        if (taskFromMap) {
          projectCopy.milestones[i] = taskFromMap;
        }
      }

      let copy = Object.assign({}, this.state, { project: projectCopy });
      this.setState(copy);
    }
  }

  handleChangeProject(e) {
    e.preventDefault();

    let projectCopy = Object.assign({}, this.state.project);

    switch (e.target.id) {
      case 'project_name': {
        projectCopy.name = e.target.value;
        break;
      }
      case 'project_desc': {
        projectCopy.description = e.target.value;
        break;
      }
      case 'project_nature': {
        projectCopy.nature = e.target.value;
        break;
      }

      default:
        return;
    }

    let copy = Object.assign({}, this.state, { project: projectCopy });
    this.setState(copy);
  }

  handleChangeMilestone(e) {
    e.preventDefault();

    let milestoneCopy = Object.assign({}, this.state.milestoneTemp);

    switch (e.target.id) {
      case 'milestone_name': {
        milestoneCopy.name = e.target.value;
        break;
      }
      case 'milestone_desc': {
        milestoneCopy.description = e.target.value;
        break;
      }
      case 'milestone_price': {
        milestoneCopy.price = e.target.value;
        break;
      }
      case 'milestone_date': {
        milestoneCopy.date = Date.parse(e.target.value);
        break;
      }
      default:
        return;
    }

    this.setState({ milestoneTemp: milestoneCopy });
  }

  handleMilestoneAdd(e) {
    e.preventDefault();

    const milestone = Object.assign({}, this.state.milestoneTemp, {
      type: TaskTypes.PROJECT_MILESTONE,
      userName: `${this.props.userProfile.firstName} ${this.props.userProfile.lastName}`,
      userID: this.props.userProfile._id,
      isHidden: 1,
      creator: {
        _id: this.props.userProfile._id,
        firstName: this.props.userProfile.firstName,
        lastName: this.props.userProfile.lastName,
      },
    });

    if (milestone.userName != '' && milestone.name != '' && milestone.description != '') {
      this.props.saveTask(milestone);
    }
  }

  handleMilestoneDelete(e) {
    e.preventDefault();

    const indexToDelete = Number(e.currentTarget.id);

    if (this.state.project.milestones.length > indexToDelete) {
      this.props.deleteTask(this.state.project.milestones[indexToDelete]._id);
    }
  }

  toggleMilestoneAddToTaskManager(e) {
    e.preventDefault();

    let milestoneIndex = Number(e.currentTarget.id);

    if (this.state.project.milestones.length > milestoneIndex) {
      const milestoneId = this.state.project.milestones[milestoneIndex]._id;
      const isPublished = !this.state.project.milestones[milestoneIndex].isHidden;

      if (isPublished) {
        this.taskUnpublishWithConfirmation(milestoneId);
      } else {
        this.props.setTaskPublished(milestoneId, !isPublished);
      }
    }
  }

  taskUnpublishWithConfirmation(milestoneId) {
    this.setState({ isWithdrawConfirmationInProgress: true });

    const url = `${ConfigMain.getBackendURL()}/taskGetById?id=${milestoneId}`;
    const that = this;

    Axios.get(url)
      .then(function(response) {
        if (response.data.assignees && response.data.assignees[0] && response.data.assignees[0]._id) {
          const Assignee = `${response.data.assignees[0].firstName} ${response.data.assignees[0].lastName}`;

          that.setState({
            assigneeNameToConfirm: Assignee,
            milestoneIdToRemove: milestoneId,
            confirmWithdrawPopupOpen: true,
          });
        } else {
          that.props.setTaskPublished(milestoneId, false);
        }
        that.setState({ isWithdrawConfirmationInProgress: false });
      })
      .catch(function(error) {
        that.setState({ isWithdrawConfirmationInProgress: false });
        console.log('Error: ' + error);
      });
  }

  renderConfirmWithdrawPopup() {
    return (
      <PopupConfirmWithdraw
        modalIsOpen={this.state.confirmWithdrawPopupOpen}
        assigneeName={this.state.assigneeNameToConfirm}
        onConfirmationPopupClose={confirm => this.handleConfirmationWithdrawPopupClose(confirm)}
      />
    );
  }

  handleConfirmationWithdrawPopupClose(confirm) {
    const milestoneIdToRemove = this.state.milestoneIdToRemove;

    if (confirm) {
      this.props.setTaskPublished(milestoneIdToRemove, false);

      const body = {
        _id: milestoneIdToRemove,
      };

      Axios.post(`${ConfigMain.getBackendURL()}/taskCancel`, body)
        .then(response => {})
        .catch(error => {
          console.log('Tasc cancel error');
        });
    }

    let copy = Object.assign({}, this.state, {
      assigneeNameToConfirm: '',
      milestoneIdToRemove: undefined,
      confirmWithdrawPopupOpen: false,
      isWithdrawConfirmationInProgress: false,
    });
    this.setState(copy);
  }

  renderModal() {
    return (
      <Modal
        isOpen={this.props.modalIsOpen}
        onRequestClose={() => this.handleClose()}
        contentLabel={'>Add a new Project'}
        parentSelector={getPopupParentElement}
      >
        <NewProjectForm
          milestoneTemp={this.state.milestoneTemp}
          isTaskSaveInProgress={this.props.isTaskSaveInProgress}
          isTasksUpdateInProgress={this.props.isTasksUpdateInProgress}
          isWithdrawConfirmationInProgress={this.state.isWithdrawConfirmationInProgress}
          handleChangeProject={e => this.handleChangeProject(e)}
          handleChangeMilestone={e => this.handleChangeMilestone(e)}
          handleMilestoneAdd={e => this.handleMilestoneAdd(e)}
          handleMilestoneDelete={e => this.handleMilestoneDelete(e)}
          toggleMilestoneAddToTaskManager={e => this.toggleMilestoneAddToTaskManager(e)}
          handleCloseAndSave={() => this.handleCloseAndSave()}
          roadmapsDetailed={this.props.roadmapsDetailed}
          project={this.state.project}
        />
      </Modal>
    );
  }

  handleClickOutside() {
    /* () => this.handleClose();*/
  }

  handleClose() {
    this.props.onCloseModal();
  }

  handleCloseAndSave() {
    if (!this.state.project.creationDate) {
      this.state.project.creationDate = Date.now();
    }

    this.props.onCloseModal(this.state.project);
  }

  render() {
    const content = this.state.confirmWithdrawPopupOpen
      ? this.renderConfirmWithdrawPopup()
      : this.renderModal();
    return <div>{content}</div>;
  }
}

PopupNewProject.propTypes = {
  fetchRoadmapsDetailsByIds: PropTypes.func.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
  userProfile: PropTypes.object.isRequired,
  tasks: PropTypes.array.isRequired,
  lastSavedTask: PropTypes.object.isRequired,
  roadmapsDetailed: PropTypes.array.isRequired,
  saveTask: PropTypes.func.isRequired,
  setLastSavedTask: PropTypes.func.isRequired,
  deleteTask: PropTypes.func.isRequired,
  setTaskPublished: PropTypes.func.isRequired,
  isTaskSaveInProgress: PropTypes.bool.isRequired,
  isTasksUpdateInProgress: PropTypes.bool.isRequired,
};

export default require('react-click-outside')(PopupNewProject);
