/**
 * created by Mariana
 * date: 2018-08-22
 * description: this is rightanwersection component in answerquestion window. not completed
 */
import React, { Component } from 'react';

const url = 'https://books.google.com/talktobooks/query?q=what%20is%20blockchain';

class RightAnswerSection extends React.Component {
  constructor(props) {
    super(props);
  }

  // before component is started, call function getLoadURL from parent component(Tasks.js)
  componentDidMount() {
    this.props.getLoadURL(url);
  }

  render() {
    return (
      <div className="col pull-right" style={{ maxWidth: '333px' }}>
        <div className="theme-box-right">
          <div className="row">
            <div className="col-sm-12">
              <div id="test1" />
              <iframe
                id="embed-frame"
                className="answer-right-iframe"
                src="https://books.google.com/talktobooks/query?q=what%20is%20blockchain"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default RightAnswerSection;
