/*
  author: Alexander Zolotov
  Replaced by: src/theme/components/story/Story.js
*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import '~/src/theme/css/common.css';
import '~/src/theme/css/progressionTrees.css';
import '~/src/theme/css/ProgressionTreesNew.css';

import PopupAcceptProgressionTree from '~/src/theme/components/PopupAcceptProgressionTree';

import ProgressiontreesScanner from '~/src/theme/components/progressiontrees/ProgressiontreesScanner';
import ProgressiontreesMyProgress from '~/src/theme/components/progressiontrees/ProgressiontreesMyProgress';
import ProgressiontreeBrowser from '~/src/theme/components/progressiontrees/ProgressiontreeBrowserNew';
import SkillCard from '~/src/theme/components/progressiontrees/SkillCard';

import { Icon } from 'react-fa';
import ActionLink from '~/src/components/common/ActionLink';

import { fetchRoadmaps, fetchRoadmapsFromAdmin } from '~/src/redux/actions/roadmaps';
import { startProgressionTree, stopProgressionTree } from '~/src/redux/actions/authorization';
import { saveTask } from '~/src/redux/actions/tasks';

class ProgressionTrees extends Component {
  constructor(props) {
    super(props);

    this.state = {
      scannerQuery: '',
      isAcceptProgressionTreePopupOpen: false,
      scannerSelectedTreeId: undefined,
      selectedTree: undefined,
      scannerSelectedTreeName: '',

      selectedTreeFromMyProgressIndex: -1,

      isScannerExpanded: !this.props.isAuthorized || this.props.userProfile.progressionTrees.length == 0,
      isTreeExpanded: false,
      isSidebarExpanded: false,
    };

    this.handleStopProgressionTree = this.handleStopProgressionTree.bind(this);
  }

  handleChange(e) {
    e.preventDefault();
    this.setState({ scannerQuery: e.target.value });
  }

  handleOpenSingleTree(id) {
    const foundTreeIndex = this.props.roadmapsAdmin.data.findIndex(function(tree) {
      return tree._id == id;
    });

    if (foundTreeIndex != -1) {
      this.setState({ selectedTreeFromMyProgressIndex: foundTreeIndex });
    }
  }

  handleStopProgressionTree(id) {
    this.props.stopProgressionTree(this.props.userProfile._id, { _id: id });
  }

  handleCloseSingleTree(id) {
    this.setState({ selectedTreeFromMyProgressIndex: -1 });
  }

  componentWillMount() {
    this.props.fetchRoadmaps();
    this.props.fetchRoadmapsFromAdmin(this.props.isAuthorized ? this.props.userProfile._id : undefined);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.isAuthorized != this.props.isAuthorized) {
      if (this.props.isAuthorized) {
        this.props.fetchRoadmapsFromAdmin(this.props.userProfile._id);
      }
    }

    if (
      prevProps.isAuthorized != this.props.isAuthorized ||
      prevProps.userProfile.progressionTrees.length != this.props.userProfile.progressionTrees.length
    ) {
      this.setState({
        isScannerExpanded: !this.props.isAuthorized || this.props.userProfile.progressionTrees.length == 0,
      });
    }
  }

  setTreeScannerExpanded(expanded) {
    if (this.props.isAuthorized && this.props.userProfile.progressionTrees.length > 0) {
      this.setState({ isScannerExpanded: expanded });
    }
  }

  progressionTreeFS() {
    this.setState({ isTreeExpanded: true });
  }

  progressionTreeSS() {
    this.setState({ isTreeExpanded: false });
  }

  renderArrow() {
    if (this.state.isScannerExpanded) {
      if (this.props.isAuthorized && this.props.userProfile.progressionTrees.length > 0) {
        return (
          <div id="progression-trees-trees">
            <ActionLink
              id="user-prog-tree-collapse"
              href="#"
              onClick={() => this.setTreeScannerExpanded(false)}
            >
              <span className="glyphicon glyphicon-menu-right" />
            </ActionLink>
          </div>
        );
      } else {
        return <div id="progression-trees-trees" />;
      }
    }
  }

  handleExpandSidebar(expand) {
    this.setState({ isSidebarExpanded: expand });
  }

  renderUserProgressionTrees() {
    return (
      <div id="progression-trees-trees">
        {this.state.selectedTreeFromMyProgressIndex != -1 ? (
          <ProgressiontreeBrowser
            tree={this.props.roadmapsAdmin.data[this.state.selectedTreeFromMyProgressIndex]}
            onCloseSingleTree={() => this.handleCloseSingleTree()}
            userProfile={this.props.userProfile}
            saveTask={this.props.saveTask}
            progressionTreeFS={() => this.progressionTreeFS()}
            progressionTreeSS={() => this.progressionTreeSS()}
          />
        ) : (
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12">
                <h3 className="my-progress-heading">My Progress</h3>
                <hr id="progress-underline" style={{ width: '130px' }} />
              </div>
            </div>

            {this.props.userProfile.progressionTrees.length != 0 && (
              <div>
                <ProgressiontreesMyProgress
                  trees={this.props.userProfile.progressionTrees}
                  allTrees={this.props.roadmapsAdmin.data}
                  isAuthorized={this.props.isAuthorized}
                  openSingleTree={id => this.handleOpenSingleTree(id)}
                  stopProgressionTree={id => this.handleStopProgressionTree(id)}
                />
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  treeFetchSuccess(response) {
    let cardClass = {
      ...this.state.tree,
      [skillId]: !this.state.flipCardClass[skillId],
    };
    this.setState({ flipCardClass: cardClass });
    this.setState({ isLoading: false, tree: response.data });
  }

  treeFetchFailed(error) {
    this.setState({ isLoading: false });
  }

  renderUserProgressionTreesNew() {
    return (
      <div id="progression-trees-trees">
        {this.state.selectedTreeFromMyProgressIndex != -1 ? (
          <ProgressiontreeBrowser
            tree={this.props.roadmapsAdmin.data[this.state.selectedTreeFromMyProgressIndex]}
            onCloseSingleTree={() => this.handleCloseSingleTree()}
            userProfile={this.props.userProfile}
            saveTask={this.props.saveTask}
            progressionTreeFS={() => this.progressionTreeFS()}
            progressionTreeSS={() => this.progressionTreeSS()}
          />
        ) : (
          <div className="container-fluid">
            <div className="row" style={{ paddingBottom: '20px' }}>
              <div className="col-lg-12 skills-inprogress">
                <h3 className="timer-heading">TIMERS</h3>
                <p className="skill-in-progress">The Real Digital Nomad- Illuminate (00:25:59:34)</p>
                <p className="skill-in-progress">Innovation - Illuminate (00:25:59:34)</p>
                <a className="show-more">Show more</a>
              </div>
            </div>
            <div className="ptree-roadmap-list">
              {this.props.roadmapsAdmin.data.length != 0 &&
                this.props.roadmapsAdmin.data.map((item, index) => {
                  let customStyle;
                  if (index % 2 == 0) {
                    customStyle = {
                      color: '#07AF3E',
                      background: '#A4E6AD',
                    };
                  } else {
                    customStyle = {
                      color: '#F85655',
                      background: '#F3A597',
                    };
                  }

                  return <SkillCard skillItem={item} customStyle={customStyle} />;
                })
              // <div>
              //   <ProgressiontreesMyProgress trees={this.props.userProfile.progressionTrees} allTrees={this.props.roadmapsAdmin.data}
              //     isAuthorized={this.props.isAuthorized} openSingleTree={(id)=>this.handleOpenSingleTree(id)}
              //     stopProgressionTree={(id)=>this.handleStopProgressionTree(id)}/>
              // </div>
              }
            </div>
          </div>
        )}
      </div>
    );
  }

  openTreeAcceptConfirmationPopup(treeId, treeName) {
    if (this.props.isAuthorized) {
      const findById = currentRoadmap => {
        return currentRoadmap._id == treeId;
      };

      let foundRoadmaps = [];

      const scannerQuery = this.state.scannerQuery.toLowerCase();

      if (scannerQuery != '') {
        foundRoadmaps = this.props.roadmapsAdmin.data.filter(function(roadmap) {
          return roadmap.name && roadmap.name.toLowerCase().startsWith(scannerQuery);
        });
      } else {
        foundRoadmaps = this.props.roadmapsAdmin.data;
      }

      const foundTree = foundRoadmaps.find(findById);

      this.setState({
        selectedTree: foundTree,
        scannerSelectedTreeId: treeId,
        scannerSelectedTreeName: treeName,
        isAcceptProgressionTreePopupOpen: true,
      });
    }
  }

  onTreeAcceptConfirmationPopupClose(option, treeId) {
    this.setState({
      selectedTree: undefined,
      scannerSelectedTreeId: undefined,
      scannerSelectedTreeName: '',
      isAcceptProgressionTreePopupOpen: false,
    });

    if (option === true && treeId) {
      let foundRoadmaps = [];

      const scannerQuery = this.state.scannerQuery.toLowerCase();

      if (scannerQuery != '') {
        foundRoadmaps = this.props.roadmapsAdmin.data.filter(function(roadmap) {
          return roadmap.name && roadmap.name.toLowerCase().startsWith(scannerQuery);
        });
      } else {
        foundRoadmaps = this.props.roadmapsAdmin.data;
      }

      const findById = currentRoadmap => {
        return currentRoadmap._id == treeId;
      };

      const foundRoadmap = foundRoadmaps.find(findById);

      if (foundRoadmap) {
        this.props.startProgressionTree(this.props.userProfile._id, {
          _id: foundRoadmap._id,
          name: foundRoadmap.name,
        });
      }
    }
  }

  render() {
    const that = this;
    const treesScanner = this.props.roadmapsAdmin.data.filter(function(roadmap) {
      return (
        that.props.userProfile.progressionTrees.findIndex(function(tree) {
          return tree._id == roadmap._id;
        }) == -1
      );
    });

    let rightSideClassName = 'col-lg-3';

    if (this.state.isScannerExpanded) {
      rightSideClassName = this.props.userProfile.progressionTrees.length == 0 ? 'col-lg-12' : 'col-lg-12';
    }
    var leftSideClassName = !this.state.isScannerExpanded ? 'col-lg-9' : 'col-lg-1 hide';

    if (this.state.isTreeExpanded) {
      rightSideClassName =
        this.props.userProfile.progressionTrees.length == 0 ? 'col-lg-12' : 'col-lg-1 hide';
      leftSideClassName = 'col-lg-12';
    }

    let LeftColClass;
    let RightColClass;
    let ifProgressionTreesExist;
    if (this.props.userProfile.progressionTrees.length != 0) {
      LeftColClass = this.state.isSidebarExpanded ? 'col-md-4 expand-deep' : 'col-md-8 expand-deep';
      RightColClass = this.state.isSidebarExpanded
        ? 'col-md-8 expand-tokens open-tokens-mobile'
        : 'col-md-4 expand-tokens close-tokens-mobile';
      ifProgressionTreesExist = true;
    } else {
      LeftColClass = '';
      RightColClass = 'col-md-12';
      ifProgressionTreesExist = false;
    }

    return (
      // <div className="row content-wrap">
      //   {this.props.userProfile.progressionTrees.length != 0 &&
      //       <div className="list-progression-trees">
      //           {this.renderUserProgressionTreesNew()}
      //       </div>
      //   }
      // </div>
      <div className="row content-wrap">
        {this.state.isAcceptProgressionTreePopupOpen && (
          <PopupAcceptProgressionTree
            treeId={this.state.scannerSelectedTreeId}
            tree={this.state.selectedTree}
            treeName={this.state.scannerSelectedTreeName}
            modalIsOpen={this.state.isAcceptProgressionTreePopupOpen}
            onConfirmationPopupClose={(option, treeId) =>
              this.onTreeAcceptConfirmationPopupClose(option, treeId)
            }
          />
        )}
        {this.props.userProfile.progressionTrees.length != 0 && (
          <div className={LeftColClass}>
            <div className="content-2-columns-left">
              {this.renderUserProgressionTrees()}
              {/* {this.renderUserProgressionTreesNew()} */}
            </div>
          </div>
        )}

        <div className={RightColClass}>
          <div className="progression-tree-sidebar">
            {this.props.userProfile.progressionTrees.length != 0 && (
              <div className="expander">
                {!this.state.isSidebarExpanded ? (
                  <ActionLink
                    href="#"
                    className="open-expanding"
                    onClick={() => this.handleExpandSidebar(true)}
                  >
                    <Icon className="none-padding-left" name="chevron-left" aria-hidden="true" />
                  </ActionLink>
                ) : (
                  <ActionLink
                    href="#"
                    className="close-expanding"
                    onClick={() => this.handleExpandSidebar(false)}
                  >
                    <Icon className="none-padding-left" name="chevron-right" aria-hidden="true" />
                  </ActionLink>
                )}
              </div>
            )}

            {this.props.userProfile.progressionTrees.length != 0 && (
              <div className="expanding expanding-mobile">
                {!this.state.isSidebarExpanded ? (
                  <ActionLink
                    href="#"
                    className="open-expanding"
                    onClick={() => this.handleExpandSidebar(true)}
                  >
                    <Icon className="none-padding-left" name="chevron-left" aria-hidden="true" />
                  </ActionLink>
                ) : (
                  <ActionLink
                    href="#"
                    className="close-expanding"
                    onClick={() => this.handleExpandSidebar(false)}
                  >
                    <Icon className="none-padding-left" name="chevron-right" aria-hidden="true" />
                  </ActionLink>
                )}
              </div>
            )}

            <div className="progressiontree-header">Technology</div>
            <div className="progressiontree-container">
              <ProgressiontreesScanner
                scannerQuery={this.state.scannerQuery}
                trees={treesScanner}
                openTreeAcceptConfirmationPopup={(treeId, treeName) =>
                  this.openTreeAcceptConfirmationPopup(treeId, treeName)
                }
                ifProgressionTreesExist={ifProgressionTreesExist}
                isExpanded={this.state.isSidebarExpanded}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ProgressionTrees.propTypes = {
  fetchRoadmaps: PropTypes.func.isRequired,
  saveTask: PropTypes.func.isRequired,
  fetchRoadmapsFromAdmin: PropTypes.func.isRequired,
  startProgressionTree: PropTypes.func.isRequired,
  roadmapsAdmin: PropTypes.object.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
  userProfile: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  roadmapsAdmin: state.roadmapsAdmin,
  isAuthorized: state.userProfile.isAuthorized,
  userProfile: state.userProfile.profile,
});

const mapDispatchToProps = dispatch => ({
  fetchRoadmaps: bindActionCreators(fetchRoadmaps, dispatch),
  saveTask: bindActionCreators(saveTask, dispatch),
  startProgressionTree: bindActionCreators(startProgressionTree, dispatch),
  stopProgressionTree: bindActionCreators(stopProgressionTree, dispatch),
  fetchRoadmapsFromAdmin: bindActionCreators(fetchRoadmapsFromAdmin, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProgressionTrees);
