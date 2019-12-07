import React from 'react';
import { GeneratedForm, StyledDiv, SamePageAnchor } from '../../reusables';

function LoginPage() {
  return [<GeneratedForm title="Sign In" params={{
    username: { label: 'Username or Email', type: 'text', required: true },
    password: { type: 'password', required: true }
  }} formAction='users/login' redirectUrl='/admin' />,
  <StyledDiv>
    <p>Don't have an account? Sign up <SamePageAnchor href="/signup">
    here</SamePageAnchor>.</p>
  </StyledDiv>];
}

export default LoginPage;
