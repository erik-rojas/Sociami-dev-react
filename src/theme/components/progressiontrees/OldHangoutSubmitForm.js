/*
    author: Alexander Zolotov
*/
import React from 'react';

import ActionLink from '~/src/components/common/ActionLink';

class HangoutSubmitForm extends React.Component {
  constructor(props) {
    super(props);

    const timeNow = Date.now();
    const dateNow = new Date(timeNow);

    this.state = {
      dayPeriod: 'today',
      date: dateNow,

      dateInputValue: timeNow,
      timeInputValue: '00:00',
    };
  }

  handleDateInputChange(e) {
    e.preventDefault();

    this.setState({ dateInputValue: e.target.valueAsNumber });
  }

  handleTimeInputChange(e) {
    e.preventDefault();

    this.setState({ timeInputValue: e.target.value });
  }

  handleOptionChange(e) {
    this.setState({ dayPeriod: e.target.value });
  }

  handleStartHangout(e) {
    e.preventDefault();

    let dateTime = Date.now();

    const day = 60 * 60 * 24 * 1000;

    switch (this.state.dayPeriod) {
      case 'tomorrow': {
        dateTime += day;
        break;
      }
      case 'day_after': {
        dateTime += day * 2;
        break;
      }
      case 'other': {
        dateTime = this.state.dateInputValue;
        break;
      }
      default:
        break;
    }

    let date = new Date(dateTime);

    const TimeInputSplitted = this.state.timeInputValue.split(':');

    date.setHours(TimeInputSplitted[0]);
    date.setMinutes(TimeInputSplitted[1]);

    this.props.onHandleStartHangout(date);
  }

  renderForm() {
    return (
      <form action="#" onSubmit={e => this.handleStartHangout(e)}>
        <label className="radio-inline">Day</label>
        <label className="radio-inline">
          <input
            type="radio"
            name="optradio"
            value="today"
            checked={this.state.dayPeriod == 'today'}
            onChange={e => this.handleOptionChange(e)}
          />Today
        </label>
        <label className="radio-inline">
          <input
            type="radio"
            name="optradio"
            value="tomorrow"
            checked={this.state.dayPeriod == 'tomorrow'}
            onChange={e => this.handleOptionChange(e)}
          />Tomorrow
        </label>
        <label className="radio-inline">
          <input
            type="radio"
            name="optradio"
            value="day_after"
            checked={this.state.dayPeriod == 'day_after'}
            onChange={e => this.handleOptionChange(e)}
          />Day After
        </label>
        <label className="radio-inline">
          <input
            type="radio"
            name="optradio"
            value="other"
            checked={this.state.dayPeriod == 'other'}
            onChange={e => this.handleOptionChange(e)}
          />Other
        </label>
        {this.state.dayPeriod == 'other' && (
          <input
            type="date"
            className="validate-field required"
            data-validation-type="string"
            id="date"
            name="date"
            autoComplete="off"
            placeholder="Date"
            defaultValue="2020-01-01"
            onChange={e => this.handleDateInputChange(e)}
          />
        )}
        <div>
          <label className="radio-inline">Time</label>
          <input
            type="time"
            className="validate-field required input-time"
            data-validation-type="string"
            id="time"
            name="date"
            autoComplete="off"
            placeholder="00-00"
            defaultValue={this.state.timeInputValue}
            onChange={e => this.handleTimeInputChange(e)}
          />
        </div>
        <button type="submit" className="btn btn-md btn-outline-inverse pull-right">
          Submit
        </button>
      </form>
    );
  }

  render() {
    return (
      <div id="hangout-submit-form">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <h4>Greate! You want to Hangout!</h4>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <p>
                People work better in a teams and can achieve whay more than when going into it yourself. You
                will get matched to someone with the same interest to solve some questions at the time you
                select below.
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">{this.renderForm()}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default HangoutSubmitForm;
