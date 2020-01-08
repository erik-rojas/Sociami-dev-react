/*
    author: Alexander Zolotov
*/

import React from 'react';

import { Icon } from 'react-fa';

import ActionLink from '~/src/components/common/ActionLink';

const formatDate = function(time, splitter, mmddyy) {
  let date = new Date(time);
  let theyear = date.getFullYear();
  let themonth = date.getMonth() + 1;
  let thetoday = date.getDate();
  if (mmddyy) {
    return `${themonth}${splitter}${thetoday}${splitter}${theyear}`;
  }
  return `${theyear}${splitter}${themonth}${splitter}${thetoday}`;
};

const renderHeader = function() {
  return (
    <span>
      <div className="row">
        <div className="col-lg-12">
          <div className="header">
            <h5>Add a new Project</h5>
            <div>
              Do you have a project you are working on that you would like to share or get help with your
              friends?
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-6">
          <div className="create-project-desc-column">
            <div className="glyphicon glyphicon-bitcoin" />
            <div>
              <b>Use your Tokens</b>
            </div>
            <p>You can use tokens you have earned to create projects that your heart desires.</p>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="create-project-desc-column">
            <div className="glyphicon glyphicon glyphicon-tint" />
            <div>
              <b>Your Friends</b>
            </div>
            <p>These projects contain Milestones that create tasks for your friends to help!</p>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <span>Tip: you can even create your desired final year project here!</span>
          <hr />
        </div>
      </div>
    </span>
  );
};

const renderFormContent = function(props) {
  let roadmapNames = [];

  if (props.roadmapsDetailed.length > 0) {
    for (let i = 0; i < props.roadmapsDetailed.length; ++i) {
      if (roadmapNames.indexOf(props.roadmapsDetailed[i].name) == -1) {
        roadmapNames.push(props.roadmapsDetailed[i].name);
      }
    }
  } else {
    roadmapNames = [
      'Blockchain',
      'HTML5',
      'Javascript',
      'Etherium',
      'ReactJS',
      'Java',
      'Bitcoin',
      'Crypto-Currency',
      'PHP',
      'NodeJS',
      'AJAX',
      'Full-Stack',
      'Front-End',
    ];
  }

  const ProjectNatureDataList = (
    <span>
      <input
        type="text"
        id="project_nature"
        name="city"
        list="roadmaps"
        className="text-field form-control validate-field required"
        onChange={e => props.handleChangeProject(e)}
        value={props.project.nature}
      />
      <datalist id="roadmaps">
        <select>
          {roadmapNames.map(function(roadmapName, i) {
            return <option label={roadmapName} value={roadmapName} key={i} />;
          })}
        </select>
      </datalist>
    </span>
  );

  return (
    <span>
      <div className="row">
        <div className="col-lg-12">
          <h5>
            <span className="badge project-section-badge">1</span>Project Details
          </h5>
          <div>Tell us more about your project</div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="form-group">
            <input
              type="text"
              className="text-field form-control validate-field required"
              data-validation-type="string"
              id="project_name"
              name="project_name"
              autoComplete="off"
              placeholder="Name of Project"
              autoFocus
              onChange={e => props.handleChangeProject(e)}
              value={props.project.name}
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="form-group">
            <textarea
              id="project_desc"
              placeholder="Please Describe Your Project"
              className="form-control validate-field required"
              name="project_desc"
              onChange={e => props.handleChangeProject(e)}
              value={props.project.description}
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <h5>
            <span className="badge project-section-badge">2</span>Project Nature
          </h5>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-6">
          <div className="form-group input-group">
            <span className="input-group-addon">
              <i className="glyphicon glyphicon-search" />
            </span>
            {ProjectNatureDataList}
          </div>
        </div>
        <div className="col-lg-6">
          <div>
            {props.roadmapsDetailed.length > 0 ? 'You have this roadmap' : "You don't have any roadmaps yet"}
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <h5>
            <span className="badge project-section-badge">3</span>Milestone Creator
          </h5>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-6">
          <div className="form-group input-group">
            <input
              type="text"
              className="text-field form-control validate-field required"
              data-validation-type="string"
              id="milestone_name"
              name="milestone_name"
              autoComplete="off"
              placeholder="Milestone name"
              onChange={e => props.handleChangeMilestone(e)}
              value={props.milestoneTemp.name}
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-6">
          <div className="form-group">
            <textarea
              id="milestone_desc"
              placeholder="Please describe the Milestone"
              className="form-control validate-field required"
              name="milestone_desc"
              onChange={e => props.handleChangeMilestone(e)}
              value={props.milestoneTemp.description}
            />
          </div>
        </div>
        <div className="col-lg-6">
          <div className="milestone-add-button">
            <ActionLink
              href="#"
              className="popup-new-project-link-default"
              onClick={e => props.handleMilestoneAdd(e)}
              style={{ color: 'black' }}
            >
              <i className="glyphicon glyphicon-plus" />
              <div>Add</div>
            </ActionLink>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-4">
          <div className="form-group">
            <input
              type="number"
              className="text-field form-control validate-field required"
              data-validation-type="number"
              id="milestone_price"
              name="milestone_price"
              autoComplete="off"
              placeholder="Min Token"
              onChange={e => props.handleChangeMilestone(e)}
              value={props.milestoneTemp.price}
              min="1"
            />
          </div>
        </div>
        <div className="col-lg-8">
          <div className="form-group">
            <input
              type="date"
              className="text-field form-control validate-field required"
              data-validation-type="string"
              id="milestone_date"
              name="milestone_date"
              autoComplete="off"
              placeholder="Date"
              onChange={e => props.handleChangeMilestone(e)}
              defaultValue={formatDate(props.milestoneTemp.date, '-')}
            />
          </div>
        </div>
        <div className="col-lg-12">
          <div>How many tokens will be provided</div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <hr />
        </div>
      </div>
    </span>
  );
};

const renderMilestoneControls = function(props, milestone, i) {
  if (!milestone.isHidden) {
    return (
      <span>
        <div className="col-lg-12">
          <div className="create-project-desc-column">
            <ActionLink
              href="#"
              id={i}
              className="popup-new-project-link-default"
              onClick={e => props.toggleMilestoneAddToTaskManager(e)}
            >
              <i className="glyphicon glyphicon-bullhorn project-popup-milestone-control-icon" />
              <div>Withdraw</div>
            </ActionLink>
          </div>
        </div>
      </span>
    );
  } else {
    return (
      <span>
        <div className="col-lg-6">
          <div className="create-project-desc-column">
            <ActionLink
              href="#"
              id={i}
              className="popup-new-project-link-default"
              onClick={e => props.toggleMilestoneAddToTaskManager(e)}
            >
              <i className="glyphicon glyphicon-bullhorn project-popup-milestone-control-icon" />
              <div>Add to Task Mg</div>
            </ActionLink>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="create-project-desc-column">
            <ActionLink
              href="#"
              id={i}
              className="popup-new-project-link-default"
              onClick={e => props.handleMilestoneDelete(e)}
            >
              <i className="glyphicon glyphicon-minus project-popup-milestone-control-icon" />
              <div>Delete</div>
            </ActionLink>
          </div>
        </div>
      </span>
    );
  }
};

const renderMileStones = function(props) {
  if (props.isTaskSaveInProgress || props.isTasksUpdateInProgress || props.isWithdrawConfirmationInProgress) {
    return (
      <p>
        Retrieving data. Please, wait... <Icon spin name="spinner" />
      </p>
    );
  }

  let milestones = props.project.milestones;

  if (milestones.length == 0) {
    return null;
  }

  return (
    <span className="milestones-container">
      {milestones.map(function(milestone, i) {
        return (
          <div className="row single-milestone" key={i}>
            <div className="col-lg-1">
              <i className="glyphicon glyphicon-hourglass project-popup-milestone-control-icon" />
            </div>
            <div className="col-lg-11">
              <div className="col-lg-4">
                <b>{milestone.name}</b>
              </div>
              <div className="col-lg-4">
                <span>
                  {milestone.price}
                  {milestone.price > 1 ? ' Tokens' : ' Token'}
                </span>
              </div>
              <div className="col-lg-4">
                <span>{formatDate(milestone.date, '/', true)}</span>
              </div>
              <div className="col-lg-12">
                <p>{milestone.description}</p>
              </div>
              {renderMilestoneControls(props, milestone, i)}
            </div>
          </div>
        );
      })}
    </span>
  );
};

const renderFooter = function(props) {
  return (
    <span>
      <div className="row">
        <div className="col-lg-12">
          <hr />
        </div>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="close-button-container">
            <button
              type="button"
              className="btn btn-lg btn-outline button-close"
              onClick={() => props.handleCloseAndSave()}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </span>
  );
};

function PopupNewProjectForm(props) {
  const Header = renderHeader();
  const FormContent = renderFormContent(props);
  const Milestones = renderMileStones(props);
  const Footer = renderFooter(props);
  return (
    <div className="container-fluid popup-new-project">
      {Header}
      {FormContent}
      {Milestones}
      {Footer}
    </div>
  );
}

export default PopupNewProjectForm;
