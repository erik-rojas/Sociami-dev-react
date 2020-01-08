import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withCookies, Cookies } from 'react-cookie';

import CharacterTraitsSelection from "~/src/theme/components/characterCreation/CharacterTraitsSelection";
import CharacterHouseSelection from "~/src/theme/components/characterCreation/CharacterHouseSelection";
import CharacterAuthentication from "~/src/theme/components/characterCreation/CharacterAuthentication";

import ConfigMain from '~/configs/main';

import {
  setUserProfileCharacter,
} from '~/src/redux/actions/authorization';

import {
  setSelectedCharacterIndex,
  setSelectedCharacterTraitsIndex,
  startCharacterCreation,
  finishCharacterCreation,
  setCharacterCreationData,
  fetchListCharacterClasses,
  fetchListCharacterTraits,
} from '~/src/redux/actions/characterCreation';

import '~/src/theme/css/characterCreation.css';

const SELECT_TRAITS = 'SelectTraits';
const SELECT_CHARACTER = 'SelectCharacter';
const SELECT_AUTH_METHOD = 'SelectAuthMethod';

const CharacterCreationFlowData = [
  {
    step: SELECT_TRAITS,
    data: {
      selectedIndex: 0,
    },
  },
  {
    step: SELECT_CHARACTER,
    data: {
      selectedIndex: 0,
    },
  },
  {
    step: SELECT_AUTH_METHOD,
  },
];

class CharacterCreationFlow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isCharacterCreationFlowActive: false,
      characterCreationState: {
        step: SELECT_TRAITS,
        data: {
          selectedIndex: 0,
        },
      },
      characterCreationFlowStepIndex: undefined,
    };
  }

  componentWillMount() {
    this.props.fetchListCharacterClasses();
    this.props.fetchListCharacterTraits();
    this.startCharacterCreation()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.characterCreationData.isInProgress != this.props.characterCreationData.isInProgress) {
      if (this.props.characterCreationData.isInProgress) {
        this.startCharacterCreation();
      }
    }
  }

  handleCloseCharacterCreation() {
    this.props.finishCharacterCreation();
  }

  startCharacterCreation() {
    const StartFlowIndex = 0;
    this.setState({
      characterCreationState: CharacterCreationFlowData[StartFlowIndex],
      characterCreationFlowStepIndex: StartFlowIndex,
    });
  }

  characterCreationPreviousStep() {
    // if (this.state.characterCreationState.step == SELECT_TRAITS && this.props.isAuthorized) {
    //   this.props.onHandleCharacterDataSet();
    //   this.handleCloseCharacterCreation();
    // } else {
      const characterCreationFlowStepIndex =
        (this.state.characterCreationFlowStepIndex - 1) % CharacterCreationFlowData.length;
      this.setState({
        characterCreationState: CharacterCreationFlowData[characterCreationFlowStepIndex],
        characterCreationFlowStepIndex: characterCreationFlowStepIndex,
      });
  }

  characterCreationNextStep() {
    if (this.state.characterCreationState.step == SELECT_CHARACTER && this.props.isAuthorized) {
      this.props.onHandleCharacterDataSet();
      this.handleCloseCharacterCreation();
    } else {
      const characterCreationFlowStepIndex =
        (this.state.characterCreationFlowStepIndex + 1) % CharacterCreationFlowData.length;
      this.setState({
        characterCreationState: CharacterCreationFlowData[characterCreationFlowStepIndex],
        characterCreationFlowStepIndex: characterCreationFlowStepIndex,
      });
    }
  }

  handleSelectCharacterTraits(index) {
    this.props.setSelectedCharacterTraitsIndex(index);
  }

  handleSelectCharacter(index) {
    this.props.setSelectedCharacterIndex(index);
  }

  getCharacterCreationData() {
    let data = undefined;

    if (this.props.characterCreationData && this.props.characterCreationData.isInProgress) {
      data = {
        characterName: this.props.listCharacters[this.props.characterCreationData.selectedCharacterIndex]
          .name,
        characterImage:  this.props.listCharacters[this.props.characterCreationData.selectedCharacterIndex].imageUrl,
        characterId: this.props.listCharacters[this.props.characterCreationData.selectedCharacterIndex]._id,
        traitsName: this.props.listCharacterTraits[this.props.characterCreationData.selectedTraitsIndex].name,
        traitsIndex: this.props.characterCreationData.selectedTraitsIndex,
        characterIndex: this.props.characterCreationData.selectedCharacterIndex,
      };
    }

    return data;
  }

  renderCharacterCreationForm() {
    let FormToRender = null;

    const progressValue =
      ((this.state.characterCreationFlowStepIndex + 1) / CharacterCreationFlowData.length) * 100;

    if (this.props.characterCreationData.isInProgress && this.state.characterCreationState) {
      switch (this.state.characterCreationState.step) {
        case SELECT_TRAITS: {
          FormToRender = (
            <CharacterTraitsSelection
              characterCreationState={this.state.characterCreationState}
              onClose={() => this.handleCloseCharacterCreation()}
              onNextStep={() => this.characterCreationNextStep()}
              onSelect={index => this.handleSelectCharacterTraits(index)}
              selectedIndex={this.props.characterCreationData.selectedTraitsIndex}
              traitsList={this.props.listCharacterTraits}
              progressValue={progressValue}
              isFetchingCharacterTraits={this.props.isFetchingCharacterTraits}
            />
          );
          break;
        }
        case SELECT_CHARACTER: {
          FormToRender = (
            <CharacterHouseSelection
              characterCreationState={this.state.characterCreationState}
              onClose={() => this.handleCloseCharacterCreation()}
              onPreviousStep={() => this.characterCreationPreviousStep()}
              onNextStep={() => this.characterCreationNextStep()}
              onSelect={index => this.handleSelectCharacter(index)}
              selectedIndex={this.props.characterCreationData.selectedCharacterIndex}
              charactersList={this.props.listCharacters}
              characterCreationData={this.props.characterCreationData}
              progressValue={progressValue}
              isFetchingCharacters={this.props.isFetchingCharacters}
            />
          );
          break;
        }
        case SELECT_AUTH_METHOD: {
          FormToRender = (
            <CharacterAuthentication
              characterCreationState={this.state.characterCreationState}
              onPreviousStep={() => this.characterCreationPreviousStep()}
              onClose={() => this.handleCloseCharacterCreation()}
              onHandleSignUpFacebook={() => this.props.onHandleSignUpFacebook()}
              onHandleSignUpLinkedIn={() => this.props.onHandleSignUpLinkedIn()}
              onHandleCreationFinish={() => this.props.finishCharacterCreation()}
              progressValue={progressValue}
              isAuthorized={this.props.isAuthorized}
              getCharacterCreationData= {() => this.getCharacterCreationData()}
            />
          );
          break;
        }
        default:
          FormToRender = (
            <CharacterTraitsSelection
              characterCreationState={this.state.characterCreationState}
              onClose={() => this.handleCloseCharacterCreation()}
              onNextStep={() => this.characterCreationNextStep()}
              onSelect={index => this.handleSelectCharacterTraits(index)}
              selectedIndex={this.props.characterCreationData.selectedTraitsIndex}
              traitsList={this.props.listCharacterTraits}
              progressValue={progressValue}
              isFetchingCharacterTraits={this.props.isFetchingCharacterTraits}
            />
          );
          break;
      }
    }
    return FormToRender;
  }

  render() {
    return this.renderCharacterCreationForm();
  }
}

CharacterCreationFlow.propTypes = {
  characterCreationData: PropTypes.object.isRequired,
  listCharacterTraits: PropTypes.array.isRequired,
  listCharacters: PropTypes.array.isRequired,
  setSelectedCharacterIndex: PropTypes.func.isRequired,
  setSelectedCharacterTraitsIndex: PropTypes.func.isRequired,
  startCharacterCreation: PropTypes.func.isRequired,
  finishCharacterCreation: PropTypes.func.isRequired,
  setCharacterCreationData: PropTypes.func.isRequired,
  fetchListCharacterClasses: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  setSelectedCharacterIndex: bindActionCreators(setSelectedCharacterIndex, dispatch),
  setSelectedCharacterTraitsIndex: bindActionCreators(setSelectedCharacterTraitsIndex, dispatch),
  startCharacterCreation: bindActionCreators(startCharacterCreation, dispatch),
  finishCharacterCreation: bindActionCreators(finishCharacterCreation, dispatch),
  setCharacterCreationData: bindActionCreators(setCharacterCreationData, dispatch),
  fetchListCharacterClasses: bindActionCreators(fetchListCharacterClasses, dispatch),
  fetchListCharacterTraits: bindActionCreators(fetchListCharacterTraits, dispatch),
});

const mapStateToProps = state => ({
  characterCreationData: state.characterCreationData,
  listCharacterTraits: state.characterCreation.listCharacterTraits,
  listCharacters: state.characterCreation.listCharacters,
  isFetchingCharacters: state.characterCreation.isFetchingCharacters,
  isFetchingCharacterTraits: state.characterCreation.isFetchingCharacterTraits,
  isAuthorized: state.userProfile.isAuthorized,
});

//withRouter - is a workaround for problem of shouldComponentUpdate when using react-router-v4 with redux
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withCookies(CharacterCreationFlow));
