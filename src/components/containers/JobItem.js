/*
    author: Alexander Zolotov
    This is a component for rendering single job item in form of table row containing table data
*/
import React, { Component } from 'react';

import ActionLink from '~/src/components/common/ActionLink';

class JobItem extends React.Component {
  constructor(props) {
    super(props);
  }

  trimmedString(original, limit) {
    let trimmed = original.substr(0, limit);
    trimmed = trimmed.substr(0, Math.min(trimmed.length, trimmed.lastIndexOf(' ')));
    return trimmed;
  }

  render() {
    //output table row and table data, where table data is taken from props passed inside from parent component
    if (typeof this.props !== 'undefined') {
      let itemObject = this.props.item;
      itemObject._type = 'indeed_job';

      let title = this.props.item.jobtitle;
      let company = this.props.item.company ? this.props.item.company : 'N/A';

      return (
        <article className="jobTile feature-col col-md-4">
          <ActionLink
            href={this.props.item.url}
            className="thumbnail linked"
            onClick={() => this.props.onAddBookmark(this.props.item)}
          >
            <div className="caption">
              <h5>{title}</h5>
              <p>{company}</p>
              <p>{this.props.item.formattedLocation}</p>
              <p>{this.props.item.date}</p>
              <p>{this.props.item.formattedRelativeTime}</p>
            </div>
          </ActionLink>
        </article>
      );
    }

    return null;
  }
}

export default JobItem;
