import React from 'react';

const AnswerTrueFalse = props => {
  return (
    <div className="QuestionAnswersFlow-textarea">
      <div id={`answer_your_${props.question._id}`}>
        <label className="container-rb">
          True
          <input
            type="radio"
            className="validate-field required question-answer-radiobutton"
            name="answer_your"
            onChange={e => props.onHandleAnswerTrueFalse(e)}
            value="true"
            checked={props.answerMy && props.answerMy.isTrue}
          />
          <span className="checkmark-radio" />
        </label>
        <label className="container-rb">
          False
          <input
            type="radio"
            className="validate-field required question-answer-radiobutton"
            name="answer_your"
            onChange={e => props.onHandleAnswerTrueFalse(e)}
            value="false"
            checked={props.answerMy && !props.answerMy.isTrue}
          />
          <span className="checkmark-radio" />
        </label>
      </div>
      {props.partner && (
        <div className="col-lg-6">
          <div id={`answer_partner_${props.question._id}`}>
            <input
              type="radio"
              className="validate-field required question-answer-radiobutton"
              name="answer_partner"
              checked={props.answerPartner && props.answerPartner.isTrue}
              value="true"
            />
            <span>True </span>
            <input
              type="radio"
              className="validate-field required question-answer-radiobutton"
              name="answer_partner"
              checked={props.answerPartner && !props.answerPartner.isTrue}
              value="false"
            />
            <span>False </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnswerTrueFalse;
