import React from 'react';

class EmailBlock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      email: this.props.email,
    };
  }

  editEmailAddress() {
    this.setState({ isEditing: !this.state.isEditing });
  }

  onCancel() {
    this.setState({ isEditing: !this.state.isEditing, email: this.props.email });
  }

  setEmailAddress(e) {
    let emailAddress = e.target.value;
    let newEmailJson = {
      ...this.state.email,
      email: emailAddress,
    };
    this.setState({ email: newEmailJson });
  }

  saveEmailAddress() {
    this.setState({ isEditing: !this.state.isEditing });
    this.props.onSave(this.state.email.email);
  }

  render() {
    const { email, index } = this.props;

    if (this.state.isEditing) {
      return (
        <div className="team-email-item-editing" key={index}>
          <div className="team-email-edit-box">
            <input
              className="team-email-edit-input"
              value={this.state.email.email}
              onChange={e => this.setEmailAddress(e)}
            />
            <div className="team-email-edit-options">
              <a
                className="pull-left team-email-edit-button team-email-cancel-btn"
                onClick={() => this.onCancel()}
              >
                Cancel
              </a>
              <a
                className="pull-right team-email-edit-button  team-email-save-btn"
                onClick={() => this.saveEmailAddress()}
              >
                Save
              </a>
            </div>
          </div>

          <div className="email-edit-lightbox" />
        </div>
      );
    } else {
      if (email.accepted) {
        return (
          <div className="team-email-item-accepted" key={index}>
            <div>
              <div className="team-email-accepted">{this.state.email.email}</div>
              <div className="team-checkmark-div">
                <div className="team-checkmark" />
              </div>
              <a className="fa fa-pencil edit-team-email-checkbox" onClick={() => this.editEmailAddress()} />
            </div>
          </div>
        );
      } else {
        return (
          <div className="team-email-item" key={index}>
            <div className="team-email">{this.state.email.email}</div>
            <a className="fa fa-pencil edit-team-email-checkbox" onClick={() => this.editEmailAddress()} />
          </div>
        );
      }
    }
  }
}

export default EmailBlock;
