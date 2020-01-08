/*
    author: Alexander Zolotov
*/
import React from 'react';
import 'url-search-params-polyfill';

import Axios from 'axios';

import { Icon } from 'react-fa';

import { Link } from 'react-router-dom';

import ConfigMain from '~/configs/main';

import ActionLink from '~/src/components/common/ActionLink';

import StarRatings from 'react-star-ratings';

import SkillBreakdown from '~/src/theme/components/progressiontrees/SkillBreakdown';

import UserInteractions from '~/src/common/UserInteractions';

import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

require('~/src/css/ProgressionTreeBrowser.css');
import Masonry from 'react-masonry-component';

import { userInteractionPush } from '~/src/redux/actions/userInteractions';

import { startProgressionTree } from '~/src/redux/actions/authorization';

import '~/src/theme/css/treebrowser.css';

class ProgressiontreeBrowser extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedSkill: undefined,
      tree: undefined,
      isLoading: true,
    };
  }

  treeFetchSuccess(response) {
    this.setState({ isLoading: false, tree: response.data });
  }

  treeFetchFailed(error) {
    this.setState({ isLoading: false });
  }

  isAddedTree() {
    return this.props.userProfile.progressionTrees.find(tree => {
      return tree._id == this.state.tree._id;
    });
  }

  componentDidMount() {
    const URLParams = new URLSearchParams(this.props.location.search);

    const treeId = URLParams.get('id');

    if (treeId) {
      this.setState({ isLoading: true });
      Axios.get(`${ConfigMain.getBackendURL()}/roadmapGet?id=${treeId}`)
        .then(response => this.treeFetchSuccess(response))
        .catch(error => this.treeFetchFailed(error));
    } else {
      this.setState({ isLoading: false });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.tree && this.state.tree) {
      if (this.props.userProfile && this.props.userProfile._id) {
        this.props.userInteractionPush(
          this.props.userProfile._id,
          UserInteractions.Types.PAGE_OPEN,
          UserInteractions.SubTypes.PROG_TREE_VIEW,
          {
            treeId: this.state.tree._id,
          },
        );
      }
    }
  }

  componentWillUnmount() {
    if (this.state.tree && this.props.userProfile && this.props.userProfile._id) {
      this.props.userInteractionPush(
        this.props.userProfile._id,
        UserInteractions.Types.PAGE_CLOSE,
        UserInteractions.SubTypes.PROG_TREE_VIEW,
        {
          treeId: this.state.tree._id,
        },
      );
    }
  }

  render() {
    return this.renderTree();
  }

  handleCloseSkillBreakdown() {
    this.setState({ selectedSkill: undefined });
    this.props.progressionTreeSS();
  }

  handleOpenSkillBreakdown(skill) {
    this.setState({ selectedSkill: skill });
  }

  handleAddToMyTree() {
    this.props.startProgressionTree(this.props.userProfile._id, {
      _id: this.state.tree._id,
      name: this.state.tree.name,
    });
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
        <div className="masonry-grid-item" key={i}>
          <Link
            className="skill-item"
            key={i}
            to={{
              pathname: `/skillBrowser`,
              state: { tree: that.state.tree },
              search: `?name=${skill}`,
            }}
          >
            {skill}
          </Link>
        </div>
      );
    });
    return listItems;
  }

  renderTree() {
    if (this.state.isLoading || this.props.isProfileLoading) {
      return (
        <div className="container-fluid progress-browser-wrap">
          <div className="row">
            <div className="content-2-columns-left-title">
              Loading...<Icon spin name="spinner" />
            </div>
          </div>
        </div>
      );
    }

    if (!this.state.tree) {
      return (
        <div className="container-fluid progress-browser-wrap">
          <div className="row">
            <div className="content-2-columns-left-title">Tree Not Found</div>
          </div>
        </div>
      );
    }

    let masonryOptions = {
      transitionDuration: 1,
      columnWidth: 2,
      itemSelector: '.masonry-grid-item',
    };

    return (
      <div className="container-fluid progress-browser-wrap">
        {/* <div className="row">
          <div className="content-2-columns-left-title">
            <ActionLink className="skill-breakdown-control pull-right" id="button-arrow-back" onClick={()=> this.props.history.goBack()}>
              <span className="glyphicon glyphicon-arrow-left"/>
            </ActionLink>
          </div>
        </div> */}
        <div className="row">
          <div className="col-lg-12">
            <div className="col-xs-9 no-padding">
              <div className="progress-browser-name">
                <h3>{this.state.tree.name}</h3>
              </div>
            </div>
            <div className="pull-right col-xs-2 no-padding">
              <ActionLink
                className="pull-right"
                id="button-arrow-back"
                style={{ marginTop: '20px' }}
                onClick={() => this.props.history.goBack()}
              >
                <span className="glyphicon glyphicon-arrow-left" />
              </ActionLink>
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
                starRatedColor={'rgb(239, 206, 74)'}
              />
            </span>
            <p>{this.state.tree.description}</p>
          </div>
        </div>

        <div className="row">
          <div className="col-xs-12">
            <div className="tree-skills">
              <ul className="nav nav-tabs">
                <li className="active skill-tab">
                  <a
                    className="skill-tag essential-skill"
                    data-toggle="tab"
                    href="#essential"
                    style={{ backgroundColor: '#DC2F41' }}
                  >
                    Essential Skills
                  </a>
                </li>
                <li className="skill-tab">
                  <a
                    className="skill-tag complimentary-skill"
                    data-toggle="tab"
                    href="#complimentary"
                    style={{ backgroundColor: '#20A5D0' }}
                  >
                    Complimentary Skills
                  </a>
                </li>
                <li className="skill-tab">
                  <a
                    className="skill-tag related-skill"
                    data-toggle="tab"
                    href="#related"
                    style={{ backgroundColor: '#F48543' }}
                  >
                    Related Skills
                  </a>
                </li>
              </ul>

              <div className="tab-content skill-tab-content">
                <div id="essential" className="tab-pane fade in active">
                  <Masonry className="masonry-grid" options={masonryOptions}>
                    {this.renderSkills(this.state.tree.weightage1)}
                  </Masonry>
                </div>
                <div id="complimentary" className="tab-pane fade">
                  <Masonry className="masonry-grid" options={masonryOptions}>
                    {this.renderSkills(this.state.tree.weightage2)}
                  </Masonry>
                </div>
                <div id="related" className="tab-pane fade">
                  <Masonry className="masonry-grid" options={masonryOptions}>
                    {this.renderSkills(this.state.tree.weightage3)}
                  </Masonry>
                </div>
              </div>
            </div>
            {!this.isAddedTree() && (
              <div className="col-sm-12">
                <div
                  className="btn-base-landing btn-red-landing pull-right"
                  onClick={() => this.handleAddToMyTree()}
                >
                  Add to My tree
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

ProgressiontreeBrowser.PropTypes = {
  userInteractionPush: PropTypes.func.isRequired,
  startProgressionTree: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  userProfile: state.userProfile.profile,
  isProfileLoading: state.userProfile.isLoading,
});

const mapDispatchToProps = dispatch => ({
  userInteractionPush: bindActionCreators(userInteractionPush, dispatch),
  startProgressionTree: bindActionCreators(startProgressionTree, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProgressiontreeBrowser);
