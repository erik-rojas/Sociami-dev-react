/*
    author: Alexander Zolotov
*/

import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ActionLink from '~/src/components/common/ActionLink';

import '~/src/theme/appearance.css';
import '~/src/theme/layout.css';
import '~/src/theme/css/trendScanner.css';

import { selectResultsCategory } from '~/src/redux/actions/fetchResults';

import { openSearchResultsComplete } from '~/src/redux/actions/fetchResults';

import ResultCategory from '~/src/common/ResultCategoryNames';

import TrendScannerComponent from '~/src/theme/components/trends/TrendScannerComponent';

class TrendScanner extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.openSearchResultsComplete();
  }

  handleSelectCategory(e) {
    this.props.selectResultsCategory(e.currentTarget.id);
  }

  trimmedString(original, limit) {
    let trimmed = original.substr(0, limit);
    trimmed = trimmed.substr(0, Math.min(trimmed.length, trimmed.lastIndexOf(' ')));
    return trimmed;
  }

  render() {
    return (
      <div id="main-content_1">
        <TrendScannerComponent
          onHandleSelectCategory={e => this.handleSelectCategory(e)}
          resultsSelectedCategory={this.props.resultsSelectedCategory}
          isFetchInProgress={this.props.isFetchInProgress}
          searchResults={this.props.searchResults}
        />
      </div>
    );
  }
}

TrendScanner.propTypes = {
  selectResultsCategory: PropTypes.func.isRequired,
  resultsSelectedCategory: PropTypes.string.isRequired,
  searchResults: PropTypes.object.isRequired,
  isFetchInProgress: PropTypes.bool.isRequired,
  openSearchResultsComplete: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  resultsSelectedCategory: state.resultsSelectedCategory,
  searchResults: state.searchResults,
  isFetchInProgress: state.isFetchInProgress,
});

const mapDispatchToProps = dispatch => ({
  selectResultsCategory: bindActionCreators(selectResultsCategory, dispatch),
  openSearchResultsComplete: bindActionCreators(openSearchResultsComplete, dispatch),
});

//withRouter - is a workaround for problem of shouldComponentUpdate when using react-router-v4 with redux
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TrendScanner);
