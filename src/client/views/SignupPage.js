import React, { Component } from 'react';
import GeneratedForm from '../reusables/GeneratedForm';
import { default as urlUtils } from '../utils';

class SignupPage extends Component {
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
    formAction={urlUtils.serverInfo.path('/api/users/register')} />,
    <div style={{ fontFamily: 'sans-serif', textAlign: 'center' }}>
      <p>Have an account? Sign in <a href="/login">here</a>.</p>
    </div>];
  }
}

export default SignupPage;
