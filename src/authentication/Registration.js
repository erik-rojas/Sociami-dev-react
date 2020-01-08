import React, { Component } from 'react';
import Axios from 'axios';
import ConfigMain from '~/configs/main';
import { connect, mapStateToProps } from 'react-redux';
import { signUp, closeSignUpForm } from '../redux/actions/authorization';

/*
  It's just simple mock form to test out local password authorization
  Probably to be replaced.
 */
class Registration extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      email: '',
      password: '',
      message: null,
    };
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();

    Axios.post(`${ConfigMain.getBackendURL()}/auth/sign-in`, {
      email: this.state.email,
      name: this.state.name,
      password: this.state.password,
    })
      .then(response => {
        this.props.closeSignUpForm();
        this.props.signUp(response.data);
      })
      .catch(err => {
        if (err.response.status === 403) {
          this.setState({ message: 'Email address already registred. Password incorrect.' });
        } else {
          this.setState({ message: 'Unknown server error occurs' });
        }
      });
  }

  singIn() {}
  render() {
    return (
      <form
        onChange={event => this.handleChange(event)}
        onSubmit={event => this.handleSubmit(event)}
      >
        <div className="col-xs-12" style={{padding: '10px'}}>
          <div className="signup-details">
          <input type="email" className="mail new-text" 
            placeholder="What is your Email?" 
            name="email" type="email" required 
            value={this.state.email} />
          </div>

          <div className="signup-details">
            <input
              name="password"
              type="password"
              placeholder="What is your Password?"
              required
              value={this.state.password}
            />
          </div>
        </div>
        <div className="col-xs-12" style={{padding: '10px'}}>
          <div className="signup-details">
            <input
              name="name"
              type="text"
              placeholder="What is your Name?"
              required
              value={this.state.name}
            />
            
          </div>
          
          <button type="submit" className="btn signup-btn">Sign in</button>
          {this.state.message && <div>{this.state.message}</div>}
          
        </div>
        {/* <p className="signup-policy-terms">You agree to our Data Privacy and Terms of Use</p> */}
        <p className="signup-policy-terms">&nbsp;</p>
      </form>
    );
  }
}

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  input: {
    margin: '10px 0',
  },
  button: {
    backgroundColor: 'blue',
  },
};

export default connect(
  null,
  { signUp, closeSignUpForm },
)(Registration);
