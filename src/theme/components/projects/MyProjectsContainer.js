/*
    author: Alexander Zolotov
*/
import React from 'react';

import MyProjects from './MyProjects';
import ActionLink from '~/src/components/common/ActionLink';

const MyProjectsContainer = props => {
  return (
    <div id="project-manager-projects-container">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-12">
            <div className="content-2-columns-left-title">My Projects</div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div id="project-manager-projects-bg">
              <div id="projects-list-container">
                <MyProjects
                  projects={props.projects}
                  isAuthorized={props.isAuthorized}
                  isProjectsFetchInProgress={props.isProjectsFetchInProgress}
                  isProjectSaveInProgress={props.isProjectSaveInProgress}
                  openModalWithProject={index => props.openModalWithProject(index)}
                />
                <ActionLink href="#" onClick={() => props.openModal()}>
                  <span className="glyphicon glyphicon-plus-sign" id="project-manager-add-project-btn" />
                </ActionLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProjectsContainer;
