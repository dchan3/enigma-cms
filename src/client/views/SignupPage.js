import React, { Component } from 'react';
import GeneratedForm from '../reusables/GeneratedForm';

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
    }} method="post" formAction={(process.env.SERVER_URL ||
    'http://localhost:' + (process.env.SERVER_PORT || 8080)) +
    '/api/users/register'} />,
    <div style={{ fontFamily: 'sans-serif', textAlign: 'center' }}>
      <p>Have an account? Sign in <a href="/login">here</a>.</p>
    </div>];
  }
}

export default SignupPage;
