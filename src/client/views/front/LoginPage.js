import React, { Component } from 'react';
import GeneratedForm from '../../reusables/GeneratedForm';
import { StyledDiv } from '../../reusables/styled';

class LoginPage extends Component {
  constructor(props) {
    super(props);

    this.redirectToAdmin = this.redirectToAdmin.bind(this);
  }

  redirectToAdmin() {
    window.location.href = '/admin';
  }

  render() {
    return [<GeneratedForm title="Sign In" params={{
      username: {
        label: 'Username or Email',
        type: 'text'
      },
      password: {
        label: 'Password',
        type: 'password'
      }
    }}
    method="post"
    formAction='/api/users/login' successCallback={this.redirectToAdmin} />,
    <StyledDiv>
      <p>Don't have an account? Sign up <a href="/signup">here</a>.</p>
    </StyledDiv>];
  }
}

export default LoginPage;
