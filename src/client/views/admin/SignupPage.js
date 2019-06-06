import React from 'react';
import { GeneratedForm, StyledDiv } from '../../reusables';

function SignupPage() {
  return [<GeneratedForm title="Sign Up" params={{
    username: {
      type: 'text',
      maximum: 20
    },
    email: {
      type: 'email'
    },
    password: {
      type: 'password'
    }
  }} method="post"
  formAction='/api/users/register' redirectUrl='/admin' />,
  <StyledDiv>
    <p>Have an account? Sign in <a href="/login">here</a>.</p>
  </StyledDiv>];
}

export default SignupPage;
