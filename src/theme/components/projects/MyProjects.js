/*
    author: Alexander Zolotov
*/
import React from 'react';
import { Icon } from 'react-fa';

import ActionLink from '~/src/components/common/ActionLink';

const MyProjects = props => {
  if (props.isProjectsFetchInProgress || props.isProjectSaveInProgress) {
    return (
      <ul>
        <li>
          <h3>
            Retrieving data. Please, wait... <Icon spin name="spinner" />
          </h3>
        </li>
      </ul>
    );
  }

  if (!props.isAuthorized || !props.projects || props.projects.length == 0) {
    return null;
  }

  const DummyImages = [
    'http://sociamibucket.s3.amazonaws.com/assets/images/custom_ui/medium.png',
    'http://sociamibucket.s3.amazonaws.com/assets/images/custom_ui/howcast.png',
  ];

  return (
    <ul>
      {props.projects.map(function(project, i) {
        return (
          <li key={i}>
            <ActionLink href="#" onClick={() => props.openModalWithProject(i)}>
              <div className="projects-list-item">
                <img src={DummyImages[Math.floor(Math.random() * (DummyImages.length - 0)) + 0]} />
                <div id="project-text">
                  <div id="title">{project.name}</div>
                  <div id="desctiption>">
                    {project.description}
                    <i id="icon-share" className="fa fa-share-alt" aria-hidden="true" />
                  </div>
                </div>
              </div>
            </ActionLink>
          </li>
        );
      })}
    </ul>
  );
};

export default MyProjects;
