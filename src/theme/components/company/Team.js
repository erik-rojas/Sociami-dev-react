import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';

import Modal from 'react-modal';
import { Icon } from 'react-fa';
import Img from 'react-image';
import _ from 'lodash';

import EmailBlock from '~/src/theme/components/teams/EmailBlock';
import AddAchievementModal from '~/src/theme/components/teams/AddAchievementModal';

import { fetchAchievementGroups, updateAchievementGroup } from '~/src/redux/actions/achievements';

class Team extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addEmailBoolean: false,
      deleteModal: false,
      renameTitle: !props.team._id,
      addAchievementsFlag: false,
      achievements: props.achievements,
      achievementGroups: props.achievementGroups,
      companyAchievementGroups: props.companyAchievementGroups,
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
    if (this.props.companyAchievementGroups.length !== prevProps.companyAchievementGroups.length) {
      this.setState({ companyAchievementGroups: this.props.companyAchievementGroups });
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
      let companyAchievementGroups = [];
      _.each(achievementGroups, (record) => {
        _.set(record, 'key', _.get(record, '_id', ''));
        _.set(record, 'company', _.get(record, '_company'))
        _.set(record, 'achievements', _.get(record, '_achievements', []));

        if(group.company && (group.company._id == this.props.company._id || group.company.name == this.props.company.name)) {
          companyAchievementGroups.push(group);
        }
      })
      this.setState({ achievementGroups, companyAchievementGroups });
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

    return (
      <div key={index}>
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
        <div className="top-sec-wp">
          <div className="box-wp bb-0">
            <h5>{team.name}</h5>
            <ul>
              {
                team.emails.map((email, index) => {
                  return <li key={index}><a href="#">{email.email} <span className="cross-icon">&#120273;</span></a></li>
                })
              }
            </ul>
          </div>
        </div>
        {
          _.map(this.state.companyAchievementGroups, achievementGroup => {
            return (
              <div className="achievement-group-wp" key={achievementGroup._id}>
                <h4>{achievementGroup.name} <span className="cross-icon">&#120273;</span></h4>
                <ul>
                  {
                    _.map(this.state.achievements, achievement => {
                      const id = achievement._id;
                      return (
                        <li key={`${team._id}-${achievement._id}`}>
                          <img 
                            className="achievement-badge-icon" 
                            src={`https://s3.us-east-2.amazonaws.com/admin.soqqle.com/achievementImages/${achievement._id}?date=${new Date().toISOString()}`}
                            onError={(e) => {
                              e.target.src=this.props.company.imageUrl}
                            }
                            onClick={() => this.setState({ achievementId: id, addAchievementsFlag: true })}
                          />
                        </li>
                      )
                    })
                  }
                  <li><span><a onClick={() => this.setState({ achievementId: 0, addAchievementsFlag: true })}>+</a></span></li>
                </ul>
              </div>
            )
          })
        }
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Team));
