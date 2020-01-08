import React, { Component } from 'react';
import { connect } from 'react-redux';
import ConfigMain from '~/configs/main';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import Axios from 'axios';

import LeftNav from '~/src/theme/components/homepage/LeftNav';
import AchievementGroup from './AchievementGroup';
import Team from './Team';
import '~/src/theme/css/darkTheme.css';
import '~/src/theme/css/lightTheme.css';
import '~/src/theme/css/teams.css';

import { updateCompany } from '~/src/redux/actions/company';
import { fetchTeams, addNewTeam, saveTeam, addTeamEmail, updateTeamEmail, deleteTeam, cancelTeam } from '~/src/redux/actions/teams';
import { fetchAchievements, addAchievementGroup, updateAchievementGroup } from '~/src/redux/actions/achievements';
import { fetchRoadmapsFromAdmin } from '~/src/redux/actions/roadmaps';
import { fetchStories } from '~/src/redux/actions/story';

import plus from "~/src/theme/images/plus.png";
import cross from "~/src/theme/images/cross.png";
import cloud from "~/src/theme/images/cloud.png";
import deleteimg from "~/src/theme/images/delete.png";

const profilePic = 'https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/userProfile/default-profile.png';

class Company extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAddEmailExpanded: false,
      addEmail: "",
      addEmailError: false,
      company: props.company,
      addTeamGroupActive: false,
      addTeamGroup: "Select",
      addToTeam: {},
      achievements: [],
      achievementGroups: [],
      companyAchievementGroups: [],
      currentAchievementGroup: undefined,
      roadmaps: [],
      skills: [],
      IsQuestionsOpen: 'none',
      IsAchievementOpen: 'block',
      questions: []
    };

    this.handleCancel = this.handleCancel.bind(this);
    this.handleTeamSave = this.handleTeamSave.bind(this);
    this.handleEmailAdd = this.handleEmailAdd.bind(this);
    this.handleTeamDelete = this.handleTeamDelete.bind(this);
    this.handleEmailUpdate = this.handleEmailUpdate.bind(this);
    this.addCompanyEmail = this.addCompanyEmail.bind(this);
    this.deleteCompanyEmail = this.deleteCompanyEmail.bind(this);
    this.toggleQuestionsOption = this.toggleQuestionsOption.bind(this);
    this.toggleAchievementOption = this.toggleAchievementOption.bind(this);
    this.getQuestions = this.getQuestions.bind(this);
  }

  componentWillMount() {
    mixpanel.track("View Company");
    this.props.fetchTeams();
    this.props.fetchAchievements();
    this.props.fetchRoadmapsFromAdmin();
    this.props.fetchStories();
    this.getQuestions();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.isFetchingAchievementGroups && !this.props.isFetchingAchievementGroups) {
      let achievementGroups = this.props.achievementGroups;
      let companyAchievementGroups = [];
      _.each(achievementGroups, (group) => {
        _.set(group, 'key', _.get(group, '_id', ''));
        _.set(group, 'company', _.get(group, '_company'))
        _.set(group, 'achievements', _.get(group, '_achievements', []));

        if(group.company && (group.company._id == this.props.company._id || group.company.name == this.props.company.name)) {
          companyAchievementGroups.push(group);
        }
      })
      this.setState({ achievementGroups, companyAchievementGroups });
      let currentAchievementGroup = undefined;
      if(!this.state.currentAchievementGroup) {
        try {
          currentAchievementGroup = _.find(achievementGroups, group => {
            if(group.company) {
              return group.company._id == this.props.company._id || group.company.name == this.props.company.name;
            }
          });
        } catch(exp) {
        }
      }

      if(!currentAchievementGroup) {
        this.props.addAchievementGroup(this.props.company.name);
      } else if(currentAchievementGroup._id != 0) {
        this.setState({ currentAchievementGroup });
        let achievements = currentAchievementGroup.achievements;
        if(achievements) {
          _.each(achievements, (record) => {
            _.set(record, 'key', _.get(record, '_id', ''));
          });
          this.setState({ achievements });
        }
      }
    }
    if (prevProps.isFetchingRoadmaps && !this.props.isFetchingRoadmaps) {
      this.setState({ roadmaps: this.props.roadmaps });
    }
    if (prevProps.isFetchingSkills && !this.props.isFetchingSkills) {
      this.setState({ skills: this.props.skills });
    }
    if (prevProps.isAddingAchievementGroup && !this.props.isAddingAchievementGroup) {
      let currentAchievementGroup = this.props.getAchievementGroup;
      currentAchievementGroup['key'] = currentAchievementGroup._id;
      _.set(currentAchievementGroup, '_company', this.props.company._id);

      this.setState({ currentAchievementGroup });
      this.props.updateAchievementGroup(currentAchievementGroup);
    }
    if (prevProps.isUpdatingAchievementGroup && !this.props.isUpdatingAchievementGroup) {
      const newData = [...this.state.achievementGroups];
      let companyAchievementGroups = [...this.state.companyAchievementGroups];
      let currentAchievementGroup = this.state.currentAchievementGroup;
      _.set(currentAchievementGroup, 'company', this.props.company);
      this.setState({ currentAchievementGroup });
      let achievements = currentAchievementGroup.achievements;
      if(achievements) {
        _.each(achievements, (achievement) => {
          _.set(achievement, 'key', _.get(achievement, '_id', ''));
        });
        this.setState({ achievements });
      }

      this.setState({ achievementGroups: [currentAchievementGroup, ...newData], companyAchievementGroups: [currentAchievementGroup, ...companyAchievementGroups] });
    }
  }
  getQuestions(){
    const that = this;
    const url = `${ConfigMain.getBackendURL()}/questionsGet`
    Axios.get(url).then(function(response) {
      that.setState({ questions: response.data })
    }).catch(function(error) { console.log(error) });
  }
  // Upload questions
  uploadFile() {

    let data = new FormData();
    let fileData = this.fileUpload.files[0];
    data.append("csv", fileData);

     Axios.post(`${ConfigMain.getBackendURL()}/addQuestionsFile`, {
      body: data
    })
      .then(response => {
        console.log(response)
        this.getQuestions();
      })
      .catch(err => {
        console.log(err)
      });

  }

  toggleAddTeamGroupState() {
    this.setState({
      addTeamGroupActive: !this.state.addTeamGroupActive
    });
  }
  toggleQuestionsOption(){
    this.setState({IsQuestionsOpen: 'block',IsAchievementOpen: 'none' });
  }
  toggleAchievementOption(){
    this.setState({ IsQuestionsOpen: 'none', IsAchievementOpen: 'block' });
  }
  selectAddTeamGroup(addTeamGroup) {
    this.setState({
      addTeamGroupActive: !this.state.addTeamGroupActive,
      addTeamGroup
    });
  }

  renderAddTeamGroupSelect(options) {
    return (
      <div className="custom-select company-select">
        <select>
          {options.map((selectGroup, i) => {
            return(
              <option value={ selectGroup.value } key={ i }>{ selectGroup.label }</option>
            )
          })}
        </select>
        <div
          className={ this.state.addTeamGroupActive ? 'select-selected select-arrow-active' : 'select-selected' }
          onClick={ () => this.toggleAddTeamGroupState() }>
          { this.state.addTeamGroup }
        </div>

        <div
          className={ !this.state.addTeamGroupActive ? 'select-items select-hide' : 'select-items' }>
          {options.map((selectGroup, i) => {
            return(
              <div
                onClick={ () => this.selectAddTeamGroup(selectGroup.label) } key={ i }>
                { selectGroup.label }
              </div>
            )
          })}
        </div>
      </div>
    );
  }

  handleCancel(index, team) {
    this.props.cancelTeam(index, team);
  }

  handleTeamSave(index, team) {
    this.props.saveTeam(index, team);
  }

  handleEmailAdd(index, email, team) {
    this.props.addTeamEmail(index, email, team);
  }

  handleEmailUpdate(emailIndex, prevEmail, newEmail, team) {
    this.props.updateTeamEmail(emailIndex, prevEmail, newEmail, team);
  }

  handleTeamDelete(index, _id) {
    this.props.deleteTeam(index, _id);
  }

  validateEmail(email) {
    const pattern = /[a-zA-Z0-9]+[\.]?([a-zA-Z0-9]+)?[\@][a-z]{2,9}[\.][a-z]{2,5}/g;
    return pattern.test(email);
  }

  toggleAddEmailExpanded() {
    this.setState({ addEmailError: false, isAddEmailExpanded: !this.state.isAddEmailExpanded });
  }

  setEmailAddress(e) {
    this.setState({ addEmailError: false, addEmail: e.target.value });
  }

  addCompanyEmail() {
    let validEmail = this.validateEmail(this.state.addEmail.trim());
    if(validEmail) {
      this.setState({ addEmailError: false, addEmail: "" });
      let emails = this.state.company.emails;
      emails.push(this.state.addEmail);
      _.set(this, 'state.company.emails', emails);
      let company = this.state.company;
      this.props.updateCompany(company);
    } else {
      this.setState({ addEmailError: true });
    }
  }

  deleteCompanyEmail(email) {
    let emails = this.state.company.emails;
    _.remove(emails, e => e === email);
    _.set(this, 'state.company.emails', emails);
    let company = this.state.company;
    this.props.updateCompany(company);
  }

  renderAchievementGroups(achievementGroups) {
    let groups = achievementGroups.map((group, index) => {
      return <AchievementGroup
        key={group._id}
        index={index}
        group={group}
        company={this.state.company}
        achievements={this.state.achievements}
        achievementGroups={this.state.achievementGroups}
        companyAchievementGroups={this.state.companyAchievementGroups}
        currentAchievementGroup={this.state.currentAchievementGroup}
        roadmaps={this.state.roadmaps}
        skills={this.state.skills} />;
    });
    return groups;
  }

  renderTeams(teams) {
    let list = teams.map((team, index) => {
      return <Team
        key={team._id}
        index={index}
        team={team}
        onCancel={(val) => this.handleCancel(index, val)}
        onSave={(val) => this.handleTeamSave(index, val)}
        onAddEmail={(email, teams) => this.handleEmailAdd(index, email, teams)}
        onUpdateEmail={(emailIndex, prevEmail, newEmail, teams) => this.handleEmailUpdate(emailIndex, prevEmail, newEmail, teams)}
        onDeleteTeam={(_id) => this.handleTeamDelete(index, _id)}
        company={this.state.company}
        achievements={this.state.achievements}
        achievementGroups={this.state.achievementGroups}
        companyAchievementGroups={this.state.companyAchievementGroups}
        currentAchievementGroup={this.state.currentAchievementGroup}
        roadmaps={this.state.roadmaps}
        skills={this.state.skills} />;
    });
    return list;
  }

  render() {
    const { userProfile } = this.props;
    const { company, questions } = this.state;
    return (
      <div className={`${this.props.userProfile.theme.toLowerCase()}-theme-wrapper settings-wrapper main-bg profile-wrapper`}>
        <div className="row">
          <div className="container">
            <div className="row">
              <div className="row">
                <LeftNav
                  accounting={this.props.accounting}
                  userProfile={userProfile}
                  profilePic={userProfile.pictureURL ? userProfile.pictureURL : profilePic} 
                />

                <div className="col-middle company-middle-wrapper ml-fixed">
                  <div className="col-box-wp wider-strip mb-20 p-0">
                    <ul className="tab-wp">
                      <li className={this.state.IsAchievementOpen == 'block' ? 'active' : ''}><a href="javascript:;" onClick={this.toggleAchievementOption}>Achievement</a></li>
                      <li><a href="#">Story</a></li>
                      <li><a href="#">Benefits</a></li>
                      <li className={this.state.IsQuestionsOpen == 'block' ? 'active' : ''}><a href="javascript:;" onClick={this.toggleQuestionsOption}>Questions</a></li>
                      <li style={{float: 'right'}}>
                        <label htmlFor="upload-input">
                          <img src={cloud}/>
                          <input id="upload-input" name="file" type="file" accept=".csv" ref={(ref) => this.fileUpload = ref} style={{display: 'none'}} onChange={value => this.uploadFile()} /> 
                        </label>
                        <img style={{marginLeft: '7px'}} src={deleteimg}/>
                      </li>
                    </ul>
                  </div>                 
                  <div style={{ display: this.state.IsAchievementOpen }}>
                    <div className="theme-box-right">
                      <div className="box">
                        <div className="devider-box">
                          <div className="top-sec-wp">
                            <h3>{company.name}</h3>
                            <div className="box-wp bb-0">
                              <button className="btn-yellow" onClick={() => this.toggleAddEmailExpanded()}>Admin +</button>
                              <div className="company-new-filed" style={{ display: this.state.isAddEmailExpanded ? 'inline-block' : 'none' }}>
                                <input
                                  type="email"
                                  placeholder="Enter email address"
                                  value={this.state.addEmail}
                                  onChange={e => this.setEmailAddress(e)}
                                />
                                <a onClick={() => this.addCompanyEmail()}>Add</a>
                                <span className="close-new-company" onClick={() => this.toggleAddEmailExpanded()}>&#120273;</span>
                              </div>
                              {this.state.addEmailError ? <span style={{color: "red"}}>Please enter valid email address</span> : ''}
                              <ul>
                                {
                                  company.emails.map((email, index) => {
                                    return <li key={index}><a href="#">{email} <span className="cross-icon" onClick={() => this.deleteCompanyEmail(email)}>&#120273;</span></a></li>
                                  })
                                }
                              </ul>
                            </div>
                            {/* <div className="box-wp bb-0">
                              <h5>moderators</h5>
                              <ul>
                                <li><a href="#">danielshen083@gmail.com <span className="cross-icon">&#120273;</span></a></li>
                                <li><a href="#">danielshen083@gmail.com <span className="cross-icon">&#120273;</span></a></li>
                              </ul>
                            </div> */}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="theme-box-right">
                      <div className="box">
                        <div className="devider-box">
                          <h3>General Achievement Group <span><a href="#" className="change-btn txt-purpal"> Add +</a></span></h3>
                          {
                            !this.props.isFetchingAchievementGroups &&
                            this.renderAchievementGroups(this.state.companyAchievementGroups)
                          }
                          <div className="top-sec-wp mt-20">
                            <h3>Teams
                              { this.renderAddTeamGroupSelect([{value: "", label: "Select"}, {value: "AddTeam", label: "Add Team"}, {value: "AddAchievementGroup", label: "Add Achievement Group"}]) }
                            </h3>
                          </div>

                          {
                            !this.props.isFetchingAchievementGroups &&
                            this.renderTeams(this.props.teams)
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ display: this.state.IsQuestionsOpen }} className="col-middle questions company-middle-wrapper ml-fixed">
                  <div id="questions" className="theme-box-right">
                    <div className="box" style={{ padding: '1px' }}>
                          <div className="table-responsive">
                            <table className="table table-bordered">
                              <thead>
                                <tr>
                                  <th></th>
                                  <th>Question</th>
                                  <th>Roadmap/Skill</th>
                                  <th>Category</th>
                                  <th>SubCategory</th>
                                  <th>Description</th>
                                  <th>Conditions</th>
                                  <th>Evaluation</th>
                                  <th>Complexity</th>
                                  <th>Company</th>
                                </tr>
                              </thead>
                              <tbody>
                              {
                                _.map(questions,(que, index)=>{
                                  return(
                                    <tr>
                                      <td></td>
                                      <td>{que.question}</td>
                                      <td>{que.roadmapSkill}</td>
                                      <td>{que.category}</td>
                                      <td>{que.subCategory}</td>
                                      <td>{que.description}</td>
                                      <td>{que.conditions}</td>
                                      <td></td>
                                      <td></td>
                                      <td></td>
                                    </tr>
                                  )
                                })
                              }                              
                              </tbody>
                            </table>
                          </div>                                         
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isUpdatingCompany: state.company.isUpdatingCompany,
  updatedCompany: state.company.company,
  isFetchingTeams: state.teams.isFetchingTeams,
  teams: state.teams.data,
  isFetchingAchievementGroups: state.achievements.isFetchingAchievements,
  achievementGroups: state.achievements.data,
  isAddingAchievementGroup: state.addAchievementGroup.isAddingAchievementGroup,
  getAchievementGroup: state.addAchievementGroup.data,
  isUpdatingAchievementGroup: state.updateAchievementGroup.isUpdatingAchievementGroup,
  isFetchingRoadmaps: state.roadmapsAdmin.isFetching,
  roadmaps: state.roadmapsAdmin.data,
  isFetchingSkills: state.skills.isFetchingSkills,
  skills: state.skills.data
});

const mapDispatchToProps = dispatch => ({
  updateCompany: bindActionCreators(updateCompany, dispatch),
  fetchTeams: bindActionCreators(fetchTeams, dispatch),
  addNewTeam: bindActionCreators(addNewTeam, dispatch),
  cancelTeam: bindActionCreators(cancelTeam, dispatch),
  saveTeam: bindActionCreators(saveTeam, dispatch),
  addTeamEmail: bindActionCreators(addTeamEmail, dispatch),
  updateTeamEmail: bindActionCreators(updateTeamEmail, dispatch),
  deleteTeam: bindActionCreators(deleteTeam, dispatch),
  fetchAchievements: bindActionCreators(fetchAchievements, dispatch),
  addAchievementGroup: bindActionCreators(addAchievementGroup, dispatch),
  updateAchievementGroup: bindActionCreators(updateAchievementGroup, dispatch),
  fetchRoadmapsFromAdmin: bindActionCreators(fetchRoadmapsFromAdmin, dispatch),
  fetchStories: bindActionCreators(fetchStories, dispatch)
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Company));
