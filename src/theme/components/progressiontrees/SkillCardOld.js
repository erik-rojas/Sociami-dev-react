/*
    author: Akshay Menon
*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Axios from 'axios';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Icon } from 'react-fa';

import { fetchRoadmaps, fetchRoadmapsFromAdmin } from '~/src/redux/actions/roadmaps';

import { startProgressionTree, stopProgressionTree } from '~/src/redux/actions/authorization';

import { saveTask } from '~/src/redux/actions/tasks';
import { userInteractionPush } from '~/src/redux/actions/userInteractions';

import ConfigMain from '~/configs/main';

import '~/src/theme/css/SkillCard.css';

import UserInteractions from '~/src/common/UserInteractions';
import TaskTypes from '~/src/common/TaskTypes';
import HangoutSubmitForm from '~/src/theme/components/progressiontrees/HangoutSubmitForm';
import TrendScannerComponent from '~/src/theme/components/trends/TrendScannerComponent';


const RandomInt = function RandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

class SkillCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isTaskSelected: false,
      flipCardClass: false,
      openVideo: false,
      tree: undefined,
      selectedTask: undefined,
      selectedSkill: undefined,
      isHangoutFormVisible: false,
      TrendScannerComponentVisible: false
    };
  }

  componentDidMount() {
    const treeId = this.props.skillItem._id;
    if (treeId) {
      this.setState({ isLoading: true });
      Axios
        .get(`${ConfigMain.getBackendURL()}/roadmapGet?id=${treeId}`)
        .then(response => this.treeFetchSuccess(response))
        .catch(error => this.treeFetchFailed(error));
    } else {
      this.setState({ isLoading: false });
    }
  }

  treeFetchSuccess(response) {
    this.setState({ isLoading: false, tree: response.data });
  }

  treeFetchFailed(error) {
    this.setState({ isLoading: false });
  }

  toggleTaskView() {
    this.setState({ isTaskSelected: !this.state.isTaskSelected });
  }

  flipCard() {
    this.setState({ flipCardClass: !this.state.flipCardClass });
  }

  handleSelectCategory(e) {
    this.props.selectResultsCategory(e.currentTarget.id);
  }
  
  startTask() {
    if(this.state.selectedTask && this.state.selectedSkill) {
      if(this.state.selectedTask == "Deepdive"){
        this.setState({
          isHangoutFormVisible: true
          }
        )
      }else{
        this.props.onStart(this.state.selectedTask, this.state.selectedSkill, this.state.tree);
        this.setState({
          isHangoutFormVisible: false,
          isTaskSelected: false,
          selectedTask: undefined,
          selectedSkill: undefined,
          flipCardClass: false
          }
        )
      }
    }
  }
  

  quickStart() {
    this.props.onQuickStart(this.state.tree);
  }

  selectSkill(e, selectedSkill) {

    const url = `${ConfigMain.getBackendURL()}/skillGet?name=${selectedSkill}`;
    const that = this;
    that.setState({ isLoading: true, isHangoutFormVisible: false });
    Axios.get(url)
      .then(function(response) {
        that.setState({ skillInfo: response.data, selectedSkill, isLoading: true, isHangoutFormVisible: false });
      })
      .catch(function(error) {
        that.setState({ skillInfo: undefined, selectedSkill, isLoading: true, isHangoutFormVisible: false });
      });

    $('.pskill-banner').removeClass('active');
    $(e.target)
      .closest('div.pskill-banner')
      .addClass('active');
  }

  selectTask(e, selectedTask) {




    this.setState({ selectedTask });
    $('.ptask-banner').removeClass('active');
    $(e.target)
      .closest('div.ptask-banner')
      .addClass('active');
  }

  onPlayVideo() {
    this.setState({ openVideo: !this.state.openVideo });
  }

  renderVideo() {
    return (
      <div className="ptree-video-lightbox" onClick={() => this.onPlayVideo()}>
        <div className="ptree-video-container">
          <iframe
            className="ptree-video"
            width="420"
            height="345"
            id="intro-video"
            src="https://www.youtube.com/embed/i8PJgSclIf0"
          />
          <a
            className="fa fa-2x fa-times"
            style={{ color: 'white', verticalAlign: 'top' }}
            onClick={() => this.onPlayVideo()}
          />
        </div>
      </div>
    );
  }

  renderSkills(skills) {
    const that = this;
    //TODO: Fix incorrect database structure
    let skillParsed = skills.length > 1 ? skills : skills[0].split(',');
    for (let i = 0; i < skillParsed.length; ++i) {
      skillParsed[i] = skillParsed[i].trim();
    }
    const listItems = skillParsed.map(function(skill, i) {
      return (
        <div className="pskill-banner" onClick={e => that.selectSkill(e, skill)} key={i}>
          <div className="pskill-name">{skill}</div>
          <div className="ptree-checkmark-div">
            <div className="ptree-checkmark" />
          </div>
        </div>
      );
    });
    return listItems;
  }

  renderTaskCard(skillItem) {
    return (
      <div>
        <div className="ptree-back-header">Select task to continue.</div>
        <div className="ptree-task-list">
          <div className="ptask-banner" onClick={e => this.selectTask(e, 'Illuminate')}>
            <div className="ptask-left">
              <div className="ptask-name">Illuminate</div>
              <div className="ptask-desc">30 min 3 questions</div>
            </div>
            <div className="ptask-right">
              <img
                src="https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/custom_ui/Single.png"
                className="ptask-img-single"
              />
            </div>
          </div>

          <div className="ptask-banner" onClick={e => this.selectTask(e, 'Deepdive')}>
            <div className="ptask-left">
              <div className="ptask-name">Deepdive</div>
              <div className="ptask-desc">30 min 10 questions</div>
            </div>
            <div className="ptask-right">
              <img
                src="https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/custom_ui/Two.png"
                className="ptask-img-double"
              />
            </div>
          </div>

          <div className="ptask-banner" onClick={e => this.selectTask(e, 'XXX')}>
            <div className="ptask-left">
              <div className="ptask-name">XXX</div>
              <div className="ptask-desc">xxx</div>
            </div>
            <div className="ptask-right">
              <img
                src="https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/custom_ui/Two.png"
                className="ptask-img-double"
              />
            </div>
          </div>

          <div className="ptask-banner" onClick={e => this.selectTask(e, 'Brainstorm')}>
            <div className="ptask-left">
              <div className="ptask-name">Brainstorm</div>
              <div className="ptask-desc">60 min 1 challenge</div>
            </div>
            <div className="ptask-right">
              <img
                src="https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/custom_ui/Group.png"
                className="ptask-img-group"
              />
            </div>
          </div>
        </div>
        <div className="pskill-btn-group ptree-btn-group">
          <button className="ptree-btn ptree-back" onClick={() => this.flipCard()}>
            Back
          </button>
          <button className="ptree-btn ptree-next" onClick={() => this.toggleTaskView()}>
            Next
          </button>
        </div>
      </div>
    );
  }

  renderSkillCard() {
    return (
      <div className="ptree-skill-list">
        <div className="ptree-back-header">
          <div>Select one skill to improve it.</div>
          <a className="view-video" onClick={() => this.onPlayVideo()}>
            View the video >
          </a>
        </div>

        <div className="ptree-skill-set">{this.renderSkills(this.state.tree.weightage1)}</div>

        <div className="ptree-skill-set-btn-group">
          <button className="ptree-btn ptree-back" onClick={() => this.toggleTaskView()}>
            Back
          </button>
          <button disabled={!this.state.selectedTask || !this.state.selectedSkill} className="ptree-btn ptree-next" onClick={() => this.startTask()}>
            Start
          </button>
        </div>
      </div>
    );
  }

  getImgUrl(img) {
    let imgJson;
    if (img == 'Miner') {
      imgJson = {
        imgUrl:'https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/custom_ui/miner_glow.png',
        imgClass : 'progression-tree-hero-img'
      }
    } else if (img == 'Nomad') {
      imgJson = {
        imgUrl:'https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/custom_ui/Nomad_LoRes.png',
        imgClass : 'progression-tree-hero-img'
      }
    } else if (img == 'Innovator') {
      imgJson = {
        imgUrl:'https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/custom_ui/innovator.png',
        imgClass : 'progression-tree-hero-img'
      }
    } else if (img == 'Blockforce'){
      imgJson = {
        imgUrl:'https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/heroes/Blockforce.png',
        imgClass : 'progression-tree-blockforce-img'
      }
    }else{
      imgJson = {
        imgUrl:'https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/custom_ui/innovator.png',
        imgClass : 'progression-tree-hero-img'
      }
    }
    return imgJson;
  }

  onCloseModal() {
    this.setState({ isIlluminateFormVisible: false, isHangoutFormVisible: false });
  }

  handleToggle() {
    this.setState({ IsDisplayForm: 'none' });
  }

  toggleTrendScannerComponent() {
    this.setState({
      TrendScannerComponentVisible: true,
      isHangoutFormVisible: true,
    });
  }

  handleTimeChange(e) {
    e.preventDefault();
  }

  handleStartHangout(date) {
    const CurrentTree = this.state.tree;

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
            _id: this.state.skillInfo._id,
            name: this.state.skillInfo.skill,
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

    if (hangout.userName != '' && hangout.name != '' && hangout.description != '') {
      this.props.saveTask(hangout);

      if (this.props.userProfile && this.props.userProfile._id) {
        this.props.userInteractionPush(
          this.props.userProfile._id,
          UserInteractions.Types.ACTION_EXECUTE,
          UserInteractions.SubTypes.DEEPDIVE_START,
          {
            roadmapId: CurrentTree._id,
            skillId: this.state.skillInfo._id,
            deepdiveTime: date.getTime(),
          },
        );
      }
    }

    this.setState({ isHangoutFormVisible: false });
  }

  render() {
    const { skillItem } = this.props;
    const flipClass = this.state.flipCardClass ? ' hover' : '';
    const CardPanel = this.state.isTaskSelected
      ? this.renderSkillCard(skillItem)
      : this.renderTaskCard(skillItem);
    const VideoPanel = this.state.openVideo ? this.renderVideo() : null;
    const imgJson = this.getImgUrl(skillItem.heroimg)
    return (
      <div className="col-md-6 col-sm-12 progression-tree-skill-container">
        {VideoPanel}

        <HangoutSubmitForm
        isHangoutFormVisible={this.state.isHangoutFormVisible}
        onHandleStartHangout={date => this.handleStartHangout(date)}
        onTimeChange={e => handleTimeChange(e)}
        toogleTrenScan={() => this.toggleTrendScannerComponent()}
        handleToggle={() => this.handleToggle()}
        onCloseModal={() => this.onCloseModal()} />


        <div className="progression-tree-skill-content">
          <div className="progression-tree-skill-item">
            <div className="progression-tree-hero-container col-md-6 col-sm-12">
              <img src={imgJson.imgUrl} className={imgJson.imgClass} />
            </div>
            <div className="progression-tree-skill-card col-md-6 col-sm-12">
              <div className={`ptree-card-item` + flipClass}>
                <div className="ptree-card">
                  <div className="ptree-card-front">
                    <div className="ptree-card-heading">{skillItem.name}</div>
                    <span className="ptree-yellow-bar" />
                    <div className="ptree-card-body">{skillItem.description}</div>
                    <div className="pskill-btn-group ptree-btn-group">
                      <button className="ptree-btn ptree-start" disabled={this.props.quickStartProgress} onClick={() => this.quickStart()}>
                        Quick start   { this.props.quickStartProgress && <Icon spin name="spinner" /> }
                      </button>
                      <button className="ptree-btn ptree-view" onClick={() => this.flipCard()}>
                        View tasks
                      </button>
                    </div>
                  </div>
                  <div className="ptree-card-back">{CardPanel}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* remove Trend scanner as of iteration 2 */}

        {/* {this.state.TrendScannerComponentVisible && (
            <div className="row">
              <div className="col-lg-12">
                <div id="skill-breakdown-trend-scanner">
                  <TrendScannerComponent
                    onHandleSelectCategory={e => this.handleSelectCategory(e)}
                    resultsSelectedCategory={this.props.resultsSelectedCategory}
                    isFetchInProgress={this.props.isFetchInProgress}
                    searchResults={this.props.searchResults}
                  />
                </div>
              </div>
            </div>
          )} */}
          
      </div>
    );
  }
}

SkillCard.propTypes = {
  userInteractionPush: PropTypes.func.isRequired,
  saveTask: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  resultsSelectedCategory: state.resultsSelectedCategory,
  searchResults: state.searchResults,
  isFetchInProgress: state.isFetchInProgress,
  saveTask
});

const mapDispatchToProps = dispatch => ({
  userInteractionPush: bindActionCreators(userInteractionPush, dispatch),
  saveTask: bindActionCreators(saveTask, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SkillCard);
