import React, { Component } from 'react';

import ActionLink from '~/src/components/common/ActionLink';

class EventBriteItem extends React.Component {
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
      itemObject._type = 'eventbrite_event';

      let title = this.trimmedString(this.props.item.name, 24);
      let description = this.trimmedString(this.props.item.description, 60);

      return (
        <article className="feature-col col-md-4">
          <ActionLink
            href={this.props.item.url}
            className="thumbnail linked"
            onClick={() => this.props.onAddBookmark(this.props.item)}
          >
            <div className="image-container">
              <img src={this.props.item.logoUrl} className="item-thumbnail" alt={title} />
            </div>
            <div className="caption">
              <h5>{title}</h5>
              <p>{description}</p>
              <p>{this.props.item.start}</p>
            </div>
          </ActionLink>
        </article>
      );
    }

    return null;
  }
}

export default EventBriteItem;
