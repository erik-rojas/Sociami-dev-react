/*
    author: Alexander Zolotov
*/
import React from 'react';

import TrendScannerNavigation from '~/src/theme/components/trends/TrendScannerNavigation';
import TrendScannerResults from '~/src/theme/components/trends/TrendScannerResults';

const TrendScannerComponent = props => {
  return (
    <div id="trend-scanner">
      <TrendScannerNavigation
        onHandleSelectCategory={e => props.onHandleSelectCategory(e)}
        resultsSelectedCategory={props.resultsSelectedCategory}
      />
      <div id="trend-scanner-results">
        <TrendScannerResults
          searchResults={props.searchResults}
          isFetchInProgress={props.isFetchInProgress}
          resultsSelectedCategory={props.resultsSelectedCategory}
        />
      </div>
    </div>
  );
};

export default TrendScannerComponent;
