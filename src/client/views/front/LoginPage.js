import React from 'react';
import { GeneratedForm, StyledDiv } from '../../reusables';

function LoginPage() {
  return [<GeneratedForm title="Sign In" params={{
    username: { label: 'Username or Email', type: 'text', required: true },
    password: { type: 'password', required: true }
  }} method="post" formAction='/api/users/login' redirectUrl='/admin' />,
  <StyledDiv>
    <p>Don't have an account? Sign up <a href="/signup">here</a>.</p>
  </StyledDiv>];
}

export default LoginPage;
