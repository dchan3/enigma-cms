import React, { Component } from 'react';
import GeneratedForm from '../reusables/GeneratedForm';
import { default as urlUtils } from '../utils';

class LoginPage extends Component {
  render() {
    return [<GeneratedForm title="Sign In" params={{
      user: {
        label: 'Username or Email',
        type: 'text'
      },
      password: {
        label: 'Password',
        type: 'password'
      }
    }}
    method="post" formAction={urlUtils.serverInfo.path('/api/users/login')} />,
    <div style={{ fontFamily: 'sans-serif', textAlign: 'center' }}>
      <p>Don't have an account? Sign up <a href="/signup">here</a>.</p>
    </div>];
  }
}

export default LoginPage;
