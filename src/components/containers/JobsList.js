/*
    author: Alexander Zolotov
    This is a container(parent) component for JobItem components
*/

import React, { Component } from 'react';
import JobItem from './JobItem';

class JobsList extends React.Component {
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
      let jobItems = [];

      //create JobItem for each this.props.items element
      for (let i = 0; i < this.props.items.length; ++i) {
        jobItems.push(
          <JobItem key={i} item={this.props.items[i]} onAddBookmark={e => this.props.onAddBookmark(e)} />,
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
              <section className="feature-columns row clearfix">{jobItems}</section>
            </div>
          </div>
        </article>
      );
    } else {
      return <p>No Jobs Found</p>;
    }
  }
}

export default JobsList;
