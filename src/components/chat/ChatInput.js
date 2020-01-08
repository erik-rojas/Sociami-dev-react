import React from 'react';

class ChatInput extends React.Component {
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
      <form className="write" onSubmit={event => this.submitHandler(event)}>
        <a href="javascript:;" className="write-link attach" />
        <input
          type="text"
          onChange={event => this.textChangeHandler(event)}
          value={this.state.chatInput}
          required
        />
        <a href="javascript:;" className="write-link smiley" />
        <a href="javascript:;" className="write-link send" />
      </form>
    );
  }
}

ChatInput.defaultProps = {};

export default ChatInput;
