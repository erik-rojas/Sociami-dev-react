/*
    author: Alexander Zolotov
    This is a container(parent) component for JobItem components
*/

import React, { Component } from 'react';
import EventBriteItem from './EventBriteItem';

class EventBriteItemList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    //Parse this.props, and create table of list of jobs. Use JobItem copmonent for single row of the table
    if (
      typeof this.props !== 'undefined' &&
      typeof this.props.items !== 'undefined' &&
      this.props.items.length > 0
    ) {
      //array of JobItem components
      let eventBriteItems = [];

      //create JobItem for each this.props.items element
      for (let i = 0; i < this.props.items.length; ++i) {
        eventBriteItems.push(
          <EventBriteItem
            key={i}
            item={this.props.items[i]}
            onAddBookmark={e => this.props.onAddBookmark(e)}
          />,
        );
      }

      return (
        <article
          id="featured"
          className="section-wrapper clearfix"
          data-custom-background-img="http://sociamibucket.s3.amazonaws.com/twilli_air/assets/images/other_images/bg3.jpg"
        >
          <div className="mid-vertical-positioning clearfix">
            <div className="">
              <section className="feature-columns row clearfix">{eventBriteItems}</section>
            </div>
          </div>
        </article>
      );
    } else {
      return <p>No Events Found</p>;
    }
  }
}

export default EventBriteItemList;
