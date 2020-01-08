/*
    author: Alexander Zolotov
*/

import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import '~/src/theme/css/common.css';
import '~/src/theme/css/progressionTrees.css';

import PopupAcceptProgressionTree from '~/src/theme/components/PopupAcceptProgressionTree';

import ProgressiontreesScanner from '~/src/theme/components/progressiontrees/ProgressiontreesScanner';
import ProgressiontreesMyProgress from '~/src/theme/components/progressiontrees/ProgressiontreesMyProgress';

import ActionLink from '~/src/components/common/ActionLink';

import { fetchRoadmaps, fetchRoadmapsFromAdmin } from '~/src/redux/actions/roadmaps';

import Axios from 'axios';

import ConfigMain from '~/configs/main';

class ProgressionTrees extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      scannerQuery: '',
      isAcceptProgressionTreePopupOpen: false,
      scannerSelectedTreeId: undefined,
      scannerSelectedTreeName: '',
    };
  }

  handleChange(e) {
    e.preventDefault();
    this.setState({ scannerQuery: e.target.value });
  }

  componentWillMount() {
    this.props.fetchRoadmaps();

    this.props.fetchRoadmapsFromAdmin();
  }

  renderUserProgressionTrees() {
    return (
      <div id="progression-trees-trees">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="content-2-columns-left-title">My Progress</div>
            </div>
          </div>
          <ProgressiontreesMyProgress
            roadmapsAdmin={this.props.roadmapsAdmin}
            isAuthorized={this.props.isAuthorized}
          />
        </div>
      </div>
    );
  }

  openTreeAcceptConfirmationPopup(treeId, treeName) {
    if (this.props.isAuthorized) {
      if (
        this.props.userProfile.progressionTrees.findIndex(function(tree) {
          return tree._id == treeId;
        }) == -1
      ) {
        this.setState({
          scannerSelectedTreeId: treeId,
          scannerSelectedTreeName: treeName,
          isAcceptProgressionTreePopupOpen: true,
        });
      }
    }
  }

  onTreeAcceptConfirmationPopupClose(option, treeId) {
    this.setState({
      scannerSelectedTreeId: undefined,
      scannerSelectedTreeName: '',
      isAcceptProgressionTreePopupOpen: false,
    });

    if (option === true && treeId) {
      const url = `${ConfigMain.getBackendURL()}/userProgressionTreeStart`;

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
        const data = {
          userId: this.props.userProfile._id,
          progTree: { _id: foundRoadmap._id, name: foundRoadmap.name },
        };

        Axios.post(url, data)
          .then(response => this.progressionTreeStartSuccess(response))
          .catch(error => this.progressionTreeStartFailed(error));
      }
    }
  }

  progressionTreeStartSuccess(response) {}

  progressionTreeStartFailed(error) {}

  render() {
    return (
      <div className="content-2-columns-wrapper" id="progression-trees">
        {this.state.isAcceptProgressionTreePopupOpen && (
          <PopupAcceptProgressionTree
            treeId={this.state.scannerSelectedTreeId}
            treeName={this.state.scannerSelectedTreeName}
            modalIsOpen={this.state.isAcceptProgressionTreePopupOpen}
            onConfirmationPopupClose={(option, treeId) =>
              this.onTreeAcceptConfirmationPopupClose(option, treeId)
            }
          />
        )}
        <div className="container-fluid">
          <div className="row">
            {/*<div className="col-lg-9">
              <div className="content-2-columns-left">
                {this.renderUserProgressionTrees()}
              </div>
              </div>*/}
            <div className="col-lg-12">
              <div className="content-2-columns-left" id="progression-trees-scanner">
                <div id="progression-trees-scanner-container">
                  <div className="container-fluid">
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="content-2-columns-right-title content-2-columns-right-title-landing">
                          Tree scanner
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-12">
                        <div id="scanner-input-container-landing">
                          <input
                            type="text"
                            autoComplete="off"
                            id="scanner_trees_landing"
                            placeholder="Technology"
                            onChange={e => this.handleChange(e)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-12">
                        <div id="trees-scanner-container">
                          <ProgressiontreesScanner
                            scannerQuery={this.state.scannerQuery}
                            trees={this.props.roadmapsAdmin.data}
                            openTreeAcceptConfirmationPopup={(treeId, treeName) =>
                              this.openTreeAcceptConfirmationPopup(treeId, treeName)
                            }
                          />
                        </div>
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

ProgressionTrees.propTypes = {
  fetchRoadmaps: PropTypes.func.isRequired,
  fetchRoadmapsFromAdmin: PropTypes.func.isRequired,
  roadmaps: PropTypes.object.isRequired,
  roadmapsAdmin: PropTypes.object.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
  userProfile: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  roadmaps: state.roadmaps,
  roadmapsAdmin: state.roadmapsAdmin,
  isAuthorized: state.userProfile.isAuthorized,
  userProfile: state.userProfile.profile,
});

const mapDispatchToProps = dispatch => ({
  fetchRoadmaps: bindActionCreators(fetchRoadmaps, dispatch),
  fetchRoadmapsFromAdmin: bindActionCreators(fetchRoadmapsFromAdmin, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProgressionTrees);
