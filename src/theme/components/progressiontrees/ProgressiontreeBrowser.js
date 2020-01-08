/*
    author: Alexander Zolotov
*/
import React from 'react';

import ActionLink from '~/src/components/common/ActionLink';

import StarRatings from 'react-star-ratings';

import SkillBreakdown from '~/src/theme/components/progressiontrees/SkillBreakdown';

import UserInteractions from '~/src/common/UserInteractions';

import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { userInteractionPush } from '~/src/redux/actions/userInteractions';

import '~/src/theme/css/treebrowser.css';

class ProgressiontreeBrowser extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedSkill: undefined,
    };
  }

  componentDidMount() {
    if (this.props.userProfile && this.props.userProfile._id) {
      this.props.userInteractionPush(
        this.props.userProfile._id,
        UserInteractions.Types.PAGE_OPEN,
        UserInteractions.SubTypes.PROG_TREE_VIEW,
        {
          treeId: this.props.tree._id,
        },
      );
    }
  }

  componentWillUnmount() {
    if (this.props.userProfile && this.props.userProfile._id) {
      this.props.userInteractionPush(
        this.props.userProfile._id,
        UserInteractions.Types.PAGE_CLOSE,
        UserInteractions.SubTypes.PROG_TREE_VIEW,
        {
          treeId: this.props.tree._id,
        },
      );
    }
  }

  render() {
    if (!this.state.selectedSkill) {
      return this.renderTree();
    } else {
      return (
        <SkillBreakdown
          onCloseSkillBreakdown={() => this.handleCloseSkillBreakdown()}
          skillName={this.state.selectedSkill}
          userProfile={this.props.userProfile}
          tree={this.props.tree}
          saveTask={this.props.saveTask}
        />
      );
    }
  }

  handleCloseSkillBreakdown() {
    this.setState({ selectedSkill: undefined });
    this.props.progressionTreeSS();
  }

  handleOpenSkillBreakdown(skill) {
    this.setState({ selectedSkill: skill });
  }

  renderSkills(skills) {
    const that = this;
    //TODO: Fix incorrect database structure
    let skillParsed = skills.length > 1 ? skills : skills[0].split(',');
    for (let i = 0; i < skillParsed.length; ++i) {
      skillParsed[i] = skillParsed[i].trim();
    }
    return (
      <div className="list-skill-wrap">
        {skillParsed.map(function(skill, i) {
          return (
            <ActionLink
              key={i}
              onClick={() => {
                that.handleOpenSkillBreakdown(skill);
                that.props.progressionTreeFS();
              }}
            >
              {skill}
              <br />
            </ActionLink>
          );
        })}
      </div>
    );
  }

  renderTree() {
    return (
      <div className="container-fluid progress-browser-wrap">
        <div className="row">
          <div className="content-2-columns-left-title">
            <ActionLink
              className="skill-breakdown-control pull-right"
              id="button-arrow-back"
              onClick={() => this.props.onCloseSingleTree()}
            >
              <span className="glyphicon glyphicon-arrow-left" />
            </ActionLink>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="progress-browser-name">
              <h3>{this.props.tree.name}</h3>
            </div>
            <span className="tree-scaner-star-rating">
              <StarRatings
                rating={3.5}
                isSelectable={false}
                isAggregateRating={true}
                numOfStars={5}
                starWidthAndHeight={'20px'}
                starSpacing={'2px'}
                starEmptyColor={'white'}
                starRatedColor={'rgb(180, 177, 3)'}
              />
            </span>
            <p>{this.props.tree.description}</p>
            <div className="row">
              <div id="tree-skills">
                <div className="col-md-3 col-sm-12">
                  <div className="weightage-section">
                    <h4>Essentials skills</h4>
                    {this.renderSkills(this.props.tree.weightage1)}
                  </div>
                </div>
                <div className="col-md-4 col-sm-12">
                  <div className="weightage-section">
                    <h4>Complimentary skils</h4>
                    {this.renderSkills(this.props.tree.weightage2)}
                  </div>
                </div>
                <div className="col-md-3 col-sm-12">
                  <div className="weightage-section">
                    <h4>Related skills</h4>
                    {this.renderSkills(this.props.tree.weightage3)}
                  </div>
                </div>
                <div className="col-md-2 col-sm-12">
                  <div className="add-tom-my-tree">Add to My tree</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ProgressiontreeBrowser.PropTypes = {
  userInteractionPush: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  userProfile: state.userProfile.profile,
});

const mapDispatchToProps = dispatch => ({
  userInteractionPush: bindActionCreators(userInteractionPush, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProgressiontreeBrowser);
