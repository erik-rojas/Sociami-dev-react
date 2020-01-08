import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withCookies, Cookies } from 'react-cookie';

import CharacterSelection from '~/src/character-creation/CharacterSelection';
import CharacterTraitsSelection from '~/src/character-creation/TraitsSelection';
import CharacterAuthentication from '~/src/character-creation/Authentication';

import ConfigMain from '~/configs/main';

import {
  setSelectedCharacterIndex,
  setSelectedCharacterTraitsIndex,
  startCharacterCreation,
  finishCharacterCreation,
  setCharacterCreationData,
  fetchListCharacterClasses,
  fetchListCharacterTraits,
} from '~/src/redux/actions/characterCreation';

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
      characterCreationState: undefined,
      characterCreationFlowStepIndex: undefined,
    };
  }

  componentWillMount() {
    this.props.fetchListCharacterClasses();
    this.props.fetchListCharacterTraits();
    this.restoreCharacterCreation();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.characterCreationData != this.props.characterCreationData ||
      this.state.characterCreationState != prevState.characterCreationState ||
      this.state.characterCreationFlowStepIndex != prevState.characterCreationFlowStepIndex
    ) {
      /*const { cookies } = this.props;

        if (cookies) {
            const characterCreationSave = cookies.get("characterCreation");

            if (!characterCreationSave || this.props.characterCreationData != characterCreationSave
            || characterCreationSave.state.index != this.state.characterCreationFlowStepIndex
            || characterCreation.state.data != this.state.characterCreationState) {

                let dateExpire = new Date();
                dateExpire.setTime(dateExpire.getTime() + ConfigMain.getCookiesExpirationPeriod()); 

                const options = { path: '/', expires: dateExpire};
                cookies.set("characterCreation", {
                    data: this.props.characterCreationData, 
                    state: {
                        index: this.state.characterCreationFlowStepIndex, 
                        data: this.state.characterCreationState
                      } 
                }, options); 
            }
        }*/
    }

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
            <CharacterSelection
              characterCreationState={this.state.characterCreationState}
              onClose={() => this.handleCloseCharacterCreation()}
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
              onClose={() => this.handleCloseCharacterCreation()}
              onHandleSignUpFacebook={() => this.props.onHandleSignUpFacebook()}
              onHandleSignUpLinkedIn={() => this.props.onHandleSignUpLinkedIn()}
              onHandleCreationFinish={() => this.props.finishCharacterCreation()}
              progressValue={progressValue}
              isAuthorized={this.props.isAuthorized}
            />
          );
          break;
        }
        default:
          break;
      }
    }

    return FormToRender;
  }

  restoreCharacterCreation() {
    /*const { cookies } = this.props;

    
    

    if (cookies) {
        
    }

    if (cookies) {
        const characterCreationSave = cookies.get("characterCreation");

        if (characterCreationSave) {
            this.props.setCharacterCreationData(characterCreationSave.data);
            this.setState({characterCreationState: characterCreationSave.state.data, characterCreationFlowStepIndex: characterCreationSave.state.index});
        }
    }*/
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
