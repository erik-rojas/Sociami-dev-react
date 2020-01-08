import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';

import Img from 'react-image';
import _ from 'lodash';

import AddAchievementModal from '~/src/theme/components/teams/AddAchievementModal';

import { fetchAchievementGroups, updateAchievementGroup } from '~/src/redux/actions/achievements';

class AchievementGroup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addAchievementsFlag: false,
      achievements: props.achievements,
      achievementGroups: props.achievementGroups,
      currentAchievementGroup: props.currentAchievementGroup,
      roadmapData: props.roadmaps,
      skillsData: props.skills,
      achievementId: 0
    };
  }

  componentDidUpdate(prevProps) {
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
    const { group, index } = this.props;

    return (
      <div className="achievement-group-wp" key={group._id}>
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
        <h4>{group.name} <span className="cross-icon">&#120273;</span></h4>
        <ul>
          {
            group.achievements.map((achievement) => {
              const id = achievement._id;
              return (
                <li key={achievement._id}>
                  <img
                    className="achievement-badge-icon" 
                    onClick={() => {
                      this.setState({ achievementId: id, addAchievementsFlag: true })
                    }}
                    src={ 
                      `https://s3.us-east-2.amazonaws.com/admin.soqqle.com/achievementImages/${achievement._id}?date=${new Date().toISOString()}`
                    }
                    onError={(e) => {
                      e.target.src=this.props.company.imageUrl
                    }
                    }
                  />
                </li>
              )
            })
          }
          <li><span><a onClick={() => this.setState({ achievementId: 0, addAchievementsFlag: true })}>+</a></span></li>
        </ul>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AchievementGroup));
