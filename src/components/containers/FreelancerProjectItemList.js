/*
    author: Alexander Zolotov
    This is a container(parent) component for FreelancerProjectItem components
*/

import React, { Component } from 'react';
import FreelancerProjectItem from './FreelancerProjectItem';

class FreelancerProjectItemList extends React.Component {
  constructor(props) {
    super(props);
  }

  _getTableHeader() {
    /*<th>Description</th>*/
    return (
      <thead>
        <tr>
          <th>Title</th>
          <th>Description</th>
          <th>Link</th>
          <th>Posted</th>
          <th />
        </tr>
      </thead>
    );
  }

  render() {
    let listContent = <p>No Courses Found</p>;

    if (
      typeof this.props !== 'undefined' &&
      typeof this.props.items !== 'undefined' &&
      this.props.items.length > 0
    ) {
      let freelanceProjectItems = [];

      for (let i = 0; i < this.props.items.length; ++i) {
        freelanceProjectItems.push(
          <FreelancerProjectItem
            key={i}
            item={this.props.items[i]}
            onAddBookmark={e => this.props.onAddBookmark(e)}
          />,
        );
      }

      listContent = (
        <Table responsive bordered condensed>
          {this._getTableHeader()}
          <tbody>{freelanceProjectItems}</tbody>
        </Table>
      );
    }

    return <div>{listContent}</div>;
  }
}

export default FreelancerProjectItemList;
