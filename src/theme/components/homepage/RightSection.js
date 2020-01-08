import React, { Component } from 'react';
import _ from 'lodash';

class RightSection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      previousSkillId: "",
      currentSkillId: "",
      nextSkillId: "",
      roadmaps: []
    };
  }

  componentWillMount() {
    if (!this.props.skills.isFetchingSkills) {
      const skills = this.props.skills.skills;
      this.setState({
        currentSkillId: (skills[0] === undefined ? "" : skills[0]._id),
        nextSkillId: (skills[1] === undefined ? "" : skills[1]._id)
      });
    }
    if (!this.props.roadmapsAdmin.isFetching) {
      this.setState({ roadmaps: this.props.roadmapsAdmin.data });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.skills.isFetchingSkills && !this.props.skills.isFetchingSkills) {
      const skills = this.props.skills.skills;
      this.setState({
        currentSkillId: (skills[0] === undefined ? "" : skills[0]._id),
        nextSkillId: (skills[1] === undefined ? "" : skills[1]._id)
      });
    }
    if (prevProps.roadmapsAdmin.isFetching && !this.props.roadmapsAdmin.isFetching) {
      this.setState({ roadmaps: this.props.roadmapsAdmin.data });
    }
  }

  rewardDisplay(skill) {
    let rewardDisplay = '';
    const type = _.get(skill, 'reward.type');

    if (type === 'Token' || type === 'Fiat') {
      rewardDisplay = `${_.get(skill, 'reward.value')} ${type}`;
    } else if (type === 'Achievement') {
      rewardDisplay = _.get(skill, 'reward._achievement.name', '');
    }
    return <span>{rewardDisplay}</span>;
  }

  skill(skill) {
    const { roadmaps } = this.state;
    const { userProfile } = this.props;
    const userProgressionTreeLevels = userProfile.progressionTreeLevels;
    let widthPercent = 0;
    let currentRoadmap = _.find(roadmaps, roadmap => {
      if(roadmap.weightage1.length > 0) {
        return _.includes(roadmap.weightage1, skill.skill)
      }
    });
    let currentUserProgressionTreeLevel = undefined;
    if(currentRoadmap !== undefined) {
      currentUserProgressionTreeLevel = _.find(userProgressionTreeLevels, level => {
        return level.name == currentRoadmap.name
      });
    }
    if(currentUserProgressionTreeLevel !== undefined) {
      widthPercent = Math.round((currentUserProgressionTreeLevel.currentLevelXP / currentUserProgressionTreeLevel.totalXP) * 10);
    }
    return (
      <div key={skill._id} style={{ display: this.state.currentSkillId == skill._id ? 'block' : 'none' }}>
        <div className="box">
          <div className="games-network-wp">
            <h3 className="col-heading">{_.get(skill, 'skill')}</h3>
            <p>{_.get(skill, 'description')}</p>
            <div className="fot-wp">
              <p className="text-uppercase text-center">You will receive</p>
              <ul className="bttons-right-box">
                <li><a href="#">{this.rewardDisplay(skill)}</a></li>
              </ul>
              <p>
                {`Complete 0/${_.get(skill, 'objectiveValue', 0)}
                  ${_.get(skill, '_objective.name', '')}`}
                <a href="#" className="btn-join pull-right">Accept</a>
              </p>
            </div>
          </div>
        </div>
        {
          currentUserProgressionTreeLevel !== undefined && (
            <div className="box-bottom-right-col">
              <div className="fot-wp">
                <p className="text-uppercase text-center">{ currentUserProgressionTreeLevel.name }</p>
                <div className="games-network-wp">
                  <ul>
                    <li>
                      <span className="helf-wp">
                        <a href="#" className="btn-lavel-yellow">level { currentUserProgressionTreeLevel.level }</a>
                        <span className="txt">{ currentUserProgressionTreeLevel.currentLevelXP } XP</span>
                      </span>
                      <span className="helf-wp">
                        {
                          _.map(Array.from(Array(widthPercent).keys()), width => { return <span key={width} className="per-b active"></span> })
                        }
                        {
                          _.map(Array.from(Array(10 - widthPercent).keys()), width => { return <span key={width} className="per-b"></span> })
                        }
                        <span className="txt pull-right">{ currentUserProgressionTreeLevel.totalXP } XP</span>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )
        }
      </div>
    )
  }

  skills(skills) {
    return (
      <div className="theme-box-right">
        {
          !skills.isFetchingSkills && this.state.currentSkillId.length > 0 && (
          <div>
            <h3 className="next-previous-icons">
              {
                this.state.previousSkillId.length > 0 &&
                <span className="left-arrow" onClick={ () => this.updatePreviousSkillId() }>&#9664;</span>
              }
              {
                this.state.nextSkillId.length > 0 &&
                <span className="right-arrow" onClick={ () => this.updateNextSkillId() }>&#9654;</span>
              }
            </h3>
            {
              _.map(skills.skills, skill => this.skill(skill))
            }
          </div>
        )}
      </div>
    )
  }

  updatePreviousSkillId() {
    const skills = this.props.skills.skills;
    const currentIndex = _.findIndex(skills, (skill) => { return skill._id == this.state.currentSkillId });
    this.setState({
      previousSkillId: (skills[currentIndex - 2] === undefined ? "" : skills[currentIndex - 2]._id),
      currentSkillId: (skills[currentIndex - 1] === undefined ? "" : skills[currentIndex - 1]._id),
      nextSkillId: (skills[currentIndex] === undefined ? "" : skills[currentIndex]._id)
    });
  }

  updateNextSkillId() {
    const skills = this.props.skills.skills;
    const currentIndex = _.findIndex(skills, (skill) => { return skill._id == this.state.currentSkillId });
    this.setState({
      previousSkillId: (skills[currentIndex] === undefined ? "" : skills[currentIndex]._id),
      currentSkillId: (skills[currentIndex + 1] === undefined ? "" : skills[currentIndex + 1]._id),
      nextSkillId: (skills[currentIndex + 2] === undefined ? "" : skills[currentIndex + 2]._id)
    });
  }

  gamesInNetwork() {
    return (
      <div>
        <div className="col-box-wp">
          <div className="games-network-wp">
            <h3 className="col-heading">Games in Network <a href="#" className="purpal-text-link">View all</a></h3>
            <ul>
              <li>
                <span className="helf-wp">
                  <span className="img-wp-box"><img src="https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/homepage/games-network-1.png" /></span>
                  <span className="head-text">Mayple Story</span>
                </span>
                <span className="helf-wp">
                  <span className="per-b active"></span>
                  <span className="per-b active"></span>
                  <span className="per-b active"></span>
                  <span className="per-b active"></span>
                  <span className="per-b active"></span>
                  <span className="per-b active"></span>
                  <span className="per-b"></span>
                  <span className="per-b"></span>
                  <span className="per-b"></span>
                  <span className="per-b"></span>
                  <span className="rp-txt">60%</span>
                </span>
              </li>
              <li>
                <span className="helf-wp">
                  <span className="img-wp-box"><img src="https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/homepage/games-network-2.png" /></span>
                  <span className="head-text">World & tanks</span>
                </span>
                <span className="helf-wp">
                  <span className="per-b active"></span>
                  <span className="per-b active"></span>
                  <span className="per-b active"></span>
                  <span className="per-b active"></span>
                  <span className="per-b"></span>
                  <span className="per-b"></span>
                  <span className="per-b"></span>
                  <span className="per-b"></span>
                  <span className="per-b"></span>
                  <span className="per-b"></span>
                  <span className="rp-txt">40%</span>
                </span>
              </li>
              <li>
                <span className="helf-wp">
                  <span className="img-wp-box"><img src="https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/homepage/games-network-3.png" /></span>
                  <span className="head-text">Blade & Soul</span>
                </span>
                <span className="helf-wp">
                  <span className="per-b active"></span>
                  <span className="per-b active"></span>
                  <span className="per-b active"></span>
                  <span className="per-b active"></span>
                  <span className="per-b active"></span>
                  <span className="per-b active"></span>
                  <span className="per-b"></span>
                  <span className="per-b"></span>
                  <span className="per-b"></span>
                  <span className="per-b"></span>
                  <span className="rp-txt">60%</span>
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="col-box-wp">
          <div className="Upcoming-Team-Quests-wp">
            <h3 className="col-heading">Upcoming Team Quests</h3>
            <ul>
              <li>
                <p>World of warcraft I Marry Princess 5\12 Slots open I Every Thursday Leader: Donaldduck <a href="#" className="plus-icon">+</a></p>
              </li>
              <li>
                <p>World of warcraft I Marry Princess 5\12 Slots open I Every Thursday Leader: Donaldduck <a href="#" className="plus-icon">+</a></p>
              </li>
              <li>
                <p>World of warcraft I Marry Princess 5\12 Slots open I Every Thursday Leader: Donaldduck <a href="#" className="plus-icon">+</a></p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="col pull-right box-contain-exclam">
         <span className="box-icon-exclam">
            <img src="https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/exclam-icon.svg" />
        </span>
        { this.skills(this.props.skills) }
        {/* { this.gamesInNetwork() } */}
      </div>
    );
  }
}

export default RightSection;
