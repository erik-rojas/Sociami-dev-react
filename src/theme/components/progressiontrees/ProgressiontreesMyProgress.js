/*
		author: Alexander Zolotov
*/
import React from 'react';
import StarRatings from 'react-star-ratings';
import { Link } from 'react-router-dom';

import ActionLink from '~/src/components/common/ActionLink';
const wastBin =
  'https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/progressionTrees/waste-bin.png';

const ProgressiontreesMyProgress = props => {
  props.trees.map((item, index) => {
    let arrIndex = props.allTrees.findIndex(x => x._id === item._id);
    if (arrIndex >= 0) {
      props.trees[index].description = props.allTrees[arrIndex].description;
      props.trees[index].rating = props.allTrees[arrIndex].rating;
    }
  });
  return (
    <div id="my-progress-list">
      {props.trees.map(function(roadmap, i) {
        return (
          <div key={i} className="trees-wrap">
            <Link className="progression-tree-my-text" to={`/progressionTreeBrowser/?id=${roadmap._id}`}>
              {roadmap.name}
            </Link>
            <span className="progression-tree-star-rating">
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
            <p className="progression-tree-my-descr">{roadmap.description}</p>
            <ActionLink className="tree-bin-wrap" onClick={() => props.stopProgressionTree(roadmap._id)}>
              <img src={wastBin} alt="waste_bin" />
            </ActionLink>
            <hr />
          </div>
        );
      })}
    </div>
  );
};

export default ProgressiontreesMyProgress;
