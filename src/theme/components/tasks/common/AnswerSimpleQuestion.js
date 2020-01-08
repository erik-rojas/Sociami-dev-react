import React from 'react';

const AnswerSimpleQuestion = props => {
  return (
    <div className="QuestionAnswersFlow-textarea">
      <textarea
        id={`answer_your_${props.question._id}`}
        className="validate-field required question-text-area"
        name="answer_your"
        onChange={e => props.onHandleAnswerInput(e)}
        value={props.answerMy.text}
        style={{ backgroundColor: '#000', color: 'white' }}
      />
      {/* {props.partner &&
            <div className="col-lg-6">
                <div className="form-group">
                    <textarea readOnly={true} tabIndex="-1" id={`answer_partner_${props.question._id}`}
                        className="validate-field required question-text-area" placeholder={props.partner.user.firstName}
                        name="answer_partner" onChange={(e) => props.onHandleAnswerInput(e)} value={props.answerPartner} />
                </div>
            </div>
        } */}
    </div>
  );
};

export default AnswerSimpleQuestion;
