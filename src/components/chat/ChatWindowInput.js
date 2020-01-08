import React from 'react';

class ChatWindowInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { chatInput: '' };
  }

  submitHandler(event) {
    // Stop the form from refreshing the page on submit
    event.preventDefault();

    // Clear the input box
    let copy = Object.assign({}, this.state, { chatInput: '' });
    this.setState(copy);

    // Call the onSend callback with the chatInput message
    this.props.onSend(this.state.chatInput);
  }

  textChangeHandler(event) {
    let copy = Object.assign({}, this.state, { chatInput: event.target.value });
    this.setState(copy);
  }

  render() {
    return (
      <form className="chat-window-input" onSubmit={event => this.submitHandler(event)}>
        <a href="javascript:;" className="chat-attach glyphicon glyphicon-paperclip pull-left" />
        <div className="chat-input-span">
          <input
            type="text"
            onChange={event => this.textChangeHandler(event)}
            value={this.state.chatInput}
            className="chat-input"
            required
          />
        </div>
        <div className="chat-icon-btn">
          <button className="btn chat-send pull-right">
            <i className="glyphicon glyphicon-send chat-icon" />
          </button>
        </div>
      </form>
    );
  }
}

ChatWindowInput.defaultProps = {};

export default ChatWindowInput;
