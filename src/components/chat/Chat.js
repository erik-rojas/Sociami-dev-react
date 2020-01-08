import React from 'react';

class Chat extends React.Component {
  render() {
    const messi =
      'https://media.gettyimages.com/photos/lionel-messi-of-barcelona-celebrates-scoring-his-sides-first-goal-picture-id846141966?s=612x612';
    return (
      <div className="box-comment">
        <img className="img-circle img-sm" src={messi} alt="User Image" />

        <div className="comment-text">
          <span className="username">
            Daniel Shen
            <span className="text-muted pull-right">
              <i className="fa fa-clock-o" /> 14:15
            </span>
          </span>
          <p className="chat-text">Neque porro quisquam est qui dolorem ipsum ...</p>
        </div>
      </div>
    );
  }
}

export default Chat;
