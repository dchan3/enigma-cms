import React, { Component } from 'react';
import GeneratedForm from '../reusables/GeneratedForm';

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
    }} method="post" formAction={(process.env.SERVER_URL ||
      'http://localhost:' + (process.env.SERVER_PORT || 8080)) +
      '/api/users/login'} />,
    <div style={{ fontFamily: 'sans-serif', textAlign: 'center' }}>
      <p>Don't have an account? Sign up <a href="/signup">here</a>.</p>
    </div>];
  }
}

export default LoginPage;
