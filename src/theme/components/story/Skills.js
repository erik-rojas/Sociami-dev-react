import React, { Component } from 'react';
import _ from 'lodash';

class StoryItem extends Component {
  constructor (props) {
    super(props);

    this.state = {
      data: this.props.data
    };
  }

  /**
   * render get shadow randomly
   * the default is violet
   */
  getShadow () {
    const SHADOW_COUNT = 2; //set
    const rnd = Math.floor(Math.random() * SHADOW_COUNT);
    console.log(rnd);
    const YELLOW = 1;
    switch (rnd) {
      case YELLOW:
        return 'yellow-shadow';
      default:
        return '';
    }
  }

  getRewardDisplay () {
    let rewardDisplay = '';
    const type = _.get(this, 'state.data.reward.type');

    if (type === 'Token' || type === 'Fiat') {
      rewardDisplay = `${_.get(this, 'state.data.reward.value')} ${type}`;
    } else if (type === 'Achievement') {
      rewardDisplay = _.get(this, 'state.data.reward._achievement.name', '');
    }
    return rewardDisplay;
  }

  render () {
    return (
      <div className={'col-box-wp black-bg ' + this.getShadow()}>
        <p>{_.get(this, 'state.data.description')}</p>
        <p className='graylight'>{_.get(this, 'state.data.skill')}</p>
        <div className='row'>
          <div className='col-sm-8'>
            <h4>
              {`Objective: Complete 0/${_.get(this, 'state.data.objectiveValue', 0)} 
                ${_.get(this, 'state.data._objective.name', '')}`}
            </h4>
          </div>
          <div className='col-sm-4 text-right'>
            {_.get(this, 'state.data._objective.group', 0) > 1 && (
              <a href='#' className='btn-lavel-yellow px-15'>
                Group <i className='fa fa-users' />
              </a>
            )}
          </div>
        </div>
        <div className='img-box-wp'>
          <img
            src={
              'https://s3.us-east-2.amazonaws.com/admin.soqqle.com/skillImages/' +
              _.get(this, 'state.data._id')
            }
            alt=''
          />
        </div>
        <div className='fot-wp'>
          <p className='text-uppercase'>You will receive</p>
          <div className='row'>
            <div className='col-md-12 col-lg-7'>
              <ul className='bttons-right-box'>
                <li>
                  <a href='#'>{this.getRewardDisplay()}</a>
                </li>
              </ul>
            </div>
            <div className='col-md-12 col-lg-5'>
              <p className='pperpal-txt'>
                <span>
                  {`${_.get(this, 'state.data.refresh', '')}: 0/
                    ${_.get(this, 'state.data.quota', '0')} completed`}
                </span>
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
