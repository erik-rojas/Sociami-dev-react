/*
    author: Alexander Zolotov
*/
import React from 'react';

import StarRatings from 'react-star-ratings';

import ActionLink from '~/src/components/common/ActionLink';

import { Link } from 'react-router-dom';

const ProgressiontreesScanner = props => {
  let foundRoadmaps = [];

  const scannerQuery = props.scannerQuery.toLowerCase();

  if (scannerQuery != '') {
    foundRoadmaps = props.trees.filter(function(roadmap) {
      return roadmap.name && roadmap.name.toLowerCase().startsWith(scannerQuery);
    });
  } else {
    foundRoadmaps = props.trees;
  }

  const openTreeAcceptConfirmationPopup = (treeId, treeName) =>
    props.openTreeAcceptConfirmationPopup(treeId, treeName);
  return (
    <ul className="list-group">
      {foundRoadmaps.map(function(roadmap, i) {
        let boxClass;
        let headingClass;
        if (i % 2 == 0) {
          boxClass = 'progression-list-item-red';
          headingClass = 'progression-list-heading-red';
        } else {
          boxClass = 'progression-list-item-blue';
          headingClass = 'progression-list-heading-blue';
        }
        let ifExpanded;
        if (props.ifProgressionTreesExist) {
          if (props.isExpanded) {
            ifExpanded = true;
          } else {
            ifExpanded = false;
          }
        } else {
          ifExpanded = true;
        }
        return (
          <li key={i} className={boxClass}>
            <Link className={headingClass} to={`/progressionTreeBrowser/?id=${roadmap._id}`}>
              {roadmap.name}
            </Link>

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

            {ifExpanded ? (
              <div className="tree-scanner-tree-name">{roadmap.description}</div>
            ) : (
              <div className="tree-scanner-tree-name">{roadmap.description.slice(0, 100)} ...</div>
            )}

            {ifExpanded && (
              <div className="tree-scanner-tree-footer">
                <div className="tree-scanner-tree-icons pull-left">
                  <span className="tree-scanner-tree-icon glyphicon glyphicon-education" />
                  <span className="tree-scanner-tree-icon glyphicon glyphicon-bitcoin" />
                  <span className="tree-scanner-tree-icon glyphicon glyphicon-dashboard" />
                </div>

                <div className="tree-scanner-tree-network">825 others are learning {roadmap.name}</div>
                {roadmap.isLocked && (
                  <span className="tree-scanner-tree-locked-icon glyphicon glyphicon-lock" />
                )}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default ProgressiontreesScanner;
