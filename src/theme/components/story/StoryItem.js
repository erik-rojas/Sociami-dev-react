import React, { Component } from 'react';
import _ from 'lodash';


class StoryItem extends Component {
  constructor (props) {
    super(props);

    this.state = {
      data: this.props.data
    };
  }

  render () {
    return (
      <div className='col-box-wp black-bg'>
        <p>{_.get(this, 'state.data.description')}</p>
        <p className='graylight'>
          Topics: Basic Innovation, Creativity, Government, Why Innovation Now?
        </p>
        <div className='row'>
          <div className='col-sm-8'>
            <h4>Objective: Complete 0/15 Questions</h4>
          </div>
          <div className='col-sm-4 text-right'>
            <a href='#' className='btn-lavel-yellow px-15'>
              Group <i className='fa fa-users' />
            </a>
          </div>
        </div>
        <div className='img-box-wp'>
          <img
            src='https://s3.us-east-2.amazonaws.com/sociamibucket/assets/images/story/stories-box-img1.jpg'
            alt=''
          />
        </div>
        <div className='fot-wp'>
          <p className='text-uppercase'>You will receive</p>
          <div className='row'>
            <div className='col-md-12 col-lg-7'>
              <ul className='bttons-right-box'>
                <li>
                  <a href='#'>500 Exp</a>
                </li>
                <li>
                  <a href='#'>15 soqq</a>
                </li>
                <li>
                  <a href='#'>influence</a>
                </li>
              </ul>
            </div>
            <div className='col-md-12 col-lg-5'>
              <p className='pperpal-txt'>
                <span>Daily: 1/5 completed</span>{' '}
                <a href='#' className='btn-join pull-right'>
                  Sign Up
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default StoryItem;
