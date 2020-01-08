import React from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';

import { ProgressBar } from 'react-bootstrap';

import { getPopupParentElement } from '~/src/common/PopupUtils.js';

import { Icon } from 'react-fa';

import ActionLink from '~/src/components/common/ActionLink';

// import './common.css';
// import './characterSelection.css';

class CharacterSelection extends React.Component {
  constructor(props) {
    super(props);
    this.modalDefaultStyles = {};

    this.state = {
      mouseOveredIndex: undefined,
    };
  }

  componentWillMount() {
    this.modalDefaultStyles = Modal.defaultStyles;

    Modal.defaultStyles.content.background = 'white';
    Modal.defaultStyles.content.color = 'initial';

    Modal.defaultStyles.content['height'] = 'auto';
    // Modal.defaultStyles.content["width"] = '75%';

    Modal.defaultStyles.content['width'] = '1093px';

    Modal.defaultStyles.content['minWidth'] = 'initial';
    Modal.defaultStyles.content['maxWidth'] = 'initial';
    Modal.defaultStyles.content['overflowX'] = 'hidden';
    Modal.defaultStyles.content['overflowY'] = 'hidden';
    Modal.defaultStyles.content['marginLeft'] = 'auto';
    Modal.defaultStyles.content['marginRight'] = 'auto';
    Modal.defaultStyles.content['left'] = '0';
    Modal.defaultStyles.content['right'] = '0';
    Modal.defaultStyles.content['padding'] = '0px 0px 0px 0px';
  }

  componentWillUnmount() {
    Modal.defaultStyles = this.modalDefaultStyles;
  }

  handleClickOutside() {
    /* () => this.handleClose();*/
  }

  handleClose() {
    this.props.onClose();
  }

  handleChangeSelectedChatacter(index) {
    this.props.onSelect(index);
  }

  handleCharacterSelectConfirm() {
    this.props.onClose();
  }

  handleMouseOverCharacter(index) {
    this.setState({ mouseOveredIndex: index });
  }

  handleMouseOutCharacter() {
    this.setState({ mouseOveredIndex: undefined });
  }

  renderCharacters(characters, firstIndex, lastIndex) {
    return (
      <div className="col-sm-4 col-xs-5 character-column">
        {characters.map((character, i) => {
          if (i >= firstIndex && i <= lastIndex) {
            return (
              <div className="col-xs-12 col-sm-6 character-box" key={i}>
                <div
                  className={`character-selection-button character-order-${i} ${
                    this.props.selectedIndex == i ? 'character-selected' : ''
                  }`}
                  onClick={() => this.handleChangeSelectedChatacter(i)}
                  onMouseOver={() => this.handleMouseOverCharacter(i)}
                  onMouseOut={() => this.handleMouseOutCharacter()}
                >
                  <img src={this.props.charactersList[i].imageURL} />
                </div>
                <p className="character-text">{this.props.charactersList[i].name}</p>
              </div>
            );
          }
        })}
      </div>
    );
  }

  render() {
    if (this.props.isFetchingCharacters) {
      return (
        <Modal
          isOpen={true}
          onRequestClose={() => {}}
          contentLabel={'Character Selection'}
          parentSelector={getPopupParentElement}
        >
          <Icon
            onClick={() => this.handleClose()}
            className="character-creation-popup-close-icon"
            name="times"
            aria-hidden="true"
          />
          <div id="character-selection-container">
            <div id="character-selection-container-inner">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-lg-12">
                    <Icon spin name="spinner" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      );
    }
    const SelectedCharacter = this.state.mouseOveredIndex
      ? this.props.charactersList[this.state.mouseOveredIndex]
      : this.props.charactersList[this.props.selectedIndex];

    return (
      <Modal
        isOpen={true}
        onRequestClose={() => {}}
        contentLabel={'Character Selection'}
        parentSelector={getPopupParentElement}
      >
        <Icon
          onClick={() => this.handleClose()}
          className="character-creation-popup-close-icon"
          name="times"
          aria-hidden="true"
        />
        <div id="character-selection-container">
          <div className="box-head character-header">
            <h1 className="create-character-heading">
              <span>Select Your House</span>
            </h1>
          </div>
          <div className="row character-row">
            {this.renderCharacters(this.props.charactersList, 0, this.props.charactersList.length - 1)}
            {/* <div className="col-sm-8 col-xs-9 choose-house-column">
                    <div className="choose-house-text">
                      <h1 className="choose-house-header">
                        CHOOSE HOUSE
                      </h1>
                      <h5 className="choose-house-desc">
                        Team members will be suggested to you based on your house, including benefits that can aid you progressions.
                      </h5>
                      <div id="character-select-confirm-button-container" className="select-character-button">
                        <ActionLink href="#" onClick={()=>this.props.onNextStep({characterTraitsIndex: this.props.selectedIndex})}
                          className="btn-base-landing btn-red-landing btn-login-landing text-uppercase"
                           id="character-select">
                          Select
                        </ActionLink>
                      </div>
                    </div>
                  </div> */}

            <div className="character-center">
              <div className="text-center" id="character-info">
                <div id="character-name">
                  <div className="text-uppercase">{SelectedCharacter.name}</div>
                </div>
                <div id="character-description">
                  {SelectedCharacter.description1 && <p>{SelectedCharacter.description1}</p>}
                  {SelectedCharacter.description2 && <p>{SelectedCharacter.description2}</p>}
                  {SelectedCharacter.description3 && <p>{SelectedCharacter.description3}</p>}
                </div>
                <div id="character-skills">
                  {SelectedCharacter.skills.map((skill, i) => {
                    return (
                      <span className="character-skill text-uppercase" key={i}>
                        {skill}
                      </span>
                    );
                  })}
                </div>
              </div>
              <div id="character-select-confirm-button-container" className="text-center">
                <ActionLink
                  href="#"
                  onClick={() => this.props.onNextStep({ characterTraitsIndex: this.props.selectedIndex })}
                  className="btn-base-landing btn-red-landing btn-login-landing text-uppercase"
                  id="character-select"
                >
                  Select
                </ActionLink>
              </div>
            </div>
          </div>
          <div className="character-creation-progressbar-container character-selection-progressbar">
            <ProgressBar striped bsStyle="danger" now={this.props.progressValue} />
          </div>
        </div>
      </Modal>
    );
  }
}

CharacterSelection.propTypes = {};

export default require('react-click-outside')(CharacterSelection);
