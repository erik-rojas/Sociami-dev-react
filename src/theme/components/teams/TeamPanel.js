import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';

import Modal from 'react-modal';
import { Icon } from 'react-fa';
import Img from 'react-image';
import _ from 'lodash';

import EmailBlock from './EmailBlock';
import AddAchievementModal from './AddAchievementModal';

import { fetchAchievementGroups, updateAchievementGroup } from '~/src/redux/actions/achievements';

class TeamPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addEmailBoolean: false,
      deleteModal: false,
      renameTitle: !props.team._id,
      addAchievementsFlag: false,
      achievements: props.achievements,
      achievementGroups: props.achievementGroups,
      currentAchievementGroup: props.currentAchievementGroup,
      roadmapData: props.roadmaps,
      skillsData: props.skills,
      achievementId: 0
    };

    this.updateTeamName = this.updateTeamName.bind(this);
    this.toggleEmailAdd = this.toggleEmailAdd.bind(this);
    this.toggleEditTitle = this.toggleEditTitle.bind(this);
    this.addEmail = this.addEmail.bind(this);
    this.handleDeleteTeam = this.handleDeleteTeam.bind(this);
    this.cancelRename = this.cancelRename.bind(this);
    this.handleUpdateEmail = this.handleUpdateEmail.bind(this);
  }

  componentWillMount() {
    this.modalDefaultStyles = Modal.defaultStyles;

    Modal.defaultStyles.content.background = 'white';
    Modal.defaultStyles.content.color = 'initial';
    Modal.defaultStyles.content['position'] = 'relative';
    Modal.defaultStyles.content['height'] = '100px';
    Modal.defaultStyles.content['width'] = '300px';

    Modal.defaultStyles.content['minWidth'] = 'initial';
    Modal.defaultStyles.content['maxWidth'] = 'initial';
    Modal.defaultStyles.content['overflowX'] = 'hidden';
    Modal.defaultStyles.content['overflowY'] = 'hidden';
    Modal.defaultStyles.content['marginLeft'] = 'auto';
    Modal.defaultStyles.content['marginRight'] = 'auto';
    Modal.defaultStyles.content['top'] = '50%';
    Modal.defaultStyles.content['left'] = '50%';
    Modal.defaultStyles.content['margin'] = '0';
    Modal.defaultStyles.content['transform'] = 'translate(-50%, -50%)';
    Modal.defaultStyles.content['boxShadow'] = '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)';
  }

  componentDidUpdate(prevProps) {
    if (this.props.team._id !== prevProps.team._id || this.props.team.name !== prevProps.team.name) {
      this.setState({renameTitle: !this.props.team._id});
    }
    if (this.props.team.emails.length !== prevProps.team.emails.length) {
      this.setState({addEmailBoolean: false});
    }
    if (this.props.achievements.length !== prevProps.achievements.length) {
      this.setState({ achievements: this.props.achievements });
    }
    if (this.props.achievementGroups.length !== prevProps.achievementGroups.length) {
      this.setState({ achievementGroups: this.props.achievementGroups });
    }
    if (this.props.currentAchievementGroup !== prevProps.currentAchievementGroup) {
      this.setState({ currentAchievementGroup: this.props.currentAchievementGroup });
    }
    if (this.props.roadmaps.length !== prevProps.roadmaps.length) {
      this.setState({ roadmapData: this.props.roadmaps });
    }
    if (this.props.skills.length !== prevProps.skills.length) {
      this.setState({ skillsData: this.props.skills });
    }
    if (prevProps.isFetchingAchievementGroups && !this.props.isFetchingAchievementGroups) {
      let achievementGroups = this.props.achievementGroups;
      _.each(achievementGroups, (record) => {
        _.set(record, 'key', _.get(record, '_id', ''));
        _.set(record, 'company', _.get(record, '_company'))
        _.set(record, 'achievements', _.get(record, '_achievements', []));
      })
      this.setState({ achievementGroups });
      let currentAchievementGroup = _.find(achievementGroups, group => {
        if(group.company) {
          return group.company._id == this.props.company._id || group.company.name == this.props.company.name;
        }
      });

      this.setState({ currentAchievementGroup });
      let achievements = currentAchievementGroup.achievements;
      if(achievements) {
        _.each(achievements, (record) => {
          _.set(record, 'key', _.get(record, '_id', ''));
        });
        this.setState({ achievements });
      }
    }
    if (prevProps.isUpdatingAchievementGroup && !this.props.isUpdatingAchievementGroup) {
      this.props.fetchAchievementGroups();
    }
  }

  addEmailToTeam() {
    this.setState({ addEmailBoolean: !this.state.addEmailBoolean });
  }

  cancelEmail(){
    this.setState({ addEmailBoolean: !this.state.addEmailBoolean });
    this.props.onCancel(this.props.team);
  }

  deleteTeam() {
    this.setState({ deleteModal: !this.state.deleteModal });
  }

  toggleEmailAdd(){
    this.setState(prevState => ({addEmailBoolean : !prevState.addEmailBoolean}))
  }
  
  updateTeamName() {
    let team = Object.assign({}, this.props.team);
    team['name'] = this.teamNameInupt.value;
    this.props.onSave(team);
  }

  toggleEditTitle(){
    this.setState(prevState => ({renameTitle: !prevState.renameTitle}));
  }

  cancelRename(){
    this.setState(prevState => ({renameTitle: !prevState.renameTitle}));
    this.props.onCancel(this.props.team);
  }

  handleUpdateEmail(emailIndex,emailObj,newEmail) {
    this.props.onUpdateEmail(emailIndex, emailObj.email, newEmail, this.props.team);
  }

  renderEmails(emails) {
    let listItems = emails.map((item, index) => {
      return <EmailBlock email={item} onSave={(val) => this.handleUpdateEmail(index,item,val)} key={index} index={index} />;
    });

    return listItems;
  }

  addEmail() {
    this.props.onAddEmail(this.addEmailInupt.value, this.props.team);
  }

  handleDeleteTeam() {
    this.props.onDeleteTeam(this.props.team._id);
  }

  closeAddAchievementsModal() {
    this.setState({ addAchievementsFlag: false });
  }
  getAchievementGroup(achievement) {
    if(achievement) {
      let record = this.state.currentAchievementGroup;
      let achievementIds = _.map(record.achievements, v => v._id);
      if(achievement.action == 'create') {
        achievementIds.push(achievement.id);
      } else if(achievement.action == 'delete') {
        _.remove(achievementIds, function (e) {
          return e == achievement.id;
        });
      }
      _.set(record, '_achievements', achievementIds)

      this.props.updateAchievementGroup(record);
    }

    this.closeAddAchievementsModal();
  }

  editAchievement(achievementId) {
    this.setState({ achievementId })
  }

  render() {
    const { team, index } = this.props;

    let header;
    if (this.state.renameTitle) {
      header = (
        <div className="team-headers">
          <div className="team-titles">
            <div className="team-title">
              <div className="team-email-item-editing">
                <div className="team-email-edit-box">
                  <input className="team-email-edit-input" defaultValue={team.name} ref={input=>{ this.teamNameInupt = input }} />
                  <div className="team-email-edit-options">
                    <a className="pull-left team-email-edit-button team-email-cancel-btn" onClick={this.cancelRename}>Cancel</a>
                    <a className="pull-right team-email-edit-button  team-email-save-btn" onClick={this.updateTeamName}>Save</a>
                  </div>
                </div>

                <div className="email-edit-lightbox">
                </div>
              </div>
            </div>
            <div className="team-date">{team.date}</div>
          </div>
        </div>
      );
    } else {
      header = (
        <div className="team-headers">
          <div className="team-titles">
            <div className="team-title">{team.name}</div>
            <div className="team-date">{team.date}</div>
          </div>
          <div className="btn-group team-menu-group">
            <button
              type="button"
              id="team-menu"
              className="team-menu dropdown-toggle"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <i className="fa fa-bars" />
            </button>
            <ul
              className="dropdown-menu team-dropdown-menu"
              style={{ right: '0', left: 'auto', minWidth: '70px' }}
            >
              <li>
                <a href="#" onClick={this.toggleEditTitle}>Rename</a>
              </li>
              <li>
                <a onClick={() => this.deleteTeam()}>Delete</a>
              </li>
            </ul>
          </div>
        </div>
      );
    }
    let footer;
    if (this.state.addEmailBoolean) {
      footer = (
        <div className="team-add-email-input">
          <div className="">
            <input className="team-email-input" type="text" ref={input=>{ this.addEmailInupt = input }} />
          </div>

          <div className="team-email-options">
            <a className="pull-left" onClick={() => this.cancelEmail()}>
              Cancel
            </a>
            <a className="pull-right" onClick={this.addEmail}>Add</a>
          </div>
        </div>
      );
    } else {
      // footer = (
      //   <div className="team-add-email">
      //     <a className="team-add-email-link" onClick={() => this.addEmailToTeam()}>
      //       <i className="fa fa-plus" /> Add new email
      //     </a>
      //   </div>
      // );
      footer = (
        <a className="team-add-email" style={{
          justifyContent: 'space-between',
          paddingLeft: '10px',
          paddingRight: '10px',
          height: '60px',
          fontSize: '20px'}}>
          <div style={{ display: 'flex', flexDirection: 'column'}}>
            <span style={{fontSize: '16px'}}>Achievements</span>
            <span style={{display: 'flex', flexDirection: 'row'}}>
            {
              _.map(this.state.achievements, achievement => {
                const id = achievement._id;
                const image = `https://s3.us-east-2.amazonaws.com/admin.soqqle.com/achievementImages/${id}?date=${new Date().toISOString()}`;
                return (
                  <span key={id}
                    style={{
                      border: '2px solid #ffc225',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      display: 'inline-block',
                      overflow: 'hidden',
                      position: 'relative',
                      marginRight: '3px'
                    }}
                  >
                    <Img src={this.props.company.imageUrl}
                      style={{maxWidth: 135, maxHeight: 120}}
                      onError={(e) => {
                        e.target.src=this.props.company.imageUrl}
                      }
                      onClick={() => this.setState({ achievementId: id, addAchievementsFlag: true })}
                    />
                    {/* <i className="fa fa-yahoo" onClick={() => this.setState({ achievementId: id, addAchievementsFlag: true })} /> */}
                  </span>
                )
              })
            }
              {/* <i className="fa fa-yahoo" />
              <i className="fa fa-fighter-jet" />
              <i className="fa fa-mobile" />
              <i className="fa fa-whatsapp" /> */}
            </span>
          </div>
          <span className="team-add-email-link" style={{fontSize: '30px'}}>
            <i className="fa fa-plus-circle" onClick={() => this.setState({ achievementId: 0, addAchievementsFlag: true })} />
          </span>
        </a>
      );
    }

    let deleteModalPopup;

    if (this.state.deleteModal) {
      deleteModalPopup = (
        <Modal isOpen={true} onRequestClose={() => this.deleteTeam()} contentLabel={'Delete Team'}>
          {/* parentSelector={getPopupParentElement}> */}
          <div className="delete-team-popup">
            <span
              aria-hidden="true"
              onClick={() => this.deleteTeam()}
              className=" character-creation-popup-close-icon"
            />

            <p>
              Do you want to delete <strong>{this.props.team.name}</strong> ?
            </p>
            <div className="delete-team-btn-group">
              <button className="btn delete-team-btn-yes" onClick={this.handleDeleteTeam}>Yes</button>
              <button className="btn  delete-team-btn-no" onClick={() => this.deleteTeam()}>
                No
              </button>
            </div>
          </div>
        </Modal>
      );
    }

    return (
      <div className="team-container" key={index}>
        {
          this.state.addAchievementsFlag &&
          <AddAchievementModal
            isOpen={this.state.addAchievementsFlag}
            onClose={() => this.setState({addAchievementsFlag: false})}
            getAchievementGroup={this.getAchievementGroup.bind(this)}
            achievements={this.state.achievements}
            currentAchievementGroup={this.state.currentAchievementGroup}
            roadmapData={this.state.roadmapData}
            skillsData={this.state.skillsData}
            achievementId={this.state.achievementId}
          />
        }
        {deleteModalPopup}
        <div className="team-list">
          {header}
          <div style={{padding: '15px', clear: 'both'}}>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <span style={{ fontSize: '12px'}}>Primary Keywords: </span>
              <div className="team-email-item" style={{
                background: 'transparent',    
                boxShadow: 'none',
                width: 'auto',
                cursor: 'pointer',
                padding: '0',
                margin: '0',
                height: 'auto',
                marginLeft: '5px',}}>
                <span style={{ fontSize: '17px'}}>Retail</span>
                <a className="fa fa-pencil edit-team-email-checkbox" />
              </div>
            </div>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <span style={{ fontSize: '12px'}}>Secondary Keywords: </span>
              <div className="team-email-item" style={{
                background: 'transparent',    
                boxShadow: 'none',
                width: 'auto',
                cursor: 'pointer',
                padding: '0',
                margin: '0',
                height: 'auto',
                marginLeft: '5px',}}>
                <span style={{ fontSize: '17px'}}>Customer</span>
                <a className="fa fa-pencil edit-team-email-checkbox" />
              </div>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '10px'}}>
              <button className="ptree-btn ptree-view">
                <Icon style={{ color: 'black' }} name="users" /> 
                <span style={{marginLeft: '5px'}}>View Roles</span>
              </button>
              <button className="ptree-btn ptree-start">Dashboard</button>
            </div>
          </div>
          <div style={{ marginTop: 0 }} className="team-email-container">{this.renderEmails(team.emails)}</div>
        </div>

        {footer}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isFetchingAchievementGroups: state.achievementGroups.isFetchingAchievementGroups,
  achievementGroups: state.achievementGroups.data,
  isUpdatingAchievementGroup: state.updateAchievementGroup.isUpdatingAchievementGroup,
  updateAchievementGroup: state.updateAchievementGroup.data
});

const mapDispatchToProps = dispatch => ({
  fetchAchievementGroups: bindActionCreators(fetchAchievementGroups, dispatch),
  updateAchievementGroup: bindActionCreators(updateAchievementGroup, dispatch)
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TeamPanel));
