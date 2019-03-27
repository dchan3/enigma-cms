import React, { Component } from 'react';
import GeneratedForm from '../reusables/GeneratedForm';
import { StyledDiv } from '../reusables/styled';
import { default as urlUtils } from '../utils';

class SignupPage extends Component {
  constructor(props) {
    super(props);

    this.redirectToAdmin = this.redirectToAdmin.bind(this);
  }

  redirectToAdmin() {
    window.location.href = '/admin';
  }

  render() {
    return [<GeneratedForm title="Sign Up" params={{
      username: {
        label: 'Username',
        type: 'text',
        maximum: 20
      },
      email: {
        label: 'Email',
        type: 'email'
      },
      password: {
        label: 'Password',
        type: 'password'
      }
    }} method="post"
    formAction={urlUtils.serverInfo.path('/api/users/register')}
    successCallback={this.redirectToAdmin} />,
    <StyledDiv>
      <p>Have an account? Sign in <a href="/login">here</a>.</p>
    </StyledDiv>];
  }
}

export default SignupPage;
