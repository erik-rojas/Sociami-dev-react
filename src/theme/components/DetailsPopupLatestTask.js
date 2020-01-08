import React from 'react';
import Modal from 'react-modal';
import '~/src/css/PopupLatestTask.css';

import { getPopupParentElement } from '~/src/common/PopupUtils.js';

const TaskTypesToNameMap = { find_mentor: 'Find Mentor' };

class DetailsPopupLatestTask extends React.Component {
  constructor(props) {
    super(props);

    this.modalDefaultStyles = {};
  }

  componentWillMount() {
    this.modalDefaultStyles = Modal.defaultStyles;

    Modal.defaultStyles.content.border = '7px solid grey';
    Modal.defaultStyles.content.background = 'transparent';
    Modal.defaultStyles.content.overflow = 'visible';
    Modal.defaultStyles.content.padding = '0';
    Modal.defaultStyles.content['minWidth'] = '260px';
    Modal.defaultStyles.content['maxWidth'] = '800px';
    Modal.defaultStyles.content['height'] = 'initial';
    Modal.defaultStyles.content['minHeight'] = '500px';
    Modal.defaultStyles.content['marginLeft'] = 'auto';
    Modal.defaultStyles.content['marginRight'] = 'auto';
    Modal.defaultStyles.content['left'] = '0';
    Modal.defaultStyles.content['right'] = '0';
    Modal.defaultStyles.content['width'] = '800px';
    Modal.defaultStyles.content['color'] = 'white';
  }

  componentWillUnmount() {
    Modal.defaultStyles = this.modalDefaultStyles;
  }

  taskTypeToName(taskType) {
    return TaskTypesToNameMap[taskType];
  }

  renderDetails() {
    let title = this.props.task.roadmapName ? this.props.task.roadmapName : this.props.task.name;
    let userName = this.props.task.userName;
    let type = this.taskTypeToName(this.props.task.type);

    return (
      <Modal
        isOpen={this.props.modalIsOpen}
        onRequestClose={() => this.props.onCloseModal()}
        contentLabel={title}
      >
        <div className="container-fluid popup-latest-task">
          <a
            href="#"
            className="glyphicon glyphicon-remove"
            onClick={() => this.props.onCloseModal()}
            parentSelector={getPopupParentElement}
          />
          <div className="row">
            <div className="col-lg-12">
              <h2>{title}</h2>
              <p>{userName}</p>
              <p>{type}</p>
            </div>
          </div>
        </div>
      </Modal>
    );
  }

  handleClickOutside() {
    () => this.props.onCloseModal();
  }

  render() {
    return <div>{this.renderDetails()}</div>;
  }
}

export default require('react-click-outside')(DetailsPopupLatestTask);
